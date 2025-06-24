import Button, { ButtonType } from "../../../components/button/Button";
import { UserRoleType, type SessionData, type UserRole } from "./sessionTypes";

interface SessionContentProps {
    isAdmin?: boolean;
    sessionData: SessionData;
    isTrainerAssignable?: boolean;
    isModeratorAssignable?: boolean;
    handleEnrollSelf? : (role: UserRole) => void;
}

export const SessionContent: React.FC<SessionContentProps> = ({
    isAdmin = false,
    sessionData,
    isTrainerAssignable = false,
    isModeratorAssignable = false,
    handleEnrollSelf
}) => {



    return (
        <>
            {/* Trainer Section */}
            <div className="border-b border-gray-600 pb-4 flex justify-between">
                <div>
                    <h3 className="text-gray-400 text-sm mb-2">Trainer</h3>
                    {sessionData.trainer ? (
                        <h2 className="text-xl font-medium">
                            {sessionData.trainer.name}
                        </h2>
                    ) : (
                        <p className="text-md text-gray-300">
                            No trainer present
                        </p>
                    )}
                </div>
                {isTrainerAssignable && (
                    <Button
                        variant={ButtonType.SECONDARY}
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => handleEnrollSelf && handleEnrollSelf(UserRoleType.TRAINER)}
                    >
                        <p className="">Enroll as the trainer</p>
                    </Button>
                )}
            </div>

            {/* Moderators Section */}
            <div className="border-b border-gray-600 pb-4 flex justify-between">
                <div>
                    <h3 className="text-gray-400 text-sm mb-2">Moderators</h3>
                    {sessionData.moderators &&
                    sessionData.moderators.length > 0 ? (
                        <div className="space-y-1">
                            {sessionData.moderators.map((moderator, index) => (
                                <p key={index} className="text-lg">
                                    {moderator.name}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-md text-gray-300">
                            No moderators present
                        </p>
                    )}
                </div>
                {isModeratorAssignable && (
                    <Button
                        variant={ButtonType.SECONDARY}
                        className="py-3 cursor-pointer"
                        onClick={() => handleEnrollSelf && handleEnrollSelf(UserRoleType.MODERATOR)}
                    >
                        <p className="">Enroll as a moderator</p>
                    </Button>
                )}
            </div>

            {/* Session Description */}
            <div className="border-b border-gray-600 pb-4">
                <h3 className="text-gray-400 text-sm mb-2">
                    Session Description
                </h3>
                <p className="text-gray-300 leading-relaxed">
                    {sessionData.description || "Desc"}
                </p>
            </div>

            {isAdmin && (
                <>
                    {sessionData.materialQualityFeedback && (
                        <div className="border-b border-gray-600 pb-4">
                            <h3 className="text-gray-400 text-sm mb-2">
                                Material Quality
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {sessionData.materialQualityFeedback}
                            </p>
                        </div>
                    )}
                    {sessionData.sessionFeedback && (
                        <div className="border-b border-gray-600 pb-4">
                            <h3 className="text-gray-400 text-sm mb-2">
                                Summary of feedbacks
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {sessionData.sessionFeedback}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* Uploaded Materials (for all roles) */}
            {/* {sessionData.materials && (
                <div className="border-b border-gray-600 pb-4">
                    <h3 className="text-gray-400 text-sm mb-2">
                        Uploaded Materials
                    </h3>
                    <div className="space-y-1">
                        {sessionData.materials.map((material, index) => (
                            <p>
                                <a
                                    key={index}
                                    target="_blank"
                                    className="text-md"
                                    href={`//${material?.link}`}
                                >
                                    {`Material ${index+1}`}
                                </a>
                            </p>
                        ))}
                    </div>
                </div>
            )} */}
        </>
    );
};
