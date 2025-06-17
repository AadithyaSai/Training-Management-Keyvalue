export type TrainingDetailsPayload = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

export type addMembersPayload = {
  trainingId: number;
  members: {
    userId: number;
    role: string;
  }[];
};
