const Header = ({ title="Title" } : { title?: string }) => {
    return (
        <div
            className={`flex items-center justify-between w-full py-4 px-8 bg-cardColor h-headerHeight border-2 border-borderColor fixed top-0 left-0 right-0 text-white shadow-lg z-50`}
        >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500  to-blue-500 text-transparent bg-clip-text py-3">
                {title}
            </h1>
        </div>
    );
};

export default Header;