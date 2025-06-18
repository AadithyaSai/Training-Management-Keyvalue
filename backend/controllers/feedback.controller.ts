import { Request, Response, NextFunction, Router } from "express";
import { FeedbackService } from "../services/feedback.service";
import { Feedback, FeedbackType } from "../entities/feedback.entity";
import HTTPException from "../exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../dto/feedback.dto";
import { validate } from "class-validator";
import LoggerService from "../services/logger.service";
import { sessionService } from "../routes/session.routes";
import { AuthRoles } from "../types/authorization.type";
import validRoles from "../middlewares/authorization.middleware";

export class FeedbackController {
  private logger = LoggerService.getInstance(FeedbackController.name);

  constructor(
    private feedbackService: FeedbackService,
    feedbackRouter: Router
  ) {
    feedbackRouter.post(
      "/",
      validRoles([AuthRoles.CANDIDATE, AuthRoles.TRAINER, AuthRoles.MODERATOR]),
      this.createFeedback.bind(this)
    );
    feedbackRouter.get(
      "/",
      validRoles([AuthRoles.ADMIN]),
      this.getAllFeedbacks.bind(this)
    );
    feedbackRouter.get(
      "/:id",
      validRoles([AuthRoles.ADMIN]),
      this.getFeedbackById.bind(this)
    );
    feedbackRouter.get(
      "/sent/:sender_id",
      validRoles([AuthRoles.ADMIN]),
      this.getFeedbackBySenderId.bind(this)
    );
    feedbackRouter.get(
      "/receive/:receiver_id",
      validRoles([AuthRoles.ADMIN]),
      this.getFeedbackByReceiverId.bind(this)
    );
    feedbackRouter.get(
      "/session/:session_id",
      validRoles([AuthRoles.ADMIN]),
      this.getFeedbackBySessionId.bind(this)
    );
    feedbackRouter.post(
      "/session/:session_id",
      validRoles([AuthRoles.ADMIN]),
      this.getFeedbackBySessionAndType.bind(this)
    );
    feedbackRouter.patch(
      "/:id",
      validRoles([AuthRoles.ADMIN]),
      this.updateFeedback.bind(this)
    );
    feedbackRouter.delete(
      "/:id",
      validRoles([AuthRoles.ADMIN]),
      this.deleteFeedback.bind(this)
    );
  }

  async createFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const createFeedbackDto = plainToInstance(CreateFeedbackDto, data);
      const err = await validate(createFeedbackDto);
      if (err.length > 0) {
        this.logger.error("Validation failed" + err);
        throw new HTTPException(400, "Invalid input data");
      }
      const feedback = await this.feedbackService.createFeedback(
        createFeedbackDto
      );
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async getAllFeedbacks(req: Request, res: Response, next: NextFunction) {
    try {
      const feedbacks = await this.feedbackService.getAllFeedbacks();
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }

  async getFeedbackById(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      const feedback = await this.feedbackService.getFeedbackById(id);
      if (!feedback) {
        throw new HTTPException(404, "Feedback not found");
      }
      res.status(200).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async updateFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      const data = req.body;
      const updateFeedbackDto = plainToInstance(UpdateFeedbackDto, data);
      const err = await validate(updateFeedbackDto);
      if (err.length > 0) {
        this.logger.error("Validation failed" + err);
        throw new HTTPException(400, "Invalid input data");
      }
      const updated = await this.feedbackService.updateFeedback(
        id,
        updateFeedbackDto
      );
      if (!updated) {
        return res.status(404).json({ message: "Feedback not found" });
      }
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async deleteFeedback(req: Request, res: Response, next: NextFunction) {
    try {
      const id: number = parseInt(req.params.id);
      await this.feedbackService.deleteFeedback(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackBySenderId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: number = parseInt(req.params.sender_id);
      const feedbacks = await this.feedbackService.getFeedbackBySenderId(
        userId
      );
      if (!feedbacks || feedbacks.length === 0) {
        throw new HTTPException(404, "No feedback was sent by the user");
      }
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackByReceiverId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId: number = parseInt(req.params.receiver_id);
      const feedbacks = await this.feedbackService.getFeedbackByReceiverId(
        userId
      );
      if (!feedbacks || feedbacks.length === 0) {
        throw new HTTPException(404, "No feedback was rceeived by this user");
      }
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackBySessionId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sessionId: number = parseInt(req.params.session_id);
      const feedbacks = await this.feedbackService.getFeedbackBySessionId(
        sessionId
      );
      this.logger.info("feedbacks for session " + feedbacks);
      if (!feedbacks || feedbacks.length === 0) {
        throw new HTTPException(404, "No feedback found for this session");
      }
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
  async getFeedbackBySessionAndType(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sessionId: number = parseInt(req.params.session_id);
      const type: FeedbackType = req.body.type as FeedbackType;
      const feedbacks = await this.feedbackService.getFeedbackBySessionAndType(
        type,
        sessionId
      );
      if (!feedbacks || feedbacks.length === 0) {
        throw new HTTPException(404, "No feedback found for this session");
      }
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
}
