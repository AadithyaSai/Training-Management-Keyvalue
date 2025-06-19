import { ToastContainer } from "react-toastify";
import LoginForm from "./components/LoginForm";

const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-bgColor">
            <ToastContainer toastClassName="login-toast"/>
            <div className="w-bodyWidth h-screen flex items-center justify-center fixed top-0 pointer-events-none
            ">
                <h1 className="absolute w-full text-center text-[1000%] uppercase font-bold bg-gradient-to-b from-blue-500  to-red-500 text-transparent bg-clip-text opacity-50 scale-200 blur-[2px]">
                    Keyvalue
                </h1>
            </div>
            <LoginForm />
        </div>
    );
};

export default Login;
