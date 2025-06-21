import { useState } from "react";
import Button, { ButtonType } from "../../../components/button/Button";
import { UserRoleType, type SessionData, type UserRole } from "./sessionTypes";
import { UploadMaterialsModal } from "./modals/UploadMaterialsModal";
import { FeedbackModal } from "./modals/FeedbackModal";
import { CandidateListModal } from "./modals/CandidateListModal";
import { UploadAssignmentsModal } from "./modals/UploadAssignmentsModal";
import MaterialsModal from "./modals/ViewMaterialModal";
import ViewAssignmentsModal from "./modals/ViewAssignmentModal";
import { useGetAssignmentListQuery } from "../../../api-service/assignment/viewAssignment.api";

interface SessionActionButtonsProps {
    isAdmin?: boolean;
    userRole: UserRole;
    sessionId: number;
    sessionDetails?: SessionData;
}

export const SessionActionButtons: React.FC<SessionActionButtonsProps> = ({
    isAdmin = false,
    userRole,
    sessionId,
    sessionDetails,
}) => {
    const [uploadMaterialModalOpen, setUploadMaterialModalOpen] =
        useState(false);
    const [uploadAssignmentModalOpen, setUploadAssignmentModalOpen] =
        useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [candidateListModalOpen, setCandidateListModalOpen] = useState(false);
    const [viewMaterialModalOpen, setViewMaterialModalOpen] = useState(false);
    const [viewAssignmentModalOpen, setViewAssignmentModalOpen] =
        useState(false);

    const { data: assignmentList } = useGetAssignmentListQuery({});

    return (
        <div className="flex gap-4">
            {
                <>
                    <Button
                        onClick={() =>
                            userRole === UserRoleType.CANDIDATE
                                ? setFeedbackModalOpen(true)
                                : setCandidateListModalOpen(true)
                        }
                        variant={ButtonType.SECONDARY}
                    >
                        Give Feedback
                    </Button>
                    <CandidateListModal
                        sessionId={sessionId}
                        userRole={userRole}
                        isOpen={candidateListModalOpen}
                        onClose={() => setCandidateListModalOpen(false)}
                    />
                    <FeedbackModal
                        sessionId={sessionId}
                        trainerId={sessionDetails?.trainer?.id}
                        userRole={userRole}
                        isOpen={feedbackModalOpen}
                        onClose={() => setFeedbackModalOpen(false)}
                    />
                </>
            }
            {(isAdmin || userRole === UserRoleType.CANDIDATE) && (
                <>
                    <Button
                        onClick={() => setUploadAssignmentModalOpen(true)}
                        variant={ButtonType.SECONDARY}
                    >
                        Upload Assignment
                    </Button>
                    <UploadAssignmentsModal
                        isOpen={uploadAssignmentModalOpen}
                        onClose={() => setUploadAssignmentModalOpen(false)}
                    />
                </>
            )}
            {(isAdmin || userRole === UserRoleType.TRAINER) && (
                <>
                    <Button
                        onClick={() => setUploadMaterialModalOpen(true)}
                        variant={ButtonType.SECONDARY}
                    >
                        Upload Materials
                    </Button>
                    <UploadMaterialsModal
                        isOpen={uploadMaterialModalOpen}
                        onClose={() => setUploadMaterialModalOpen(false)}
                    />
                </>
            )}
            {
                <>
                    <Button
                        onClick={() => setViewMaterialModalOpen(true)}
                        variant={ButtonType.SECONDARY}
                    >
                        View Materials
                    </Button>
                    <MaterialsModal
                        isOpen={viewMaterialModalOpen}
                        onClose={() => setViewMaterialModalOpen(false)}
                        materials={sessionDetails?.materials}
                    />
                </>
            }
            {(isAdmin ||
                userRole == UserRoleType.TRAINER ||
                userRole == UserRoleType.MODERATOR) && (
                <>
                    <Button
                        onClick={() => setViewAssignmentModalOpen(true)}
                        variant={ButtonType.SECONDARY}
                    >
                        View Assignments
                    </Button>
                    <ViewAssignmentsModal
                        isOpen={viewAssignmentModalOpen}
                        onClose={() => setViewAssignmentModalOpen(false)}
                        assignments={assignmentList || []}
                    />
                </>
            )}
        </div>
    );
};
