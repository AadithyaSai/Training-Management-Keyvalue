import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import Layout from "../../components/layout/Layout";
import FormInput from "../../components/formInput/FormInput";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTrainingMutation } from "../../api-service/training/training.api";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../store/slices/userSlice";
import {
    addTrainingDetails,
    clearTrainingDetails,
    getTrainingDetails,
    type TrainingSliceState,
} from "../../store/slices/trainingSlice";
import {
    PoolUserRoleType,
    type PoolUserRole,
} from "../createUserPool/CreateUserPool";
import type { User } from "../../api-service/users/user.type";

export interface UserPoolData {
    id: number;
    role: string;
}

export interface TrainingDetailsData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    members: Array<UserPoolData>;
}

const formatUserData = (userList: Array<User>, role: PoolUserRole) => {
    const formattdUserList: Array<UserPoolData> = userList.map((user) => ({
        id: user.id,
        role: role.toLowerCase(),
    }));
    return formattdUserList;
};

export const formatTrainingDetails = (trainingDetails: TrainingSliceState) => {
    const formattedTrainingDetails: TrainingDetailsData = {
        ...trainingDetails,
        members: [
            ...formatUserData(
                trainingDetails.members.trainers,
                PoolUserRoleType.TRAINER
            ),
            ...formatUserData(
                trainingDetails.members.moderators,
                PoolUserRoleType.MODERATOR
            ),
            ...formatUserData(
                trainingDetails.members.candidates,
                PoolUserRoleType.CANDIDATE
            ),
        ],
    };
    return formattedTrainingDetails;
};

const CreateTraining = () => {
    const storedTrainingDetails: TrainingSliceState =
        useSelector(getTrainingDetails);
    const [trainingDetails, setTrainingDetails] = useState<TrainingSliceState>({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        members: {
            trainers: [],
            moderators: [],
            candidates: [],
        },
    });

    useEffect(() => {
        if (!storedTrainingDetails) return;
        setTrainingDetails({
            ...storedTrainingDetails,
            members: {
                trainers: [...storedTrainingDetails.members.trainers],
                moderators: [...storedTrainingDetails.members.moderators],
                candidates: [...storedTrainingDetails.members.candidates],
            },
        });
    }, [storedTrainingDetails]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [createTraining, { isLoading }] = useCreateTrainingMutation();

    const userId = useSelector(getUserDetails).id;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createTraining(formatTrainingDetails(trainingDetails))
            .unwrap()
            .then(() => {
                dispatch(clearTrainingDetails());
                navigate(`/adminDashboard/${userId}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handlePoolOpen = (role: PoolUserRole) => {
        const urlRole = role.toLowerCase();
        dispatch(addTrainingDetails(trainingDetails));
        navigate(`/training/createPool/${urlRole}`);
    };

    return (
        <Layout title="Create Training" isLoading={isLoading}>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col w-full gap-6 mb-6 bg-cardColor border border-borderColor p-4 rounded"
            >
                <FormInput
                    name="training-title"
                    label="Training Title"
                    value={trainingDetails.title}
                    onChange={(event) =>
                        setTrainingDetails({
                            ...trainingDetails,
                            title: event.target.value,
                        })
                    }
                />
                <FormInput
                    name="training-description"
                    label="Training Description"
                    type="textarea"
                    value={trainingDetails.description}
                    onChange={(event) =>
                        setTrainingDetails({
                            ...trainingDetails,
                            description: event.target.value,
                        })
                    }
                />
                <FormInput
                    name="training-start-date"
                    label="Training Start Date"
                    type="date"
                    value={trainingDetails.startDate}
                    onChange={(event) =>
                        setTrainingDetails({
                            ...trainingDetails,
                            startDate: event.target.value,
                        })
                    }
                />
                <FormInput
                    name="training-end-date"
                    label="Training End Date"
                    type="date"
                    value={trainingDetails.endDate}
                    onChange={(event) =>
                        setTrainingDetails({
                            ...trainingDetails,
                            endDate: event.target.value,
                        })
                    }
                />
                <div className="flex flex-col gap-3">
                    <ActionButton
                        label="Add Trainer to Pool"
                        onClick={() => handlePoolOpen(PoolUserRoleType.TRAINER)}
                        endAdornment={
                            <span>
                                ({trainingDetails.members.trainers.length}{" "}
                                added)
                            </span>
                        }
                    />
                    <ActionButton
                        label="Add Moderators to Pool"
                        onClick={() =>
                            handlePoolOpen(PoolUserRoleType.MODERATOR)
                        }
                        endAdornment={
                            <span>
                                ({trainingDetails.members.moderators.length}{" "}
                                added)
                            </span>
                        }
                    />
                    <ActionButton
                        label="Add Candidates to Pool"
                        onClick={() =>
                            handlePoolOpen(PoolUserRoleType.CANDIDATE)
                        }
                        endAdornment={
                            <span>
                                ({trainingDetails.members.candidates.length}{" "}
                                added)
                            </span>
                        }
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant={ButtonType.PRIMARY} type="submit">
                        Submit
                    </Button>
                    <Button
                        variant={ButtonType.SECONDARY}
                        onClick={() => navigate(`/adminDashboard/${userId}`)}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Layout>
    );
};
// };
export default CreateTraining;
