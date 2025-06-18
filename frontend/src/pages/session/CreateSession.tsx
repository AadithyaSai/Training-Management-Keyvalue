import { useState } from "react";
import { X } from "lucide-react";
import Layout from "../../components/layout/Layout";
import FormInput from "../../components/formInput/FormInput";
import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import { useCreateSessionMutation } from "../../api-service/session/session.api";
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

const CreateSession = () => {
    const [sessionDetails, setSessionDetails] = useState({
        programId: 4,
        title: "s1",
        description: "desc",
        date: "2020-07-10",
        duration: 3,
    });

    const { trainingId } = useParams();
    const navigate = useNavigate();

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<string[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<string[]>([]);

    const [createSession] = useCreateSessionMutation();

    const handleCancel = () => {
        setSelectedTrainer([]);
        setSelectedModerators([]);
    };

    const handleSubmit = () => {
        createSession(sessionDetails)
            .unwrap()
            .then((data) => console.log(data))
            .catch((error) => console.log(error));
        navigate(`/training/${trainingId}`);
    };

    return (
        <Layout title="Session Details Form">
            <div className="flex flex-col w-full gap-6 mb-6 bg-cardColor border border-borderColor p-4 rounded">
                <FormInput
                    name="session-name"
                    label="Session Name"
                    value={sessionDetails.title}
                    onChange={(event) =>
                        setSessionDetails({
                            ...sessionDetails,
                            title: event.target.value,
                        })
                    }
                />

                <FormInput
                    name="session-duration"
                    label="Session Duration"
                    type="integer"
                    value={String(sessionDetails.duration)}
                    onChange={(event) =>
                        setSessionDetails({
                            ...sessionDetails,
                            duration: Number(event.target.value),
                        })
                    }
                />

                <FormInput
                    name="session-description"
                    label="Session Description"
                    type="textarea"
                    value={sessionDetails.description}
                    onChange={(event) =>
                        setSessionDetails({
                            ...sessionDetails,
                            description: event.target.value,
                        })
                    }
                />

                <ActionButton
                    label="Add trainer"
                    onClick={() => setShowTrainerModal(true)}
                />

                <ActionButton
                    label="Add moderators"
                    onClick={() => setShowModeratorModal(true)}
                />

                {/* Buttons */}
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

                {/* Trainer Modal */}
                {showTrainerModal && (
                    <SelectModal
                        title="Select Trainer"
                        options={[]}
                        selected={selectedTrainer}
                        multiSelect={false}
                        onClose={() => setShowTrainerModal(false)}
                        onSelect={setSelectedTrainer}
                    />
                )}

                {/* Moderator Modal */}
                {showModeratorModal && (
                    <SelectModal
                        title="Select Moderators"
                        options={[]}
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
export default CreateSession;
