import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../pages/session/components/sessionTypes";
import { jwtDecode } from "jwt-decode";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";

interface NavbarItemProps {
    label?: string;
    icon?: React.ReactNode | string;
    navTo?: string;
}

interface NavbarProps {
    userRole?: UserRole;
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

const Navbar: React.FC<NavbarProps> = ({ userRole }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const token = localStorage.getItem("token");
    const decoded: { id: number; isAdmin: boolean } = jwtDecode(token || "");
    const { isAdmin, id: userId } = decoded;

    return (
        <nav className="fixed top-headerHeight left-0 bottom-0 w-navbarWidth bg-cardColor text-white shadow-bgColor shadow-xl py-6 z-40 border-t-transparent flex flex-col">
            <div className="px-5 py-1 mb-4">
                <div className="w-full flex gap-4 items-center p-3 rounded-md">
                    <span className="size-12 rounded-full bg-gray-200 text-black text-xl overflow-clip flex items-center justify-center">
                        U
                    </span>
                    <div className="flex flex-col">
                        <span className="text-white text-xl">Username</span>
                        <p className="text-green-500 text-sm font-bold">
                            {isAdmin
                                ? "ADMIN"
                                : userRole &&
                                  `Role : ${userRole.toUpperCase()}`}
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
                            isAdmin
                                ? `/adminDashboard/${userId}`
                                : `/dashboard/${userId}`
                        }
                    />
                    <NavbarItem
                        label="Calendar"
                        icon={<FaRegCalendarCheck />}
                        navTo={
                            isAdmin
                                ? `/adminDashboard/${userId}`
                                : `/dashboard/${userId}`
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
