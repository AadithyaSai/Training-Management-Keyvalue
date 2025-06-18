import { Router } from "express";
import AnalyticsController from "../controllers/analytics.controller";
import AnalyticsService from "../services/analytics.service";
import { userService } from "./user.route";

const analyticsService = new AnalyticsService(userService);
const analyticsController = new AnalyticsController(analyticsService);

const analyticsRouter = Router();
analyticsRouter.get(
  "/count",
  analyticsController.getUserCount.bind(analyticsController)
);
analyticsRouter.get(
  "/overview",
  analyticsController.getOverallAnalytics.bind(analyticsController)
);
analyticsRouter.get(
  "/users/:id",
  analyticsController.getUserAnalytics.bind(analyticsController)
);
analyticsRouter.get(
  "/programs/:id",
  analyticsController.getSingleProgramAnalytics.bind(analyticsController)
);
analyticsRouter.get(
  "/export/users",
  analyticsController.exportUserList.bind(analyticsController)
);
analyticsRouter.get(
  "/export/programs",
  analyticsController.exportProgramList.bind(analyticsController)
);
analyticsRouter.get(
  "/export/programs/:id",
  analyticsController.exportSingleProgram.bind(analyticsController)
);
analyticsRouter.get(
  "/export/sessions",
  analyticsController.exportSessionList.bind(analyticsController)
);
analyticsRouter.get(
  "/export/sessions/:id",
  analyticsController.exportSingleSession.bind(analyticsController)
);

export default analyticsRouter;
export { analyticsController, analyticsService };
