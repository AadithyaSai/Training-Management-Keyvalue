import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { User } from "../../api-service/users/user.type";
import { useGetUserListQuery } from "../../api-service/user/user.api";

interface AddUserToPoolModalProps {
    role: string;
    onSelect: Dispatch<SetStateAction<User[]>>;
    showModal: Dispatch<SetStateAction<boolean>>;
    initialValues?: User[];
}

const AddUserToPoolModal = ({
    role,
    onSelect,
    showModal,
    initialValues,
}: AddUserToPoolModalProps) => {
    const [tempSelection, setTempSelection] = useState<User[]>(
        initialValues || []
    );
    const { data: userList } = useGetUserListQuery();
    const toggleUser = (user: User) => {
        setTempSelection((prev) =>
            prev.some((u) => u.id === user.id)
                ? prev.filter((u) => u.id !== user.id)
                : [...prev, user]
        );
    };

    useEffect(() => {
        console.log("Temp selection updated:", tempSelection);
    }, [tempSelection]);
    
    const handleAddUsers = () => {
        onSelect(() => Array.from(new Set([...tempSelection])));
        setTempSelection([]);
        showModal(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#2C2C2C] text-white p-6 rounded-lg w-96 max-h-[70vh] overflow-y-auto border border-borderColor">
                <h2 className="text-lg font-semibold mb-4">Select {role}s</h2>
                <div className="space-y-2">
                    {userList?.map((user: User) => (
                        <label
                            key={user.id}
                            className="flex items-center gap-3"
                        >
                            <input
                                type="checkbox"
                                checked={tempSelection.some(
                                    (u) => u.id === user.id
                                )}
                                onChange={() => toggleUser(user)}
                                className="form-checkbox h-4 w-4 text-blue-500"
                            />
                            <span>{user.username}</span>
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

export default AddUserToPoolModal;