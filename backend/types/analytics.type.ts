import { Session } from "../entities/session.entity";
import { Training } from "../entities/training.entity";

export interface OverallAnalytics {
	totalUsers: number;
	totalAdminUsers: number;
	totalPrograms: number;
	totalSessions: number;
	draftPrograms: number;
	scheduledPrograms: number;
	activePrograms: number;
	completedPrograms: number;
	sessionsToday: number;
	sessionsThisWeek: number;
}

export interface UserAnalytics {
	id: number;
	username: string;
	email: string;
	isAdmin: boolean;
	totalPrograms: Training[];
	totalSessions: Session[];
	completedPrograms: Training[];
	activePrograms: Training[];
	upcomingPrograms: Training[];
	upcomingSessions: Session[];
	todaysSessions: Session[];
}
export interface ProgramAnalytics {
	program: Training;
	totalSessionCount: number;
	upcomingSessionsCount: number;
	totalAttendees: number;
	progress: number;
}
