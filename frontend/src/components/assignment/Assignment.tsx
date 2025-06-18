import { useState, type DragEvent, type ChangeEvent } from "react";
import Button, { ButtonType } from "../button/Button";

type UploadAssignmentsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const UploadAssignmentsModal: React.FC<UploadAssignmentsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    if (!isOpen) return null;
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
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };
    const handleUpload = () => {
        console.log("Uploading files:", files);
        onClose(); // Simulate upload completion
    };
    return (
        <div className="fixed w-full h-full z-50 flex items-center justify-center bg-modalBgColor bg-opacity-70 font-sans">
            <div className="bg-[#1C1C1C] text-white p-6 rounded-md w-[550px] shadow-lg border border-gray-700">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                    <h2 className="text-xl font-medium">Upload Assignments</h2>
                    <button
                        onClick={onClose}
                        className="text-3xl hover:text-red-500"
                    >
                        &times;
                    </button>
                </div>
                {/* Session Name Label */}
                <div className="mt-5">
                    <label className="text-md mb-5 block">Session Name</label>
                </div>
                {/* Drag & Drop Upload */}
                <div
                    className={`mt-2 border-2 ${
                        dragActive ? "border-white" : "border-gray-600"
                    } border-dashed rounded-md h-70 flex flex-col justify-center items-center text-gray-300 text-sm transition-colors cursor-pointer`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() =>
                        document.getElementById("fileInput")?.click()
                    }
                >
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                    />
                    <div className="text-2xl">↑</div>
                    <p className="mt-2">Drag files here or browse</p>
                </div>
                {/* File List */}
                {files.length > 0 && (
                    <div className="mt-4 text-sm text-gray-300 max-h-24 overflow-y-auto">
                        <ul className="list-disc ml-4 space-y-1">
                            {files.map((file, index) => (
                                <li key={`${file.name}-${index}`}>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Footer Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        variant={ButtonType.PRIMARY}
                        onClick={handleUpload}
                        // className="px-4 py-2 text-sm rounded-md border border-white hover:bg-white hover:text-black transition disabled:opacity-50"
                        disabled={files.length === 0}
                    >
                        Upload
                    </Button>
                    <Button variant={ButtonType.SECONDARY} onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UploadAssignmentsModal;
