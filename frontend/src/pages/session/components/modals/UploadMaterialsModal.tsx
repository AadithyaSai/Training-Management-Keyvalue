import React, {
    useState,
    type DragEvent,
    type ChangeEvent,
    useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { useGetSessionByIdQuery } from "../../../../api-service/session/session.api";
import { useCreateMaterialMutation } from "../../../../api-service/uploadMaterial/uploadMaterial.api";
import Button, { ButtonType } from "../../../../components/button/Button";

interface UploadMaterialsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadMaterialsModal: React.FC<UploadMaterialsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [sessionDetails, setSessionDetails] = useState({ title: "" });
    const [files, setFiles] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const { sessionId } = useParams();
    const { data: sessionDetailsData } = useGetSessionByIdQuery({
        id: sessionId,
    });
    const [uploadMaterial] = useCreateMaterialMutation();

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
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles([newFiles[0]]); // Only take the first file
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles([e.target.files[0]]); // Only keep one file
        }
    };

    const handleUpload = async () => {
        if (!sessionId || files.length === 0) return;

        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("sessionId", sessionId);

        try {
            await uploadMaterial(formData as any).unwrap();
            console.log("Uploaded file:", files[0].name);
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
                    <h2 className="text-xl font-medium">Upload Material</h2>
                    <button
                        onClick={onClose}
                        className="text-2xl hover:text-red-500"
                    >
                        &times;
                    </button>
                </div>
                <div className="mt-5">
                    <label className="text-sm mb-2 block">
                        {sessionDetails.title}
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
                        document.getElementById("fileInput")?.click()
                    }
                >
                    <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <div className="text-2xl">↑</div>
                    <p className="mt-2">Drag a file here or click to browse</p>
                </div>
                {files.length > 0 && (
                    <div className="mt-4 text-sm text-gray-300">
                        <ul className="list-disc ml-4">
                            <li>{files[0].name}</li>
                        </ul>
                    </div>
                )}
                <div className="flex justify-end gap-4 mt-6">
                  <Button
                        variant={ButtonType.PRIMARY}
                        onClick={handleUpload}
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
            </div>
        </div>
    );
};
