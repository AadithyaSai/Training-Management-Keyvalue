import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserDetails } from "../../store/slices/userSlice";
import {
    addTrainingDetails,
    addUsersToPool,
    clearTrainingDetails,
    getTrainingDetails,
    type TrainingSliceState,
} from "../../store/slices/trainingSlice";

import Layout from "../../components/layout/Layout";
import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import FormInput from "../../components/formInput/FormInput";
import {
    useGetTrainingByIdQuery,
    useUpdateTrainingMutation,
} from "../../api-service/training/training.api";
import { formatTrainingDetails } from "./CreateTraining";
import {
    PoolUserRoleType,
    type PoolUserRole,
} from "../createUserPool/CreateUserPool";
import { getTrainingUsers } from "./TrainingDetails";

const UpdateTraining = () => {
    const [pageLoading, setPageLoading] = useState(false);
    const { trainingId } = useParams();
    const [updateTraining, { isLoading }] = useUpdateTrainingMutation();
    const { data: trainingDetailsData } = useGetTrainingByIdQuery({
        id: trainingId,
    });

    const userId = useSelector(getUserDetails);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const storedTrainingDetails: TrainingSliceState =
        useSelector(getTrainingDetails);

    useEffect(() => {
        if (!trainingDetailsData || !storedTrainingDetails) return;
        if(trainingDetailsData.id === storedTrainingDetails.id)
            return;
        dispatch(addTrainingDetails(trainingDetailsData));
        const users = getTrainingUsers(trainingDetailsData);
        if (users) dispatch(addUsersToPool(users));
    }, [trainingDetailsData]);

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

    const handlePoolOpen = (role: PoolUserRole) => {
        const urlRole = role.toLowerCase();
        dispatch(addTrainingDetails(trainingDetails));
        navigate(`/training/${trainingId}/update/createPool/${urlRole}`);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateTraining({
            id: trainingId,
            data: formatTrainingDetails(trainingDetails),
        })
            .unwrap()
            .then(() => {
                setPageLoading(true);
                dispatch(clearTrainingDetails());
                navigate(`/training/${trainingId}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Layout title="Update Training" isLoading={isLoading || pageLoading}>
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
                    <ActionButton
                        label="Add Sessions to Schedule"
                        onClick={() =>
                            navigate(`/training/${trainingId}/calendar`)
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

export default UpdateTraining;
