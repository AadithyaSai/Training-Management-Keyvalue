import React, { useState } from "react";
import { useCreateAssignmentMutation } from "../../api-service/assignment/assignmentUpload.api";
import Button from "../button/Button";

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
        <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded bg-[#232323] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description:
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded bg-[#232323] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Due Date:
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded bg-[#232323] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              URL:
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded bg-[#232323] border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-white"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose} variant="Secondary">
              Cancel
            </Button>
            <Button type="submit" variant="Primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
	);
};

export default CreateAssignmentModal;
