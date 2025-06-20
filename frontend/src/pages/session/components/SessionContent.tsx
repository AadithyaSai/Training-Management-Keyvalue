import type { SessionData } from "./sessionTypes";

interface SessionContentProps {
    isAdmin?: boolean;
    sessionData: SessionData;
}

export const SessionContent: React.FC<SessionContentProps> = ({
    isAdmin = false,
    sessionData,
}) => {
    return (
        <>
            {/* Trainer Section */}
            <div className="border-b border-gray-600 pb-4">
                <h3 className="text-gray-400 text-sm mb-2">Trainer</h3>
                <h2 className="text-xl font-medium">
                    {sessionData.trainer?.name}
                </h2>
            </div>

            {/* Moderators Section */}
            <div className="border-b border-gray-600 pb-4">
                <h3 className="text-gray-400 text-sm mb-2">Moderators</h3>
                <div className="space-y-1">
                    {sessionData.moderators?.map((moderator, index) => (
                        <p key={index} className="text-lg">
                            {moderator.name}
                        </p>
                    ))}
                </div>
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
