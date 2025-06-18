export const AuthRoles = {
  PUBLIC: "PUBLIC",
  OWN: "OWN", // Used for endpoints that only allow access to the user themselves
  ADMIN: "ADMIN",
  TRAINING_ADMIN: "TRAINING_ADMIN", // Admins of training programs
  MODERATOR: "MODERATOR",
  TRAINER: "TRAINER",
  CANDIDATE: "CANDIDATE",
} as const;

export type AuthRole = keyof typeof AuthRoles;
