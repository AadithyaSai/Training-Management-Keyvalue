import { Repository } from "typeorm";
import { Material } from "../entities/material.entity";
import { Session } from "../entities/session.entity";

export class MaterialRepository {
  constructor(private repository: Repository<Material>) {}

  async create(material: Material): Promise<Material> {
    return this.repository.save(material);
  }

  async getById(id: number): Promise<Material | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        session:true,
      },
    });
  }


  async getAll(): Promise<Material[]> {
    return this.repository.find({
      relations: {
        session:true,
      },
    });
  }

  async update(id: number, data: Partial<Material>): Promise<Material | null> {
    return this.repository.save({ id, ...data });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete({ id });
  }

  async getBySessionId(session: Session): Promise<Material[]> {
    return this.repository.find({ where: { session } });
  }

  async getCountBySessionId(session: Session): Promise<number> {
    return this.repository.count({ where: { session } });
  }
}
