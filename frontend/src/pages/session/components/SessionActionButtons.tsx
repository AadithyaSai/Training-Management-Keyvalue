import { useState } from "react";
import Button, { ButtonType } from "../../../components/button/Button";
import { UserRoleType, type UserRole } from "./sessionTypes";
import { UploadMaterialsModal } from "./modals/UploadMaterialsModal";
import { FeedbackModal } from "./modals/FeedbackModal";
import { CandidateListModal } from "./modals/CandidateListModal";
import { UploadAssignmentsModal } from "./modals/UploadAssignmentsModal";
import { useGetSessionByIdQuery } from "../../../api-service/session/session.api";
import MaterialsModal from "./modals/ViewMaterialModal";
import ViewAssignmentsModal from "./modals/ViewAssignmentModal";
import { useGetAssignmentListQuery } from "../../../api-service/assignment/viewAssignment.api";

interface SessionActionButtonsProps {
    isAdmin?: boolean;
    userRole: UserRole;
    sessionId: number;
    trainerId?: number;
    uploadAssignment?: boolean;
    giveFeedback?: boolean;
    uploadMaterials?: boolean;
}

export const SessionActionButtons: React.FC<SessionActionButtonsProps> = ({
    isAdmin = false,
    userRole,
    sessionId,
    trainerId,
    uploadAssignment = false,
    giveFeedback = false,
    uploadMaterials = false,
}) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [candidateListModalOpen, setCandidateListModalOpen] = useState(false);
    const [viewMaterialModalOpen, setViewMaterialModalOpen] = useState(false);
    const [viewAssignmentModalOpen, setViewAssignmentModalOpen] = useState(false);
    const { data: sessionDetailsData } = useGetSessionByIdQuery({
        id: sessionId,
    });
    const { data: assignmentList } = useGetAssignmentListQuery({});

    const handleUploadAssignment = () => {
        setUploadModalOpen(true);
    };

    const handleGiveFeedback = () => {
        if (userRole === UserRoleType.CANDIDATE) {
            setFeedbackModalOpen(true);
        } else {
            setCandidateListModalOpen(true);
        }
    };

    const handleUploadMaterials = () => {
        setUploadModalOpen(true);
    };

    const handleViewMaterials = () => {
        setViewMaterialModalOpen(true);
    };

    const handleViewAssignments = () => {
        setViewAssignmentModalOpen(true);
    };

    return (
        <div className="flex gap-4">
            {giveFeedback && (
                <>
                    <Button
                        onClick={handleGiveFeedback}
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
                        trainerId={trainerId}
                        userRole={userRole}
                        isOpen={feedbackModalOpen}
                        onClose={() => setFeedbackModalOpen(false)}
                    />
                </>
            )}
            {uploadAssignment && (
                <>
                    <Button
                        onClick={handleUploadAssignment}
                        variant={ButtonType.SECONDARY}
                    >
                        Upload Assignment
                    </Button>
                    <UploadAssignmentsModal
                        isOpen={uploadModalOpen}
                        onClose={() => setUploadModalOpen(false)}
                    />
                </>
            )}
            {uploadMaterials && (
                <>
                    <Button
                        onClick={handleUploadMaterials}
                        variant={ButtonType.SECONDARY}
                    >
                        Upload Materials
                    </Button>
                    <UploadMaterialsModal
                        isOpen={uploadModalOpen}
                        onClose={() => setUploadModalOpen(false)}
                    />
                </>
            )}
            {
                <>
                    <Button
                        onClick={handleViewMaterials}
                        variant={ButtonType.SECONDARY}
                    >
                        View Materials
                    </Button>
                    <MaterialsModal
                        isOpen={viewMaterialModalOpen}
                        onClose={() => setViewMaterialModalOpen(false)}
                        materials={sessionDetailsData?.materials}
                    />
                </>
            }
            {(isAdmin ||
                userRole == UserRoleType.TRAINER ||
                userRole == UserRoleType.MODERATOR) && (
                <>
                    <Button
                        onClick={handleViewAssignments}
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
