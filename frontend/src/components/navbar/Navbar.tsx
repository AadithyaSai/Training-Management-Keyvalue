// import { useNavigate } from "react-router-dom";
// import Button from "../button/Button";

// const NavbarItem = ({
//   label = "label",
//   icon = "icon",
// }: {
//   label?: string;
//   icon?: string;
// }) => {
//   return (
//     <li>
//       <a
//         href="#"
//         className="flex justify-between items-center w-9/10 border-2 border-borderColor border-l-transparent bg-cardColor rounded-r-full p-4 pr-6"
//       >
//         <p className="text-white text-lg">{label}</p>
//         <span className="text-white text-lg">{icon}</span>
//       </a>
//     </li>
//   );
// };

// const Navbar = () => {
//   const navigate = useNavigate();
//   function OnHandleLogOut():void{
//           localStorage.removeItem("token");
//           console.log("LOGOUT");
//           localStorage.setItem("isLogged", "false");
//           navigate("/", { replace: true });
//   }

//   return (
//     <nav
//       className={`fixed top-headerHeight -translate-y-2px left-0 bottom-0 w-navbarWidth h-full bg-cardColor text-white shadow-lg py-8 z-40 border-2 border-borderColor border-t-transparent`}
//     >
//       <ul className="space-y-4">
//         <NavbarItem label="Training" icon="🏠" />
//         <NavbarItem label="Upcoming Sessions" icon="🏠" />
//         <Button onClick={()=>OnHandleLogOut()} className="logout">LOGOUT</Button>

//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import { useNavigate } from "react-router-dom";
import type { UserRole } from "../../pages/session/components/sessionTypes";
import { jwtDecode } from "jwt-decode";

interface NavbarItemProps {
    label?: string;
    icon?: string;
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
                className="flex justify-between items-center w-full border-2 border-borderColor border-l-transparent bg-cardColor rounded-r-full p-4 pr-6
                   transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:translate-x-1"
            >
                <p className="text-white text-lg">{label}</p>
                <span className="text-white text-lg">{icon}</span>
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
        <nav className="fixed top-headerHeight left-0 bottom-0 w-navbarWidth bg-cardColor text-white shadow-lg py-8 z-40 border-2 border-borderColor border-t-transparent flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 pl-0">
                <ul className="space-y-4">
                    <NavbarItem
                        label="Trainings"
                        icon=""
                        navTo={isAdmin ? `/adminDashboard/${userId}` : `/dashboard/${userId}`}
                    />
                    <NavbarItem
                        label="Upcoming Sessions"
                        icon=""
                        navTo={isAdmin ? `/adminDashboard/${userId}` : `/dashboard/${userId}`}
                    />
                </ul>
            </div>

            <div className="px-4 pt-4 flex flex-col items-center justify-center gap-3">
                {isAdmin ? (
                    <p className="text-white text-xl">Role : admin</p>
                ) : (
                    userRole && (
                        <p className="text-white text-xl">Role : {userRole}</p>
                    )
                )}
                <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-br from-red-500 to-blue-700 transition-all duration-300 text-white py-2 px-4 rounded-full"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
