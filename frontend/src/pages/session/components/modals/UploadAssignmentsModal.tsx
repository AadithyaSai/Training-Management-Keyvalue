import React, { useState, type DragEvent, type ChangeEvent } from "react";

interface UploadAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAssignmentsModal: React.FC<UploadAssignmentsModalProps> = ({
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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 font-sans">
      <div className="bg-[#1C1C1C] text-white p-6 rounded-md w-[450px] shadow-lg border border-gray-700">
        <div className="flex justify-between items-center border-b border-gray-600 pb-3">
          <h2 className="text-xl font-medium">Upload Assignments</h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">&times;</button>
        </div>
        <div className="mt-5">
          <label className="text-sm mb-2 block">Session Name</label>
        </div>
        <div
          className={`mt-2 border-2 ${
            dragActive ? "border-white" : "border-gray-600"
          } border-dashed rounded-md h-36 flex flex-col justify-center items-center text-gray-300 text-sm transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
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
        {files.length > 0 && (
          <div className="mt-4 text-sm text-gray-300 max-h-24 overflow-y-auto">
            <ul className="list-disc ml-4 space-y-1">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-white text-black hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 text-sm rounded-md border border-white hover:bg-white hover:text-black transition disabled:opacity-50"
            disabled={files.length === 0}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};