import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Layout from "../../components/layout/Layout";
import FormInput from "../../components/formInput/FormInput";
import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import {
    useGetSessionByIdQuery,
    useUpdateSessionMutation,
} from "../../api-service/session/session.api";
import { useNavigate, useParams } from "react-router-dom";

type SelectModalProps = {
    title: string;
    options: string[];
    selected: string[];
    multiSelect?: boolean;
    onClose: () => void;
    onSelect: (selected: string[]) => void;
};

const SelectModal: React.FC<SelectModalProps> = ({
    title,
    options,
    selected,
    multiSelect = true,
    onClose,
    onSelect,
}) => {
    const [localSelection, setLocalSelection] = useState<string[]>(selected);

    const toggleOption = (option: string) => {
        if (multiSelect) {
            if (localSelection.includes(option)) {
                setLocalSelection(
                    localSelection.filter((item) => item !== option)
                );
            } else {
                setLocalSelection([...localSelection, option]);
            }
        } else {
            setLocalSelection([option]);
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-modalBgColor flex items-center justify-center z-50">
            <div className="bg-cardColor border border-borderColor rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>
                    <Button onClick={onClose}>
                        <X className="text-gray-300 hover:text-white" />
                    </Button>
                </div>
                <div className="space-y-2">
                    {options.map((option) => (
                        <label
                            key={option}
                            className="flex items-center gap-2 text-white"
                        >
                            <input
                                type={multiSelect ? "checkbox" : "radio"}
                                checked={localSelection.includes(option)}
                                onChange={() => toggleOption(option)}
                                name={multiSelect ? option : "single-select"}
                            />
                            {option}
                        </label>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        variant={ButtonType.PRIMARY}
                        onClick={() => {
                            onSelect(localSelection);
                            onClose();
                        }}
                    >
                        Save
                    </Button>
                    <Button onClick={onClose} variant={ButtonType.SECONDARY}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
};

const UpdateSession = () => {
    const [sessionDetails, setSessionDetails] = useState({
        programId: 0,
        title: "",
        description: "",
        date: "",
        duration: 0,
    });

    const [selectedTrainer, setSelectedTrainer] = useState<string[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);
    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const navigate = useNavigate();
    const { trainingId, sessionId } = useParams();
    const { data: sessionDetailsData } = useGetSessionByIdQuery({
        id: sessionId,
    });

    const [updateSession, { isLoading }] = useUpdateSessionMutation();

    useEffect(() => {
        if (sessionDetailsData) {
            setSessionDetails({
                programId: sessionDetailsData.training.id,
                title: sessionDetailsData.title,
                description: sessionDetailsData.description,
                date: sessionDetailsData.date,
                duration: sessionDetailsData.duration,
            });
        }
    }, [sessionDetailsData]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (
            !sessionDetails.title.trim() ||
            sessionDetails.title.trim().length < 3
        ) {
            newErrors.title = "Title must be at least 3 characters.";
        }
        if (
            !sessionDetails.description.trim() ||
            sessionDetails.description.trim().length < 10
        ) {
            newErrors.description =
                "Description must be at least 10 characters.";
        }
        if (sessionDetails.duration <= 0) {
            newErrors.duration = "Duration must be greater than 0.";
        }
        if (selectedTrainer.length !== 1) {
            newErrors.trainer = "Please select one trainer.";
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        updateSession({ id: sessionId, data: sessionDetails })
            .unwrap()
            .then(() => navigate(`/training/${trainingId}`))
            .catch((error) => console.error(error));
    };

    const handleCancel = () => {
        setSelectedTrainer([]);
        setSelectedModerators([]);
        navigate(-1);
    };

    return (
        <Layout title="Update Session" isLoading={isLoading}>
            <div className="flex flex-col w-full gap-6 mb-6 bg-cardColor border border-borderColor p-4 rounded">
                <div>
                    <FormInput
                        name="session-name"
                        label="Session Name"
                        value={sessionDetails.title}
                        onChange={(e) =>
                            setSessionDetails({
                                ...sessionDetails,
                                title: e.target.value,
                            })
                        }
                    />
                    {errors.title && (
                        <div className="text-red-500 text-sm">
                            {errors.title}
                        </div>
                    )}
                </div>

                <div>
                    <FormInput
                        name="session-duration"
                        label="Session Duration"
                        type="number"
                        value={String(sessionDetails.duration)}
                        onChange={(e) =>
                            setSessionDetails({
                                ...sessionDetails,
                                duration: Number(e.target.value),
                            })
                        }
                    />
                    {errors.duration && (
                        <div className="text-red-500 text-sm">
                            {errors.duration}
                        </div>
                    )}
                </div>

                <div>
                    <FormInput
                        name="session-description"
                        label="Session Description"
                        type="textarea"
                        value={sessionDetails.description}
                        onChange={(e) =>
                            setSessionDetails({
                                ...sessionDetails,
                                description: e.target.value,
                            })
                        }
                    />
                    {errors.description && (
                        <div className="text-red-500 text-sm">
                            {errors.description}
                        </div>
                    )}
                </div>

                <div>
                    <ActionButton
                        label={
                            selectedTrainer.length
                                ? `Trainer: ${selectedTrainer[0]}`
                                : "Add trainer"
                        }
                        onClick={() => setShowTrainerModal(true)}
                    />
                    {errors.trainer && (
                        <div className="text-red-500 text-sm">
                            {errors.trainer}
                        </div>
                    )}
                </div>

                <div>
                    <ActionButton
                        label={
                            selectedModerators.length
                                ? `Moderators: ${selectedModerators.join(", ")}`
                                : "Add moderators"
                        }
                        onClick={() => setShowModeratorModal(true)}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant={ButtonType.PRIMARY} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button
                        variant={ButtonType.SECONDARY}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </div>

                {showTrainerModal && (
                    <SelectModal
                        title="Select Trainer"
                        options={["Trainer A", "Trainer B"]}
                        selected={selectedTrainer}
                        multiSelect={false}
                        onClose={() => setShowTrainerModal(false)}
                        onSelect={setSelectedTrainer}
                    />
                )}

                {showModeratorModal && (
                    <SelectModal
                        title="Select Moderators"
                        options={["Moderator X", "Moderator Y"]}
                        selected={selectedModerators}
                        multiSelect={true}
                        onClose={() => setShowModeratorModal(false)}
                        onSelect={setSelectedModerators}
                    />
                )}
            </div>
        </Layout>
    );
};

export default UpdateSession;
