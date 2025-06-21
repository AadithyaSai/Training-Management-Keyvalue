import { PacmanLoader } from "react-spinners";

const Pacman = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <PacmanLoader color="#fff" size={30} />
        </div>
    );
};

export const PacmanFullScreen = () => {
    return (
        <div className="flex items-center justify-center w-full h-screen">
            <PacmanLoader color="#fff" size={30} />
        </div>
    );
};

export default Pacman;
