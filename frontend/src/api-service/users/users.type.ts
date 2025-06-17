export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  isAdmin: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
