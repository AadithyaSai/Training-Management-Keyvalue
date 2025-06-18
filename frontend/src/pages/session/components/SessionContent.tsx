import type { SessionData } from "./sessionTypes";

interface SessionContentProps {
  sessionData: SessionData;
}

export const SessionContent: React.FC<SessionContentProps> = ({ sessionData }) => {
  return (
    <>
      {/* Trainer Section */}
      <div className="border-b border-gray-600 pb-4">
        <h3 className="text-gray-400 text-sm mb-2">Trainer</h3>
        <h2 className="text-xl font-medium">{"TRAINER NAME PLACEHOLDER"}</h2>
      </div>

      {/* Moderators Section */}
      <div className="border-b border-gray-600 pb-4">
        <h3 className="text-gray-400 text-sm mb-2">Moderators</h3>
        <div className="space-y-1">
          {/* {sessionData.moderators.map((moderator, index) => (
            <p key={index} className="text-lg">{moderator}</p>
          ))} */}
          {"MODERATORS NAME PLACEHOLDER"}
        </div>
      </div>

      {/* Session Description */}
      <div className="border-b border-gray-600 pb-4">
        <h3 className="text-gray-400 text-sm mb-2">Session Description</h3>
        <p className="text-gray-300 leading-relaxed">{sessionData.description || "Desc"}</p>
      </div>

      {/* Uploaded Materials (for all roles) */}
      {sessionData.uploadedMaterials && (
        <div className="border-b border-gray-600 pb-4">
          <h3 className="text-gray-400 text-sm mb-2">Uploaded Materials</h3>
          <div className="space-y-1">
            {sessionData.uploadedMaterials.map((material, index) => (
              <p key={index} className="text-lg">{material}</p>
            ))}
          </div>
        </div>
      )}
    </>
  );
};