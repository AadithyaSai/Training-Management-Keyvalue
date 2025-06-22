import { TrainingDto } from "../dto/training.dto";
import { Training } from "../entities/training.entity";
import type TrainingRepository from "../repositories/training.repository";

export default class TrainingService {
    constructor(private trainingRepository: TrainingRepository) {}

    async getAllTrainings(userId?: number) {
        if (userId) return this.trainingRepository.findOneById(userId);
        return this.trainingRepository.findAll();
    }

    async getTrainingById(id: number) {
        return this.trainingRepository.findOneById(id);
    }

    async createTraining(
        trainingDto: Partial<TrainingDto> & {
            members?: { userId: number; role: string }[];
        },
        creatorId: number
    ) {
        const { members = [], ...trainingData } = trainingDto;

        const training = await this.trainingRepository.saveTraining(
            trainingData
        );

        members.push({ userId: creatorId, role: "admin" });

        await this.trainingRepository.addMembers(training.id, members);

        return training;
    }

    async updateTraining(id: number, trainingDto: Partial<Training>) {
        return this.trainingRepository.updateTraining(id, trainingDto);
    }

    async deleteTraining(id: number) {
        return this.trainingRepository.deleteTraining(id);
    }

    addMembers(
        trainingId: number,
        members: { userId: number; role: string }[]
    ) {
        return this.trainingRepository.addMembers(trainingId, members);
    }

    removeMembers(
        trainingId: number,
        members: { userId: number; role: string }[]
    ) {
        return this.trainingRepository.removeMembers(trainingId, members);
    }
    async getProgramsByUserId(userId: number) {
        return this.trainingRepository.findProgramsByUserId(userId);
    }
}
