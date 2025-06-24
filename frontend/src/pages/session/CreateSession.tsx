import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Layout from "../../components/layout/Layout";
import FormInput from "../../components/formInput/FormInput";
import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import {
    useAddMembersToSessionMutation,
    useCreateSessionMutation,
} from "../../api-service/session/session.api";
import { useNavigate, useParams } from "react-router-dom";
import type { User } from "../../api-service/users/user.type";
import { useGetTrainingByIdQuery } from "../../api-service/training/training.api";

type SelectModalProps = {
    title: string;
    options: User[];
    selected: User[];
    multiSelect?: boolean;
    onClose: () => void;
    onSelect: (selected: User[]) => void;
};

const SelectModal: React.FC<SelectModalProps> = ({
    title,
    options,
    selected,
    multiSelect = true,
    onClose,
    onSelect,
}) => {
    const [localSelection, setLocalSelection] = useState<User[]>(selected);
    const toggleOption = (option: User) => {
        console.log("SelectModal options:", localSelection);
        console.log("Toggling option:", option.name);
        if (multiSelect) {
            if (localSelection.some((item) => item.id === option.id)) {
                setLocalSelection(
                    localSelection.filter((item) => item.id !== option.id)
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
                            key={option.id}
                            className="flex items-center gap-2 text-white"
                        >
                            <input
                                type={multiSelect ? "checkbox" : "radio"}
                                checked={localSelection.some(
                                    (o) => o.id === option.id
                                )}
                                onChange={() => toggleOption(option)}
                                name={
                                    multiSelect ? option.name : "single-select"
                                }
                            />
                            {option.name}
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
        title: "",
        description: "",
        duration: 0,
    });

    const { trainingId } = useParams();
    const navigate = useNavigate();

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<User[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<User[]>([]);

    const [createSession, { isLoading }] = useCreateSessionMutation();
    const { data: trainingDetailsData } = useGetTrainingByIdQuery({
        id: parseInt(trainingId || "0") || "",
    });
    const [addMembers] = useAddMembersToSessionMutation();

    const [trainers, setTrainers] = useState<User[]>([]);
    const [moderators, setModerators] = useState<User[]>([]);

    useEffect(() => {
        if (!trainingDetailsData) return;
        const trainerList: User[] = [];
        const moderatorList: User[] = [];
        trainingDetailsData.members.forEach(
            (member: { role: string; user: User }) => {
                if (member.role.toLowerCase() === "trainer") {
                    trainerList.push(member.user);
                }
                if (member.role.toLowerCase() === "moderator") {
                    moderatorList.push(member.user);
                }
            }
        );
        setTrainers(trainerList);
        setModerators(moderatorList);
    }, [trainingDetailsData]);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!sessionDetails.title.trim()) {
            newErrors.title = "Title is required.";
        } else if (sessionDetails.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters.";
        }

        if (!sessionDetails.description.trim()) {
            newErrors.description = "Description is required.";
        } else if (sessionDetails.description.trim().length < 10) {
            newErrors.description =
                "Description must be at least 10 characters.";
        }

        if (sessionDetails.duration <= 0) {
            newErrors.duration = "Duration is required.";
        }

        // if (selectedTrainer.length !== 1) {
        //   newErrors.trainer = "Please select one trainer.";
        // }

        return newErrors;
    };

    const handleSubmit = () => {
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // console.log(selectedTrainer, selectedModerators);
        // return;

        setErrors({});

        createSession({
            ...sessionDetails,
            programId: parseInt(trainingId || "0") || "",
        })
            .unwrap()
            .then((newSession) => {
                console.log("Session created:", newSession, trainers);
                addMembers({
                    id: newSession.id,
                    members: [
                        ...selectedTrainer.map((user) => ({
                            id: user.id,
                            role: "trainer",
                        })),
                        ...selectedModerators.map((user) => ({
                            id: user.id,
                            role: "moderator",
                        })),
                    ],
                }).unwrap();
            })
            .catch((error) => {
                console.log(error);
            });

        navigate(`/training/${trainingId}`);
    };

    const handleCancel = () => {
        setSelectedTrainer([]);
        setSelectedModerators([]);
        setSessionDetails({
            title: "",
            description: "",
            duration: 0,
        });
        setErrors({});
        navigate(`/training/${trainingId}`);
    };

    return (
        <Layout title="Session Details Form" isLoading={isLoading}>
            <div className="flex flex-col w-full gap-6 mb-6 bg-cardColor border border-borderColor p-4 rounded">
                <div>
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
                    {errors.title && (
                        <div className="text-red-500 text-sm mt-1">
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
                        onChange={(event) =>
                            setSessionDetails({
                                ...sessionDetails,
                                duration: Number(event.target.value),
                            })
                        }
                    />
                    {errors.duration && (
                        <div className="text-red-500 text-sm mt-1">
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
                        onChange={(event) =>
                            setSessionDetails({
                                ...sessionDetails,
                                description: event.target.value,
                            })
                        }
                    />
                    {errors.description && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.description}
                        </div>
                    )}
                </div>

                <div>
                    <ActionButton
                        label={"Add trainer"}
                        onClick={() => setShowTrainerModal(true)}
                        endAdornment={
                            selectedTrainer.length > 0
                                ? `(${selectedTrainer[0].name})`
                                : "(Select Trainer)"
                        }
                    />
                    {errors.trainer && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.trainer}
                        </div>
                    )}
                </div>

                <ActionButton
                    label={"Add moderators"}
                    onClick={() => setShowModeratorModal(true)}
                    endAdornment={
                        selectedModerators.length > 0
                            ? `${selectedModerators.length} added`
                            : "(Select Moderators)"
                    }
                />

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
                        options={trainers} // Replace with real options
                        selected={selectedTrainer}
                        multiSelect={false}
                        onClose={() => setShowTrainerModal(false)}
                        onSelect={setSelectedTrainer}
                    />
                )}

                {showModeratorModal && (
                    <SelectModal
                        title="Select Moderators"
                        options={moderators} // Replace with real options
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
