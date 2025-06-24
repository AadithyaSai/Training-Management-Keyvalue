import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import type { User } from "../../api-service/users/user.type";
import Button, { ButtonType } from "../../components/button/Button";
import AddUserToPoolModal from "../../components/modals/AddUserToPoolModal";
import { useDispatch, useSelector } from "react-redux";
import {
    addUsersWithRoleToPool,
    getPoolUserDetails,
} from "../../store/slices/trainingSlice";
import { useNavigate, useParams } from "react-router-dom";

export const PoolUserRoleType = {
    TRAINER: "Trainer",
    MODERATOR: "Moderator",
    CANDIDATE: "Candidate",
} as const;

export type PoolUserRole =
    (typeof PoolUserRoleType)[keyof typeof PoolUserRoleType];

interface CreateUserPoolProps {
    role: PoolUserRole;
}

interface UserDetailProps {
    user: User;
    onDelete: (user: User) => void;
}

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
                    <div className="text-white text-xl font-medium">
                        {user.username}
                    </div>
                    <div className="text-md text-gray-400">
                        Description and details
                    </div>
                </div>
            </div>
            <button
                onClick={() => onDelete(user)}
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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { trainingId } = useParams();

    const storedUsers: Array<User> = useSelector(getPoolUserDetails(role));

    useEffect(() => {
        if (!storedUsers) return;
        setSelectedUsers([...storedUsers]);
    }, [storedUsers]);

    const handleDelete = (user: User) => {
        setSelectedUsers((prev) => prev.filter((t) => t.id !== user.id));
    };

    return (
        <Layout title={`Create ${role} Pool`}>
            <div className="p-4 bg-cardColor text-white rounded-md border border-borderColor flex flex-col">
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex justify-between items-center px-5 py-6 border border-borderColor rounded-md hover:bg-gray-700"
                >
                    <span className="text-2xl font-semibold">
                        Add New {role}
                    </span>
                    <span className="text-3xl">+</span>
                </button>
                <div className="mt-4 border border-borderColor rounded-md ">
                    <div className="px-4 py-4 border-b border-borderColor text-white text-2xl">
                        {role}s
                    </div>
                    <div className="divide-y divide-gray-700 grow overflow-y-auto max-h-[50vh]">
                        {selectedUsers.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400">
                                No {role}s added to pool
                            </div>
                        ) : (
                            selectedUsers.map((user, index) => (
                                <UserDetail
                                    key={index}
                                    user={user}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className="justify-end flex gap-4 mt-4">
                    <Button
                        variant={ButtonType.PRIMARY}
                        onClick={() => {
                            dispatch(addUsersWithRoleToPool({ role, data: selectedUsers }));
                            console.log("Selected", role ," : ", selectedUsers);
                            if(trainingId)
                                navigate(`/training/${trainingId}/update`);
                            else
                                navigate("/training/create");
                        }}
                    >
                        Save {role} Pool
                    </Button>
                </div>
                {showModal && (
                    <AddUserToPoolModal
                        role={role}
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
