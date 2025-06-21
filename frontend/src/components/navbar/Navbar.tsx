import { useNavigate } from "react-router-dom";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeUser, type UserStateData } from "../../store/slices/userSlice";

interface NavbarItemProps {
    label?: string;
    icon?: React.ReactNode | string;
    navTo?: string;
}

interface NavbarProps {
    userDetails?: UserStateData;
}

const NavbarItem = ({
    label = "label",
    icon = "icon",
    navTo = "",
}: NavbarItemProps) => {
    const navigate = useNavigate();

    return (
        <li onClick={() => navigate(navTo)} className="cursor-pointer">
            <div
                className="flex justify-between items-center w-full border-borderColor bg-cardColor rounded-md p-4
                   transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] text-white hover:scale-105"
            >
                <p className="text-lg">{label}</p>
                <span className="text-lg scale-125">{icon}</span>
            </div>
        </li>
    );
};

const Navbar: React.FC<NavbarProps> = ({ userDetails }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(removeUser());
        navigate("/login", { replace: true });
    };


    return (
        <nav className="fixed top-headerHeight left-0 bottom-0 w-navbarWidth bg-cardColor text-white shadow-bgColor shadow-xl py-6 z-40 border-t-transparent flex flex-col">
            <div className="px-5 py-1 mb-4">
                <div className="w-full flex gap-4 items-center p-3 rounded-md">
                    <span className="size-12 rounded-full bg-gray-200 text-black text-[24px] overflow-clip flex items-center justify-center">
                        {userDetails?.username[0].toUpperCase() || "U"}
                    </span>
                    <div className="flex flex-col">
                        <span className="text-white text-xl">{userDetails?.username || "Username"}</span>
                        <p className="text-green-500 text-sm font-bold">
                            {userDetails?.isAdmin
                                ? "ADMIN"
                                : userDetails?.role &&
                                  `Role : ${userDetails?.role.toUpperCase()}`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
                <ul className="space-y-4">
                    <NavbarItem
                        label="Dashboard"
                        icon={<MdOutlineSpaceDashboard />}
                        navTo={
                            userDetails?.isAdmin
                                ? `/adminDashboard/${userDetails?.id}`
                                : `/dashboard/${userDetails?.id}`
                        }
                    />
                    <NavbarItem
                        label="Calendar"
                        icon={<FaRegCalendarCheck />}
                        navTo={
                            userDetails?.isAdmin
                                ? `/adminDashboard/${userDetails?.id}`
                                : `/dashboard/${userDetails?.id}`
                        }
                    />
                </ul>
            </div>

            <div className="px-4 pt-4 flex flex-col items-center justify-center gap-3">
                <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-br from-red-600 to-blue-700 transition-all duration-300 text-white py-2 px-4 rounded-md hover:scale-105"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
