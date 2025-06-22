import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import Layout from "../../components/layout/Layout";
import FormInput from "../../components/formInput/FormInput";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTrainingMutation } from "../../api-service/training/training.api";
import {
    UserRoleType,
    type UserRole,
} from "../session/components/sessionTypes";
import CreateUserPool from "../createUserPool/CreateUserPool";
import { jwtDecode } from "jwt-decode";
import type { User } from "../../api-service/users/user.type";

export interface TrainingDetailsData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
}
const CreateTraining = () => {
    const [displayedPoolType, setDisplayedPoolType] = useState<UserRole | null>(
        null
    );
    const [trainingDetails, setTrainingDetails] = useState<TrainingDetailsData>(
        {
            title: "",
            description: "",
            startDate: "",
            endDate: "",
        }
    );
    const [trainerPool, setTrainerPool] = useState<Array<User>>([]);
    const [moderatorPool, setModeratorPool] = useState<Array<User>>([]);
    const [candidatePool, setCandidatePool] = useState<Array<User>>([]);

    // useEffect(() => {
    //     setTrainingDetails({ ...trainingDetails, members: [...trainerPool, ...moderatorPool, ...candidatePool] })
    // }, [trainerPool, moderatorPool, candidatePool]);

    const navigate = useNavigate();
    const [createTraining, { isLoading }] = useCreateTrainingMutation();

    const token = localStorage.getItem("token");
    const decoded: { id: number } = jwtDecode(token || "");
    const userId = decoded.id;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
                const members = trainerPool.map((member) => ({
            userId: member.id,
            role: UserRoleType.TRAINER as string,
        }));
        members.push(
            ...moderatorPool.map((member) => ({
                userId: member.id,
                role: UserRoleType.MODERATOR,
            }))
        );
        members.push(
            ...candidatePool.map((member) => ({
                userId: member.id,
                role: UserRoleType.CANDIDATE,
            }))
        );
        createTraining({...trainingDetails, members})
            .unwrap()
            .then(() => {
                navigate(`/adminDashboard/${userId}`);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const addWindowListener = () => {
        if (!displayedPoolType) return;
        setDisplayedPoolType(null);
        navigate("/training/create");
    };
    window.addEventListener("popstate", addWindowListener);
    switch (displayedPoolType) {
        case UserRoleType.TRAINER:
            return (
                <CreateUserPool
                    role={UserRoleType.TRAINER}
                    pool={trainerPool}
                    setPool={setTrainerPool}
                    setPoolType={setDisplayedPoolType}
                />
            );
        case UserRoleType.MODERATOR:
            return (
                <CreateUserPool
                    role={UserRoleType.MODERATOR}
                    pool={moderatorPool}
                    setPool={setModeratorPool}
                    setPoolType={setDisplayedPoolType}
                />
            );
        case UserRoleType.CANDIDATE:
            return (
                <CreateUserPool
                    role={UserRoleType.CANDIDATE}
                    pool={candidatePool}
                    setPool={setCandidatePool}
                    setPoolType={setDisplayedPoolType}
                />
            );
        default:
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
                                onClick={() =>
                                    setDisplayedPoolType(UserRoleType.TRAINER)
                                }
                                endAdornment={
                                    <span>({trainerPool.length} added)</span>
                                }
                            />
                            <ActionButton
                                label="Add Moderators to Pool"
                                onClick={() =>
                                    setDisplayedPoolType(UserRoleType.MODERATOR)
                                }
                                endAdornment={
                                    <span>({moderatorPool.length} added)</span>
                                }
                            />
                            <ActionButton
                                label="Add Candidates to Pool"
                                onClick={() =>
                                    setDisplayedPoolType(UserRoleType.CANDIDATE)
                                }
                                endAdornment={
                                    <span>({candidatePool.length} added)</span>
                                }
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <Button variant={ButtonType.PRIMARY} type="submit">
                                Submit
                            </Button>
                            <Button variant={ButtonType.SECONDARY} onClick={() => navigate(`/adminDashboard/${userId}`)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Layout>
            );
    }
};
export default CreateTraining;
