import type { UserRole } from "./sessionTypes";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <button
        onClick={() => onRoleChange("candidate")}
        className={`px-3 py-1 rounded text-sm ${
          currentRole === "candidate" 
          ? "bg-blue-600 text-white" 
          : "bg-gray-600 text-gray-300"
        }`}
      >
        Candidate
      </button>
      <button
        onClick={() => onRoleChange("trainer")}
        className={`px-3 py-1 rounded text-sm ${
          currentRole === "trainer" 
          ? "bg-blue-600 text-white" 
          : "bg-gray-600 text-gray-300"
        }`}
      >
        Trainer
      </button>
      <button
        onClick={() => onRoleChange("moderator")}
        className={`px-3 py-1 rounded text-sm ${
          currentRole === "moderator" 
          ? "bg-blue-600 text-white" 
          : "bg-gray-600 text-gray-300"
        }`}
      >
        Moderator
      </button>
    </div>
  );
};