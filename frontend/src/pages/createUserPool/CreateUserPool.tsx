import { useState, type Dispatch, type SetStateAction } from "react";
import Layout from "../../components/layout/Layout";
import { useGetUserListQuery } from "../../api-service/users/users.api";
import type { User } from "../../api-service/users/users.type";
import { useAddMembersMutation } from "../../api-service/training/training.api";

export const PoolUserRole = {
  TRAINER: "Trainer",
  MODERATOR: "Moderator",
  CANDIDATE: "Candidate",
} as const;

interface CreateUserPoolProps {
  role: (typeof PoolUserRole)[keyof typeof PoolUserRole];
}

interface AddUserModalProps {
  role: string;
  users: User[];
  onSelect: Dispatch<SetStateAction<User[]>>;
  showModal: Dispatch<SetStateAction<boolean>>;
  initialValues?: User[];
}

interface UserDetailProps {
  user: User;
  onDelete: (userId: number) => void;
}

const AddUserModal = ({
  role,
  users,
  onSelect,
  showModal,
  initialValues,
}: AddUserModalProps) => {
  const [tempSelection, setTempSelection] = useState<User[]>(
    initialValues || []
  );

  const toggleUser = (userId: number) => {
    setTempSelection((prev) =>
      prev.some((user) => user.id === userId)
        ? prev.filter((user) => user.id !== userId)
        : [...prev, users.find((user) => user.id === userId)!]
    );
  };

  const handleAddUsers = () => {
    onSelect(tempSelection);
    setTempSelection([]);
    showModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2C2C2C] text-white p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto border border-borderColor">
        <h2 className="text-lg font-semibold mb-4">Select {role}s</h2>
        <div className="space-y-2 min-h-[50vh] p-1 rounded-lg bg-black/50 overflow-y-scroll no-scrollbar">
          {users.map((user) => (
            <label
              key={user.id}
              className="flex items-center gap-3 border border-gray-500 px-3 py-2 rounded-lg group has-checked:bg-white/20 hover:bg-white/10 has-checked:hover:bg-white/25 cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
            >
              <input
                type="checkbox"
                checked={tempSelection.includes(user)}
                onChange={() => toggleUser(user.id)}
                className="form-checkbox h-4 w-4 text-blue-500 hidden"
              />
              <span className="flex items-center gap-3">
                <div className="p-1 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-black"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    ></path>
                  </svg>
                </div>
                {user.name}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => showModal(false)}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAddUsers}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const UserDetail = ({ user, onDelete }: UserDetailProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="w-15 h-15 border border-borderColor rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-white text-xl font-medium">{user.name}</div>
          <div className="text-md text-gray-400">
            {user.username} | {user.email}
          </div>
        </div>
      </div>
      <button
        onClick={() => onDelete(user.id)}
        className="text-2xl text-red-500 hover:text-red-700"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};

const CreateUserPool: React.FC<CreateUserPoolProps> = ({ role }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { data: allUsers, isError: userError } = useGetUserListQuery();
  const [addMembers, { isError: addMembersError }] = useAddMembersMutation();

  if (userError || addMembersError) {
    throw new Error("Failed to fetch users");
  }

  const handleDelete = (userId: number) => {
    setSelectedUsers((prev) => prev.filter((t) => t.id !== userId));
  };

  const handleConfirm = async () => {
    if (selectedUsers.length === 0) {
      alert(`Please select at least one ${role}`);
      return;
    }

    try {
      await addMembers({
        trainingId: 1,
        members: selectedUsers.map((user) => ({
          userId: user.id,
          role: role.toLowerCase(),
        })),
      }).unwrap();
      setSelectedUsers([]);
    } catch (error) {
      console.error("Failed to add members:", error);
    }
  };

  return (
    <Layout title={`Create ${role} Pool`}>
      <div className="p-4 bg-cardColor text-white rounded-md border border-borderColor">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex justify-between items-center px-5 py-6 border border-borderColor rounded-md hover:bg-white/10"
        >
          <span className="text-2xl font-semibold">Add New {role}</span>
          <span className="text-3xl">+</span>
        </button>

        <div className="mt-4 border border-borderColor rounded-md">
          <div className="px-4 py-4 border-b border-borderColor text-white text-2xl">
            {role}s
          </div>
          <div className="divide-y divide-gray-700 max-h-[50vh] overflow-y-scroll no-scrollbar">
            {selectedUsers.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400">
                No {role}s added to pool
              </div>
            ) : (
              selectedUsers.map((user, index) => (
                <UserDetail key={index} user={user} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleConfirm()}
            className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 cursor-pointer transition duration-300"
          >
            Confirm {role}s
          </button>
        </div>

        {showModal && (
          <AddUserModal
            role={role}
            users={allUsers || []}
            onSelect={setSelectedUsers}
            showModal={setShowModal}
            initialValues={selectedUsers}
          />
        )}
      </div>
    </Layout>
  );
};

export default CreateUserPool;
