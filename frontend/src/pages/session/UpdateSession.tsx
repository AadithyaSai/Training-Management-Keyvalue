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
import type { User } from "../../api-service/users/user.type";
import { useGetTrainingByIdQuery } from "../../api-service/training/training.api";

type SelectModalProps = {
    title: string;
    options: User[];
    selected: User[];
    multiSelect?: boolean;
    onClose: () => void;
    onSelect: (selected: any[]) => void;
};

const SelectModal: React.FC<SelectModalProps> = ({
    title,
    options,
    selected,
    multiSelect = true,
    onClose,
    onSelect,
}) => {
    console.log("SelectModal options:", options);
    console.log("SelectModal selected:", selected);
    const [localSelection, setLocalSelection] = useState<User[]>(selected);
    const toggleOption = (option: User) => {
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
                                    (item) => item.id === option.id
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

const UpdateSession = () => {
    const [sessionDetails, setSessionDetails] = useState({
        title: "",
        description: "",
        duration: 0,
    });

    const [selectedTrainer, setSelectedTrainer] = useState<User[]>([]);
    const [selectedModerators, setSelectedModerators] = useState<User[]>([]);
    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

<<<<<<< HEAD
    const navigate = useNavigate();
    const { trainingId, sessionId } = useParams();
    const { data: sessionDetailsData, isLoading: getIsLoading } =
        useGetSessionByIdQuery({
            id: sessionId,
        });
=======
  const navigate = useNavigate();
  const { trainingId, sessionId } = useParams();
  const { data: sessionDetailsData, isLoading: getIsLoading } = useGetSessionByIdQuery({
    id: sessionId,
  });
>>>>>>> 072799b (fixed update session)

    const [updateSession, { isLoading }] = useUpdateSessionMutation();

<<<<<<< HEAD
    const { data: trainingDetailsData } = useGetTrainingByIdQuery<{
        data: { members: Array<{ role: string; user: User }> };
    }>({
        id: parseInt(trainingId || "0", 10),
    });
=======
  const { data: trainingDetailsData } = useGetTrainingByIdQuery({
    id: parseInt(trainingId || "0", 10),
  });

  const [trainers, setTrainers] = useState([]);
  const [moderators, setModerators] = useState([]);

  useEffect(() => {
    if (trainingDetailsData) {
      setTrainers(trainingDetailsData.members.filter((m)=>m.role==="trainer").map((m)=>m.user) || []);
      setModerators(trainingDetailsData.members.filter((m)=>m.role==="moderator").map((m)=>m.user) || []);
    }
  }, [trainingDetailsData]);
>>>>>>> 072799b (fixed update session)

    const trainers = trainingDetailsData?.members
        .filter((u) => u.role === "trainer")
        .map((u) => u.user);
    const moderators = trainingDetailsData?.members
        .filter((u) => u.role === "moderator")
        .map((u) => u.user);

    useEffect(() => {
        if (sessionDetailsData) {
            setSessionDetails({
                title: sessionDetailsData.title,
                description: sessionDetailsData.description,
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
        updateSession({ id: sessionId, data: {...sessionDetails, programId: parseInt(trainingId!)} })
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
        <Layout title="Update Session" isLoading={isLoading || getIsLoading}>
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
                        label="Add trainer"
                        onClick={() => setShowTrainerModal(true)}
                        endAdornment={
                            <span>
                                {selectedTrainer.length > 0 &&
                                    `(${selectedTrainer[0].name})`}
                            </span>
                        }
                    />
                    {errors.trainer && (
                        <div className="text-red-500 text-sm">
                            {errors.trainer}
                        </div>
                    )}
                </div>

                <div>
                    <ActionButton
                        label="Add moderators"
                        onClick={() => setShowModeratorModal(true)}
                        endAdornment={
                            <span>
                                {selectedModerators.length > 0 &&
                                    `(${selectedModerators.length} added)`}
                            </span>
                        }
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
                        options={trainers || []}
                        selected={selectedTrainer}
                        multiSelect={false}
                        onClose={() => setShowTrainerModal(false)}
                        onSelect={setSelectedTrainer}
                    />
                )}

                {showModeratorModal && (
                    <SelectModal
                        title="Select Moderators"
                        options={moderators || []}
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
