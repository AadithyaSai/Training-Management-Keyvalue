import React from "react";

type Material = {
  id: number;
  link: string;
};

type MaterialsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  materials?: Material[];
};

const MaterialsModal: React.FC<MaterialsModalProps> = ({
  isOpen,
  onClose,
  materials,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#1c1c1c] text-white rounded-lg border border-borderColor w-[500px] max-h-[80vh] p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">MATERIALS</h2>
          <button
            className="text-white text-xl hover:text-red-400"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Material List */}
        <div className="border border-borderColor h-[250px] overflow-y-auto rounded-sm">
          {materials && materials.length > 0 ? (
            materials.map((material) => (
              <a
                key={material.id}
                href={material.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block p-3 text-sm text-white truncate border border-borderColor hover:bg-[#2c2c2c] transition-all duration-300"
              >
                {material.link}
              </a>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No materials available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsModal;