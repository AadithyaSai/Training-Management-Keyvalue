export type AssignmentPayload = {
	id: string;
	formData: {
		file: File;
	};
};
export type CreateAssignmentPayload = {
	description: string;
	title: string;
	session_id: number;
	referenceUrl?: string;
	dueDate: Date;
};
