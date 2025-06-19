import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	Timestamp,
} from "typeorm";
import AbstractBaseEntity from "./abstract.entity";

import { Assignment } from "./assignment.entity";
import { Feedback } from "./feedback.entity";
import { UserSession } from "./user-session.entity";
import { Material } from "./material.entity";
import { Training } from "./training.entity";

export enum Status {
	Draft = "Draft",
	Scheduled = "Scheduled",
	InProgress = "InProgress",
	Completed = "Completed",
}

@Entity()
export class Session extends AbstractBaseEntity {
	@Column()
	title: string;

	@ManyToOne(() => Training, (training) => training.sessions)
	training: Training;

	@Column()
	description: string;

	@Column({ default: "Draft" as Status })
	status: Status;

	@Column({ nullable: true })
	preReq: string;

	@Column({ type: "timestamp", nullable: true })
	date?: Date;

	@Column({ nullable: true })
	slot?: number;

	@Column({ nullable: true })
	duration?: number;

	@Column({ type: "text", nullable: true })
	materialQualityFeedback?: string;

	@Column({ type: "text", nullable: true })
	sessionFeedback?: string;

	@OneToMany(() => Assignment, (assignments) => assignments.session, {})
	assignments?: Assignment[];

	@OneToMany(() => Feedback, (feedbacks) => feedbacks.session, {})
	feedbacks?: Feedback[];

	@OneToMany(() => UserSession, (userSession) => userSession.session, {
		cascade: true,
	})
	userSessions?: UserSession[];

	@OneToMany(() => Material, (material) => material.session, {
		cascade: true,
	})
	materials?: Material[];
}
