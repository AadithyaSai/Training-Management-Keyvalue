import express from "express";
import { userService } from "./user.route";
import { FeedbackService } from "../services/feedback.service";
import { FeedbackController } from "../controllers/feedback.controller";
import { FeedbackRepository } from "../repositories/feedback.repository";
import dataSource from "../db/dataSource";
import { Feedback } from "../entities/feedback.entity";

const feedbackRepository = new FeedbackRepository(
  dataSource.getRepository(Feedback)
);

const feedbackService = new FeedbackService(feedbackRepository);

const feedbackRouter = express.Router({ mergeParams: true });
const feedbackController = new FeedbackController(
  feedbackService,
  feedbackRouter
);

export default feedbackRouter;
