import { useState, type FormEvent } from "react";
import LoginInput from "./LoginInput";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../api-service/auth/login.api";
import Button, { ButtonType } from "../../../components/button/Button";
import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";


type SliderPosition = "left" | "right";

type LoginFormSectionProps = {
    type?: string;
    children?: React.ReactNode;
    onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

const KVLogo = () => {
    return (
        <div className="flex w-60">
            <img src="images/kv-logo.png" alt="" />
        </div>
    );
};

const LoginFormSection: React.FC<LoginFormSectionProps> = ({
    type = "signin",
    children,
    onSubmit,
}) => {
    return (
        <form
            onSubmit={onSubmit}
            className="w-[50%] h-full flex flex-col items-center justify-center gap-8 px-2 text-white"
        >
            <h2 className="text-[40px] font-bold">
                {type == "signup" ? "Sign Up" : "Sign In"}
            </h2>
            <div className="w-[80%] flex flex-col items-center justify-center gap-5">
                {children}
            </div>
            {type == "signin" && (
                <p className="cursor-pointer hover:text-gray-300 transition-all duration-300">
                    Forget Password?
                </p>
            )}
            <Button
                variant={ButtonType.PLAIN}
                type="submit"
                className="border border-borderColor bg-white hover:bg-gray-300 hover:scale-105 transition-all duration-300 text-black px-10 py-2 rounded-md uppercase text-md"
            >
                {type?.toUpperCase()}
            </Button>
        </form>
    );
};

const LoginFormSlider = () => {
    const [sliderPosition, setSliderPosition] =
        useState<SliderPosition>("left");
    const formText = sliderPosition == "left" ? "Welcome text" : "Welcome back";
    const buttonText = sliderPosition == "left" ? "Signup" : "Signin";
    const toggleSlider = () => {
        sliderPosition == "left"
            ? setSliderPosition("right")
            : setSliderPosition("left");
    };
    return (
        <div
            className={`w-[50%] h-full flex flex-col items-center justify-center absolute left-0 bg-gradient-to-br from-blue-700 to-red-600 gap-10 duration-400 text-white ${
                sliderPosition == "left" ? "rounded-r-3xl" : "rounded-l-3xl"
            } ${sliderPosition == "right" && "translate-x-[100%]"}`}
        >
            <KVLogo />
            <p className="text-2xl">{formText}</p>
            <button
                className="border border-white hover:bg-white hover:text-black transition-all duration-300 px-8 py-1.5 rounded-md uppercase"
                onClick={toggleSlider}
            >
                {buttonText}
            </button>
        </div>
    );
};

const LoginForm = () => {
    const [signinData, setSigninData] = useState({
        username: "",
        password: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [login] = useLoginMutation();

    const navigate = useNavigate();

    const handleLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login({ username: signinData.username, password: signinData.password })
            .unwrap()
            .then((data) => {
                localStorage.setItem("token", data.accessToken);
                setSigninData({ username: "", password: "" });

                const decoded: { id: number; isAdmin: boolean } = jwtDecode(
                    data.accessToken
                );
                const isAdmin = decoded.isAdmin; 

                if (isAdmin) {
                    navigate("/adminDashboard");
                } else {
                    navigate(`/dashboard/${decoded.id}`);
                }

            })
            .catch((error) => {
                setSigninData({ username: "", password: "" });
                toast.error(`Error: ${error.data.error || "Something went wrong"}`,  { autoClose: 2000 });
            });
    };

    return (
        <div className="flex items-center justify-center w-[750px] h-[500px] bg-[rgba(0, 0, 0, 0.2)] backdrop-blur-xl rounded-md shadow-md overflow-hidden relative border border-borderColor">
            <LoginFormSection type="signup">
                <LoginInput
                    name="name"
                    id="name"
                    placeholder="Name"
                    value={signupData.name}
                    onChange={(event) =>
                        setSignupData({
                            ...signupData,
                            name: event.target.value,
                        })
                    }
                />
                <LoginInput
                    name="email"
                    id="email"
                    placeholder="Email"
                    value={signupData.email}
                    onChange={(event) =>
                        setSignupData({
                            ...signupData,
                            email: event.target.value,
                        })
                    }
                />
                <LoginInput
                    name="password"
                    id="new-password"
                    type="password"
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(event) =>
                        setSignupData({
                            ...signupData,
                            password: event.target.value,
                        })
                    }
                />
            </LoginFormSection>

            <LoginFormSection type="signin" onSubmit={handleLogin}>
                <LoginInput
                    name="username"
                    id="username"
                    placeholder="Username"
                    value={signinData.username}
                    onChange={(event) =>
                        setSigninData({
                            ...signinData,
                            username: event.target.value,
                        })
                    }
                />
                <LoginInput
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={signinData.password}
                    onChange={(event) =>
                        setSigninData({
                            ...signinData,
                            password: event.target.value,
                        })
                    }
                />
            </LoginFormSection>
            <LoginFormSlider />
        </div>
    );
};

export default LoginForm;
