export const UserRoleType = {
  TRAINER: "trainer",
  MODERATOR: "moderator",
  CANDIDATE: "candidate"
} as const;

export type UserRole = typeof UserRoleType[keyof typeof UserRoleType];

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


export interface SessionData {
  trainer?: UserDetails;
  moderators?: Array<UserDetails>;
  description: string;
  materials?: Array<MaterialData>;
}

// export interface SessionPageProps {
//   userRole: UserRole;
//   sessionData: SessionData;
// }