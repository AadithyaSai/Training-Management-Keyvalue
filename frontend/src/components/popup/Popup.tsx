interface PopupProps {
    isOpen: boolean;
    popup: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({ isOpen, popup }) => {
    return (
        isOpen && (
            <div className="fixed inset-0 z-100 bg-modalBgColor flex items-center justify-center">
                {popup}
            </div>
        )
    );
};

export default Popup;
