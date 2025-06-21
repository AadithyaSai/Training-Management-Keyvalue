import Header from "../header/Header";
import Navbar from "../navbar/Navbar";
import { ToastContainer } from "react-toastify";
import type { UserRole } from "../../pages/session/components/sessionTypes";
import Pacman, { PacmanFullScreen } from "../loader/Pacman";
import { useSelector } from "react-redux";
import {
    getUserDetails,
    type UserStateData,
} from "../../store/slices/userSlice";
import { jwtDecode } from "jwt-decode";
import { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
    title?: string;
    children?: React.ReactNode;
    endAdornments?: React.ReactNode;
    isLoading?: boolean;
    userRole?: UserRole;
}

const validateToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return { status: false };
    const {
        id: tokenUserId,
        isAdmin: isAdminToken,
    }: { id: number; isAdmin: boolean } = jwtDecode(token);
    const userDetails: UserStateData = useSelector(getUserDetails);

    if (tokenUserId !== userDetails.id) return { status: false };
    else if (isAdminToken === false || userDetails.isAdmin == false)
        return {
            status: false,
            data: {
                ...userDetails,
                isAdmin: false,
            },
        };
    else
        return {
            status: true,
            data: userDetails,
        };
};

const LightEffect = () => {
    return (
        <div className="w-bodyWidth h-screen flex items-center justify-center fixed top-0 pointer-events-none">
            <div className="w-full h-full flex items-center justify-center absolute top-0 opacity-80">
                <div className="absolute left-0 -translate-x-1/2 w-70 h-70 bg-red-500 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute right-0 translate-x-1/2 w-70 h-70 bg-blue-500 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_2s_infinite]"></div>
            </div>
            <h1 className="absolute w-full text-center text-[1000%] uppercase font-bold bg-gradient-to-b from-blue-600  to-red-600 text-transparent bg-clip-text opacity-20 scale-100">
                Keyvalue
            </h1>
        </div>
    );
};

const Layout: React.FC<LayoutProps> = ({
    title,
    children,
    endAdornments,
    isLoading,
}) => {
    const navigate = useNavigate();
    const userDetails = validateToken();
    if (!userDetails) {
        return <PacmanFullScreen />;
    } else if (!userDetails.data) {
        navigate("/login");
    }

    return (
        <div className="flex flex-col min-h-screen bg-bgColor">
            <ToastContainer toastClassName="custom-toast" />
            <Header title={title} endAdornments={endAdornments} />
            <Navbar userDetails={userDetails.data} />
            <div className="flex mt-headerHeight h-bodyHeight">
                <div className="w-full relative ml-navbarWidth">
                    <LightEffect />
                    <main className="p-6 overflow-y-auto w-full h-full relative z-10">
                        {isLoading ? <Pacman /> : children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;
