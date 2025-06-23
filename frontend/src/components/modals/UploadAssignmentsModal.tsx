import React, {
	useState,
	type DragEvent,
	type ChangeEvent,
	useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useGetSessionByIdQuery } from "../../api-service/session/session.api";
import { useSubmitAssignmentMutation } from "../../api-service/assignment/assignmentUpload.api";
import Button, { ButtonType } from "../button/Button";
import type { AssignmentData } from "../../pages/session/components/sessionTypes";

interface UploadAssignmentsModalProps {
	isOpen: boolean;
	onClose: () => void;
	assignmentList: Array<AssignmentData>;
}

export const UploadAssignmentsModal: React.FC<UploadAssignmentsModalProps> = ({
	isOpen,
	onClose,
	assignmentList,
}) => {
	const [sessionDetails, setSessionDetails] = useState({ title: "" });
	const [selectedAssignment, setSelectedAssignment] = useState({});
	const [files, setFiles] = useState<File[]>([]);
	const [dragActive, setDragActive] = useState(false);
	const { sessionId } = useParams();
	const { data: sessionDetailsData } = useGetSessionByIdQuery({
		id: sessionId,
	});
	console.log(assignmentList);
	const [uploadAssignment] = useSubmitAssignmentMutation();

	useEffect(() => {
		if (sessionDetailsData) {
			setSessionDetails({ title: sessionDetailsData.title });
		}
	}, [sessionDetailsData]);

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(true);
	};

	const handleDragLeave = () => {
		setDragActive(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFiles([e.dataTransfer.files[0]]); // Only take the first file
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFiles([e.target.files[0]]); // Only take the first file
		}
	};

	const handleUpload = async (id: string) => {
		if (!id || files.length === 0) return;
		console.log("FIlessss : ", files);
		console.log("ID : ", id);
		const formData = new FormData();
		console.log(files[0]);
		const file = files[0];
		formData.append("file", file);
		// formData.append("id", id);
		for (const [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}
		// formData.save()
		// formData.append("id", id); // Ensure this key matches backend expectation
		console.log("formData : ", formData);
		try {
			await uploadAssignment({ id, formData } as any).unwrap();
			console.log("Uploaded assignment:", files[0].name);
		} catch (error) {
			console.error("Upload error:", error);
		}

		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 font-sans">
			<div className="bg-[#1C1C1C] text-white p-6 rounded-md w-[450px] shadow-lg border border-gray-700">
				<div className="flex justify-between items-center border-b border-gray-600 pb-3">
					<h2 className="text-xl font-medium">Upload Assignment</h2>

					<button
						onClick={onClose}
						className="text-2xl hover:text-red-500"
					>
						&times;
					</button>
				</div>
				{assignmentList.length === 0 ? (
					<span className="text-sm text-gray-400 ml-4">
						No assignments available
					</span>
				) : (
					<>
						<select
							className="bg-[#232323] border border-gray-600 text-white rounded px-2 py-1 ml-4"
							defaultValue=""
							onChange={(e) => {
								console.log(e.target.value);
								const selected = assignmentList.find(
									(a) => a.id == Number(e.target.value)
								);
								console.log("item : ", selected);
								setSelectedAssignment(selected || null);
								console.log("iten : ", selectedAssignment);
							}}
						>
							<option value="" disabled>
								Select Assignment
							</option>
							{assignmentList.map((assignment) => (
								<option
									key={assignment.id}
									value={assignment.id}
								>
									{assignment.title}
								</option>
							))}
						</select>{" "}
						<div className="mt-5">
							<label className="text-sm mb-2 block">
								{"Choose Submission File : "}
							</label>
						</div>
						<div
							className={`mt-2 border-2 ${
								dragActive ? "border-white" : "border-gray-600"
							} border-dashed rounded-md h-36 flex flex-col justify-center items-center text-gray-300 text-sm transition-colors cursor-pointer`}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() =>
								document
									.getElementById("assignmentInput")
									?.click()
							}
						>
							<input
								id="assignmentInput"
								type="file"
								className="hidden"
								onChange={handleFileChange}
							/>
							<div className="text-2xl">↑</div>
							<p className="mt-2">
								Drag a file here or click to browse
							</p>
						</div>
						<div>
							{files.length > 0 && (
								<div className="mt-4 text-sm text-gray-300">
									<ul className="list-disc ml-4">
										<li>{files[0].name}</li>
									</ul>
								</div>
							)}
						</div>
						<div className="flex justify-end gap-4 mt-6">
							<Button
								variant={ButtonType.PRIMARY}
								onClick={() => {
									console.log(selectedAssignment);
									handleUpload(selectedAssignment.id);
								}}
								disabled={files.length === 0}
							>
								Upload
							</Button>
							<Button
								variant={ButtonType.SECONDARY}
								onClick={onClose}
							>
								Cancel
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};
