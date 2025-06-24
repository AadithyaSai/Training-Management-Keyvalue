import { Repository } from "typeorm";
import { Training } from "../entities/training.entity";
import { TrainingUser, Role } from "../entities/training-users.entity";
import { TrainingDto } from "../dto/training.dto";

export default class TrainingRepository {
    constructor(private trainingRepo: Repository<Training>) {}

    // If you use findAll:
    findAll() {
        return this.trainingRepo.find({
            relations: ["members", "members.user", "sessions"],
        });
    }

    findTrainingsByUser(userId: number) {
        return this.trainingRepo
            .createQueryBuilder("training")
            .leftJoin("training.user", "member")
            .where("member.user.id = :userId", { userId })
            .getMany();
    }

    async findOneById(id: number) {
        const training = await this.trainingRepo.findOne({
            where: { id },
            relations: ["members", "members.user", "sessions"],
        });
        if (!training) {
            throw new Error(`Training with ID ${id} not found`);
        }
        return training;
    }

    saveTraining(trainingDto: Partial<TrainingDto>) {
        const training = this.trainingRepo.create(trainingDto);
        return this.trainingRepo.save(training);
    }

    async updateTraining(id: number, trainingDto: Partial<TrainingDto>) {
        const training = await this.trainingRepo.findOne({
            where: { id },
            relations: ["members", "members.user", "sessions"],
        });
        if (!training) {
            throw new Error(`Training with ID ${id} not found`);
        }

        const trainingAdmins = training.members.filter(member => member.role == "admin");
        await this.trainingRepo.save({ id, ...trainingDto, members: [...trainingAdmins] });
        await this.addMembers(id, trainingDto.members);
        return this.trainingRepo.findOne({
            where: { id },
            relations: ["members", "members.user", "sessions"],
        });
    }

    deleteTraining(id: number) {
        return this.trainingRepo.delete(id);
    }

    async addMembers(
        trainingId: number,
        members: { userId: number; role: string }[]
    ) {
        const insertValues = members.map((m) => ({
            training: { id: trainingId },
            user: { id: m.userId },
            role: m.role as Role,
        }));

        return this.trainingRepo.manager
            .getRepository(TrainingUser)
            .save(insertValues);
    }

    async removeMembers(
        trainingId: number,
        members: { userId: number; role: string }[]
    ) {
        const trainingUserRepo =
            this.trainingRepo.manager.getRepository(TrainingUser);

        for (const m of members) {
            await trainingUserRepo.delete({
                training: { id: trainingId },
                user: { id: m.userId },
                role: m.role as Role,
            });
        }

        return { message: "Members removed" };
    }
    async findProgramsByUserId(userId: number) {
        return this.trainingRepo.find({
            relations: ["members", "members.user", "sessions"],
            where: {
                members: {
                    user: { id: userId },
                },
            },
        });
    }
}
