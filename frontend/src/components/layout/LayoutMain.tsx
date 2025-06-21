import { useDispatch } from "react-redux";
import type { LayoutProps } from "./Layout";
import { setLayoutProps } from "../../store/layout/layoutSlice";

interface LayoutMainProps extends LayoutProps {
    children?: React.ReactNode;
}

const LayoutMain: React.FC<LayoutMainProps> = ({
    title,
    endAdornments,
    isLoading,
    userRole,
    children,
}) => {
    const dispatch = useDispatch();
    dispatch(setLayoutProps({ title, endAdornments, isLoading, userRole }));
    return <></>
    // return <>{children}</>;
};

export default LayoutMain;