import { useState } from "react";
import Button, { ButtonType } from "../../../components/button/Button";
import { UserRoleType, type UserRole } from "./sessionTypes";
import { UploadMaterialsModal } from "./modals/UploadMaterialsModal";
import { FeedbackModal } from "./modals/FeedbackModal";
import { CandidateListModal } from "./modals/CandidateListModal";
import { UploadAssignmentsModal } from "./modals/UploadAssignmentsModal";

interface SessionActionButtonsProps {
    userRole: UserRole;
    uploadAssignment?: boolean;
    giveFeedback?: boolean;
    uploadMaterials?: boolean;
    viewFeedback?: boolean;
    viewCandidateFeedback?: boolean,
    viewTrainerFeedback?: boolean
}

export const SessionActionButtons: React.FC<SessionActionButtonsProps> = ({
    userRole,
    uploadAssignment = false,
    giveFeedback = false,
    uploadMaterials = false,
    viewCandidateFeedback = false,
    viewTrainerFeedback = false

}) => {
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [candidateListModalOpen, setCandidateListModalOpen] = useState(false);

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
                        isOpen={candidateListModalOpen}
                        onClose={() => setCandidateListModalOpen(false)}
                    />
                    <FeedbackModal
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
            {viewCandidateFeedback && (
                <>
                <Button 
                variant={ButtonType.SECONDARY}
                onClick={handleGiveFeedback}
            >
                View Candidate Feedback
            </Button>
                </>
            )}
            {viewTrainerFeedback && (
                <>
                    <Button 
                variant={ButtonType.SECONDARY}
            >
                View Trainer Feedback
            </Button>
                </>
            )}
            
            
        </div>
    );
};
