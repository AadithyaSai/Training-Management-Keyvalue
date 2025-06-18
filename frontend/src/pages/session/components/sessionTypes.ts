export const UserRoleType = {
  TRAINER: "trainer",
  MODERATOR: "moderator",
  CANDIDATE: "candidate"
} as const;

export type UserRole = typeof UserRoleType[keyof typeof UserRoleType];

export interface SessionData {
  userRoles: [];
  description: string;
  uploadedMaterials?: string[];
}

// export interface SessionPageProps {
//   userRole: UserRole;
//   sessionData: SessionData;
// }