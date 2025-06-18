import { Request, Response, NextFunction } from "express";
import type TrainingService from "../services/training.service";
import { Training } from "../entities/training.entity";

export default class TrainingController {
  constructor(private trainingService: TrainingService) {}

  async getTrainings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id ? parseInt(req.params.id) : undefined;

      const trainings = await this.trainingService.getAllTrainings(userId);
      res.status(200).json(trainings);
    } catch (err) {
      next(err);
    }
  }

  async getTrainingDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);

      const training = await this.trainingService.getTrainingById(id);
      res.status(200).json(training);
    } catch (err) {
      next(err);
    }
  }

  async createTraining(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.trainingService.createTraining(
        req.body,
        req.user.id
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async updateTraining(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.trainingService.updateTraining(id, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async deleteTraining(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      await this.trainingService.deleteTraining(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async addMembers(req: Request, res: Response) {
    const members = await this.trainingService.addMembers(
      +req.params.id,
      req.body.members
    );
    return res.status(201).json(members);
  }

  // async removeMembers(req: Request, res: Response) {
  //   await this.trainingService.removeMembers(+req.params.id, req.body.userIds);
  //   return res.status(204).send();
  // }
  async removeMembers(req: Request, res: Response) {
    await this.trainingService.removeMembers(+req.params.id, req.body.members);
    return res.status(204).send();
  }
}
