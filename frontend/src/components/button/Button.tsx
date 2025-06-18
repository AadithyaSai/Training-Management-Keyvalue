export const ButtonType = {
    PRIMARY: "Primary",
    SECONDARY: "Secondary",
    PLAIN: "Plain",
} as const;

interface ButtonProps {
    variant?: (typeof ButtonType)[keyof typeof ButtonType];
    type?: "button" | "submit";
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    variant = ButtonType.PLAIN,
    type = "button",
    children,
    className,
    disabled=false,
    onClick,
}) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={type}
            className={`${
                variant === ButtonType.PLAIN
                    ? ""
                    : variant === ButtonType.PRIMARY
                    ? "bg-white border text-itemColor border-borderColor hover:bg-gray-300"
                    : "bg-itemColor border text-white border-borderColor hover:bg-gray-300 hover:text-black"
            } px-4 py-2 rounded transition duration-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
