import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import AbstractBaseEntity from "./abstract.entity";
import { Session } from "./session.entity";
import AssignmentSubmission from "./assignmentSubmission.entity";

@Entity("assignments")
export class Assignment extends AbstractBaseEntity {
  @ManyToOne(() => Session, (session) => session.assignments, {
    onDelete: "CASCADE",
  })
  session: Session;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  referenceUrl?: string;

  @Column({ type: "date" })
  dueDate: Date;

  @OneToMany(
    () => AssignmentSubmission,
    (assignmentSubmission) => assignmentSubmission.assignment
  )
  submissions: AssignmentSubmission[];
}
