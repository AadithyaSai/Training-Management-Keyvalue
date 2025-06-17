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
    trainingDto: Partial<Training> & {
      members?: { userId: number; role: string }[];
    }
  ) {
    const { members, ...trainingData } = trainingDto;
    const training = await this.trainingRepository.saveTraining(trainingData);
    if (members && members.length > 0) {
      await this.trainingRepository.addMembers(training.id, members);
    }
    return training;
  }

  async updateTraining(id: number, trainingDto: Partial<Training>) {
    return this.trainingRepository.updateTraining(id, trainingDto);
  }

  async deleteTraining(id: number) {
    return this.trainingRepository.deleteTraining(id);
  }

  addMembers(trainingId: number, members: { userId: number; role: string }[]) {
    return this.trainingRepository.addMembers(trainingId, members);
  }

 
  removeMembers(
  trainingId: number,
  members: { userId: number; role: string }[]
) {
  return this.trainingRepository.removeMembers(trainingId, members);
}

}
