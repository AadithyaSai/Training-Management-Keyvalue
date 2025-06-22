import { NextFunction, Request, Response } from "express";
import AnalyticsService from "../services/analytics.service";

export default class AnalyticsController {
	constructor(private analyticsService: AnalyticsService) {}

	async getUserCount(req: Request, res: Response, next: NextFunction) {
		try {
			const userCount = await this.analyticsService.getUserCount();
			res.status(200).json({ userCount });
		} catch (error) {
			next(error);
		}
	}

	async getOverallAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const analytics = await this.analyticsService.getOverallAnalytics();
			res.status(200).json(analytics);
		} catch (error) {
			next(error);
		}
	}

	async getUserAnalytics(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = parseInt(req.params.id, 10);
      const analytics = await this.analyticsService.getUserAnalytics(userId);
			res.status(200).json(analytics);
		} catch (error) {
			next(error);
		}
	}

	async getSingleProgramAnalytics(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const programId = parseInt(req.params.id, 10);
      const analytics = await this.analyticsService.getSingleProgramAnalytics(
					programId
				);
			res.status(200).json(analytics);
		} catch (error) {
			next(error);
		}
	}

	async exportUserList(req: Request, res: Response, next: NextFunction) {
		try {
			const csvBuffer = await this.analyticsService.exportUserList();
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=user_list.csv"
			);
			res.send(csvBuffer);
		} catch (error) {
			next(error);
		}
	}

	async exportProgramList(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user.id;
			const csvBuffer = await this.analyticsService.exportProgramList(
				userId
			);
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=program_list.csv"
			);
			res.send(csvBuffer);
		} catch (error) {
			next(error);
		}
	}

	async exportSingleProgram(req: Request, res: Response, next: NextFunction) {
		try {
			const programId = parseInt(req.params.id, 10);
			const csvBuffer = await this.analyticsService.exportSingleProgram(
				programId
			);
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=program_${programId}.csv`
			);
			res.send(csvBuffer);
		} catch (error) {
			next(error);
		}
	}

	async exportSessionList(req: Request, res: Response, next: NextFunction) {
		try {
			const csvBuffer = await this.analyticsService.exportSessionList();
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				"attachment; filename=session_list.csv"
			);
			res.send(csvBuffer);
		} catch (error) {
			next(error);
		}
	}

	async exportSingleSession(req: Request, res: Response, next: NextFunction) {
		try {
			const sessionId = parseInt(req.params.id, 10);
			const csvBuffer = await this.analyticsService.exportSingleSession(
				sessionId
			);
			res.setHeader("Content-Type", "text/csv");
			res.setHeader(
				"Content-Disposition",
				`attachment; filename=session_${sessionId}.csv`
			);
			res.send(csvBuffer);
		} catch (error) {
			next(error);
		}
	}
}
