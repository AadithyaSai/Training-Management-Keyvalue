import type { CreateAssignmentPayload } from "../../../api-service/assignment/assignmentUpload.types";

export const UserRoleType = {
	TRAINER: "trainer",
	MODERATOR: "moderator",
	CANDIDATE: "candidate",
} as const;

export type UserRole = (typeof UserRoleType)[keyof typeof UserRoleType];

export interface UserData {
	id: number;
	role: UserRole;
}

export interface UserDetails {
	id: number;
	name: string;
}

export interface MaterialData {
	id: number;
	link: string;
}
export interface AssignmentData {
	id: number;
	description: string;
	title: string;
	referenceUrl?: string;
	dueDate: Date;
}

export interface SessionData {
	trainer?: UserDetails;
	moderators?: Array<UserDetails>;
	description: string;
	materials?: Array<MaterialData>;
	materialQualityFeedback?: string;
	sessionFeedback?: string;
	assignments?: Array<AssignmentData>;
}
