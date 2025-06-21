import cors from "cors";
import express from "express";

import dataSource from "./db/dataSource";
import LoggerService from "./services/logger.service";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import authMiddleware from "./middlewares/auth.middleware";
import sessionRouter from "./routes/session.routes";
import materialRouter from "./routes/material.route";
import trainingRouter from "./routes/training.route";
import feedbackRouter from "./routes/feedback.routes";
import analyticsRouter from "./routes/analytics.routes";
import assignmentRouter from "./routes/assignment.routes";

const PORT = 3000;

const server = express();
const logger = LoggerService.getInstance("index()");

// Middleware
server.use(cors());
server.use(express.json());

// Global routes
server.get("/health", (req, res) => {
	res.status(200).json({ message: "Server is healthy" });
});

// Import routes
server.use("/auth", authRouter);

server.use("/users", userRouter);

server.use(authMiddleware); // Apply auth middleware to all routes below this point

// server.use("/users", userRouter);
server.use("/session", sessionRouter);
server.use("/material", materialRouter);
server.use("/trainings", trainingRouter);
server.use("/feedback", feedbackRouter);
server.use("/assignments", assignmentRouter);
server.use("/analytics", analyticsRouter);
server.use(errorMiddleware);

(async () => {
	try {
		await dataSource.initialize();
		logger.info("Connected to db");
		server.listen(PORT, () => {
			logger.info(`Server listening to ${PORT}`);
		});
	} catch (error) {
		logger.error(`Failed to connect to db - ${error.message}`);
		process.exit(0);
	}
})();
