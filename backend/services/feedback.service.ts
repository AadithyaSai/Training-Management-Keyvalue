import { FeedbackRepository } from "../repositories/feedback.repository";
import { Feedback, FeedbackType } from "../entities/feedback.entity";
import { CreateFeedbackDto, UpdateFeedbackDto } from "../dto/feedback.dto";
import { userService } from "../routes/user.route";
import { Session } from "../entities/session.entity";
import LoggerService from "./logger.service";
import { sessionService } from "../routes/session.routes";
import { ENABLE_AI, FASTAPI_URL } from "../utils/constants";
import { title } from "process";

export class FeedbackService {
	private logger = LoggerService.getInstance(FeedbackService.name);

	constructor(private feedbackRepository: FeedbackRepository) {}

	async createFeedback(
		createFeedbackDto: CreateFeedbackDto
	): Promise<Feedback> {
		const feedback = new Feedback();

		const sender = await userService.findOneById(createFeedbackDto.fromId);
		if (!sender) {
			throw new Error(`Invalid sender ID`);
		}
		if (createFeedbackDto.fromId === createFeedbackDto.toId) {
			throw new Error(`Sender and recipient cannot be the same`);
		}
		const recipient = await userService.findOneById(createFeedbackDto.toId);
		if (!recipient) {
			throw new Error(`Invalid recipient ID`);
		}

		feedback.from = sender;
		feedback.to = recipient;
		const session = await sessionService.findOneById(
			createFeedbackDto.sessionId
		);
		if (!session) {
			throw new Error(`Invalid session ID`);
		}

		feedback.session = session;
		feedback.rating = createFeedbackDto.rating;
		feedback.comments = createFeedbackDto.comments;
		feedback.type = createFeedbackDto.type;
		return this.feedbackRepository.create(feedback);
	}

	async updateFeedback(
		id: number,
		data: UpdateFeedbackDto
	): Promise<Feedback | null> {
		const feedback = await this.feedbackRepository.getById(id);
		if (!feedback) {
			throw new Error(`Required feedback not found`);
		}
		this.logger.info("feedback to update" + feedback);
		if (data.fromId) {
			const sender = await userService.findOneById(data.fromId);
			if (!sender) {
				throw new Error(`Invalid sender ID`);
			}
			feedback.from = sender;
		}
		if (data.toId) {
			const recipient = await userService.findOneById(data.toId);
			if (!recipient) {
				throw new Error(`Invalid recipient ID`);
			}
			feedback.to = recipient;
		}
		if (data.sessionId) {
			const session = await sessionService.findOneById(data.sessionId);
			if (!session) {
				throw new Error(`Invalid session ID`);
			}
			feedback.session = session;
		}

		feedback.rating = data.rating || feedback.rating;
		feedback.comments = data.comments || feedback.comments;
		return this.feedbackRepository.update(id, feedback);
	}
	async getFeedbackById(id: number): Promise<Feedback> {
		const feedback = await this.feedbackRepository.getById(id);
		if (!feedback) {
			throw new Error(`Feedback not found`);
		}
		return feedback;
	}
	async getAllFeedbacks(): Promise<Feedback[]> {
		return this.feedbackRepository.getAll();
	}
	async deleteFeedback(id: number): Promise<void> {
		const feedback = await this.feedbackRepository.getById(id);
		if (!feedback) {
			throw new Error(`Feedback not found`);
		}
		return this.feedbackRepository.delete(id);
	}
	async getFeedbackBySenderId(fromId: number): Promise<Feedback[]> {
		const sender = await userService.findOneById(fromId);
		if (!sender) {
			throw new Error(`Invalid sender ID`);
		}
		return this.feedbackRepository.getBySender(sender);
	}
	async getFeedbackByReceiverId(toId: number): Promise<Feedback[]> {
		const sender = await userService.findOneById(toId);
		if (!sender) {
			throw new Error(`Invalid receiver ID`);
		}
		return this.feedbackRepository.getByReceiver(sender);
	}
	async getFeedbackBySessionId(sessionId: number): Promise<Feedback[]> {
		const session = await sessionService.findOneById(sessionId);
		this.logger.info("session to get feedback" + session.id);
		if (!session) {
			throw new Error(`Invalid session ID`);
		}
		return this.feedbackRepository.getBySession(sessionId);
	}
	async getFeedbackBySessionAndType(
		type: FeedbackType,
		sessionId: number
	): Promise<Feedback[]> {
		const session = await sessionService.findOneById(sessionId);
		if (!session) {
			throw new Error(`Invalid session ID`);
		}

		const feedbacks = this.feedbackRepository.getBySessionAndType(
			type,
			sessionId
		);
		if (ENABLE_AI) {
			const comments = (await feedbacks).map(
				(feedback) => feedback.comments
			);
			this.logger.info("Comments:" + comments);
			await sessionService.updateAiFeedbackForSession(
				sessionId,
				comments
			);
		}

		return feedbacks;
	}
}
