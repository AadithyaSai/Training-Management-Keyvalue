import { Column, Entity, OneToMany } from "typeorm";
import AbstractBaseEntity from "./abstract.entity";
import { Session } from "./session.entity";

@Entity()
export class Training extends AbstractBaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @OneToMany(() => Session, (session) => session.training)
  sessions: Session[];
}
