import React, { useState } from "react";
import { useCreateAssignmentMutation } from "../../api-service/assignment/assignmentUpload.api";

interface CreateAssignmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	session_id: number;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
	isOpen,
	onClose,
	session_id,
}) => {
	const [description, setDescription] = useState("");
	const [title, setTitle] = useState("");
	const [url, setUrl] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [createAssignment] = useCreateAssignmentMutation();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		createAssignment({
			session_id: session_id,
			title: title,
			description: description,
			referenceUrl: url,
			dueDate: new Date(dueDate),
		})
			.unwrap()
			.then((data) => {
				console.log("FInished : ", data);
			})
			.catch((error) => console.log(error));
		setDescription("");
		setUrl("");
		setTitle("");
		setDueDate("");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-[#1C1C1C] text-white p-6 rounded-md w-[450px] shadow-lg border border-gray-700">
				<h2>Create Assignment</h2>
				<div onSubmit={handleSubmit}>
					<div style={{ marginBottom: 16 }}>
						<label>
							Title:
							<input
								type="text"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
								style={{ width: "100%", marginTop: 4 }}
							/>
						</label>
					</div>
					<div style={{ marginBottom: 16 }}>
						<label>
							Description:
							<input
								type="text"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								style={{ width: "100%", marginTop: 4 }}
							/>
						</label>
					</div>
					<div style={{ marginBottom: 16 }}>
						<label>
							Due Date:
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
								required
								style={{ width: "100%", marginTop: 4 }}
							/>
						</label>
					</div>
					<div style={{ marginBottom: 16 }}>
						<label>
							URL:
							<input
								type="url"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								required
								style={{ width: "100%", marginTop: 4 }}
							/>
						</label>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: 8,
						}}
					>
						<button type="button" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" onClick={handleSubmit}>
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateAssignmentModal;
