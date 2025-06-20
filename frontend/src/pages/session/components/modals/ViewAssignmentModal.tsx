import React from "react";
type Assignment = {
  id: number;
  completionLink: string;
};
type AssignmentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assignments?: Assignment[];
};
const ViewAssignmentsModal: React.FC<AssignmentsModalProps> = ({
  isOpen,
  onClose,
  assignments,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#1C1C1C] text-white rounded-lg border border-gray-400 w-[500px] max-h-[80vh] p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">ASSIGNMENTS</h2>
          <button
            className="text-white text-xl hover:text-red-400"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {/* Scrollable Assignment List */}
        <div className="border border-gray-400 p-3 h-[250px] overflow-y-auto space-y-2">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => (
              <a
                key={assignment.id}
                href={assignment.completionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-400 hover:underline truncate"
              >
                {assignment.completionLink}
              </a>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No assignments available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewAssignmentsModal;