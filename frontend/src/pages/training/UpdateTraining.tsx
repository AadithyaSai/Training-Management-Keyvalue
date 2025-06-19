import { useNavigate, useParams } from "react-router-dom";
import FormInput from "../../components/formInput/FormInput";
import ActionButton from "../../components/actionButton/ActionButton";
import Button, { ButtonType } from "../../components/button/Button";
import Layout from "../../components/layout/Layout";
import {
  useUpdateTrainingMutation,
  useGetTrainingByIdQuery,
} from "../../api-service/training/training.api";
import { useEffect, useState, type FormEvent } from "react";
import {
  UserRoleType,
  type UserRole,
} from "../session/components/sessionTypes";
import CreateUserPool from "../createUserPool/CreateUserPool";
import type { TrainingDetailsData, UserPoolData } from "./CreateTraining";

const UpdateTraining = () => {
  const { trainingId } = useParams();
  const [updateTraining] = useUpdateTrainingMutation();
  const { data: trainingDetailsData } = useGetTrainingByIdQuery({
    id: trainingId,
  });

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
    updateTraining({
      id: trainingId,
      data: {
        ...trainingDetails,
        members: members,
      },
    })
      .unwrap()
      .then(() => {
        navigate(`/training/${trainingId}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [displayedPoolType, setDisplayedPoolType] = useState<UserRole | null>(
    null
  );
  const [trainingDetails, setTrainingDetails] = useState<TrainingDetailsData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    members: [],
  });
  const [trainerPool, setTrainerPool] = useState<Array<UserPoolData>>([]);
  const [moderatorPool, setModeratorPool] = useState<Array<UserPoolData>>([]);
  const [candidatePool, setCandidatePool] = useState<Array<UserPoolData>>([]);
  // useEffect(() => {
  //     setTrainingDetails({ ...trainingDetails, members: [...trainerPool, ...moderatorPool, ...candidatePool] })
  // }, [trainerPool, moderatorPool, candidatePool]);
  const navigate = useNavigate();

  const addWindowListener = () => {
    if (!displayedPoolType) return;
    setDisplayedPoolType(null);
    navigate(`/training/${trainingId}/update`);
  };
  window.addEventListener("popstate", addWindowListener);

  useEffect(() => {
    if (!trainingDetailsData) return;
    console.log(trainingDetailsData);
    setTrainingDetails({
      title: trainingDetailsData.title,
      description: trainingDetailsData.description,
      startDate: trainingDetailsData.startDate,
      endDate: trainingDetailsData.endDate,
      members: trainingDetailsData.members.map((member) => ({
        userId: member.user?.id,
        role: member.role.toLowerCase(),
      })),
    });
    console.log(trainingDetailsData.members);
    if (trainingDetailsData.members) {
      setTrainerPool(
        trainingDetailsData.members
          .map((member) => ({ ...member.user, role: member.role }))
          .filter((member) => member.role === UserRoleType.TRAINER)
      );
      setModeratorPool(
        trainingDetailsData.members
          .map((member) => ({ ...member.user, role: member.role }))
          .filter((member) => member.role === UserRoleType.MODERATOR)
      );
      setCandidatePool(
        trainingDetailsData.members
          .map((member) => ({ ...member.user, role: member.role }))
          .filter((member) => member.role === UserRoleType.CANDIDATE)
      );
    }
  }, [trainingDetailsData]);

  switch (displayedPoolType) {
    case UserRoleType.TRAINER:
      return (
        <CreateUserPool
          role={UserRoleType.TRAINER}
          pool={trainerPool}
          setPool={setTrainerPool}
          setPoolType={setDisplayedPoolType}
          initialValues={trainerPool}
        />
      );
    case UserRoleType.MODERATOR:
      return (
        <CreateUserPool
          role={UserRoleType.MODERATOR}
          pool={moderatorPool}
          setPool={setModeratorPool}
          setPoolType={setDisplayedPoolType}
          initialValues={moderatorPool}
        />
      );
    case UserRoleType.CANDIDATE:
      return (
        <CreateUserPool
          role={UserRoleType.CANDIDATE}
          pool={candidatePool}
          setPool={setCandidatePool}
          setPoolType={setDisplayedPoolType}
          initialValues={candidatePool}
        />
      );
    default:
      return (
        <Layout title="Update Training">
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
                onClick={() => setDisplayedPoolType(UserRoleType.TRAINER)}
                endAdornment={<span>({trainerPool.length} added)</span>}
              />
              <ActionButton
                label="Add Moderators to Pool"
                onClick={() => setDisplayedPoolType(UserRoleType.MODERATOR)}
                endAdornment={<span>({moderatorPool.length} added)</span>}
              />
              <ActionButton
                label="Add Candidates to Pool"
                onClick={() => setDisplayedPoolType(UserRoleType.CANDIDATE)}
                endAdornment={<span>({candidatePool.length} added)</span>}
              />
              <ActionButton
                label="Create New Session"
                onClick={() =>
                  navigate(`/training/${trainingId}/session/create`)
                }
              />
              <ActionButton
                label="Add Sessions to Schedule"
                onClick={() => navigate(`/training/${trainingId}/calendar`)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant={ButtonType.PRIMARY} type="submit">
                Submit
              </Button>
              <Button variant={ButtonType.SECONDARY}>Cancel</Button>
            </div>
          </form>
        </Layout>
      );
  }
};

export default UpdateTraining;
