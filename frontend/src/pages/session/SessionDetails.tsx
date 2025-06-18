import { useEffect, useState } from "react";
import { SessionContent } from "./components/SessionContent";
import { SessionActionButtons } from "./components/SessionActionButtons";

import { type UserRole, type SessionData, UserRoleType } from "./components/sessionTypes";
import Layout from "../../components/layout/Layout";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteSessionMutation, useGetSessionByIdQuery } from "../../api-service/session/session.api";
import Button, { ButtonType } from "../../components/button/Button";

const SessionDetails = () => {
     const [sessionDetails, setSessionDetails] = useState<SessionData>({
        description: "",
        userRoles: []
    });

    
    const navigate = useNavigate();
    const { trainingId, sessionId } = useParams();
    const { data: sessionDetailsData } = useGetSessionByIdQuery({ id: sessionId });
    const [deleteSession] = useDeleteSessionMutation();

    useEffect(() => {
        if(!sessionDetailsData)
            return;
        setSessionDetails({
            description: sessionDetailsData.description,
            userRoles: []
        })
    }, [sessionDetailsData])

    const userRole: UserRole = UserRoleType.MODERATOR;   

    const checkRole = (roleType: UserRole) => {
        return userRole == roleType;
    }



    if(!sessionDetailsData)
        return (<></>);

    return (
        <Layout title={sessionDetailsData.title} endAdornments={
            <div className="flex gap-3">
                    <Button
                        variant={ButtonType.SECONDARY}
                        onClick={() => navigate("update")}
                    >
                        Update
                    </Button>
                    <Button
                        variant={ButtonType.SECONDARY}
                        onClick={() => {
                            deleteSession({ id: sessionId });
                            navigate(`/training/${trainingId}`);
                        }}
                    >
                        Delete
                    </Button>
                </div>
        }>
            <div className="min-h-screen w-full relative text-white">
                <div>
                    <div className="border border-borderColor bg-cardColor w-full rounded-lg p-6 space-y-6">
                        <SessionContent sessionData={sessionDetails} />

                        {/* Action Buttons */}
                        <div className="pt-4">
                            <SessionActionButtons
                                userRole={userRole}
                                uploadMaterials={checkRole(UserRoleType.TRAINER)}
                                giveFeedback={true}
                                uploadAssignment={checkRole(UserRoleType.CANDIDATE)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};


export default SessionDetails;