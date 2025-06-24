import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";

import Login from "./pages/login/Login";
import NotFound from "./components/error/notFound/NoutFound";
import { PacmanFullScreen } from "./components/loader/Pacman";
import CreateUserPool, {
    PoolUserRoleType,
} from "./pages/createUserPool/CreateUserPool";

const AdminDashboard = lazy(
    () => import("./pages/adminDashboard/AdminDashboard")
);
const CommonDashboard = lazy(
    () => import("./pages/commonDashboard/CommonDashboard")
);
const TrainingDetails = lazy(() => import("./pages/training/TrainingDetails"));
const CreateTraining = lazy(() => import("./pages/training/CreateTraining"));
const UpdateTraining = lazy(() => import("./pages/training/UpdateTraining"));
const Calendar = lazy(() => import("./components/calendar/Calendar"));
const SessionDetails = lazy(() => import("./pages/session/SessionDetails"));
const CreateSession = lazy(() => import("./pages/session/CreateSession"));
const UpdateSession = lazy(() => import("./pages/session/UpdateSession"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/adminDashboard/:userId",
        element: (
            <Suspense fallback={<PacmanFullScreen />}>
                <AdminDashboard />
            </Suspense>
        ),
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard/:userId",
        element: (
            <Suspense fallback={<PacmanFullScreen />}>
                <CommonDashboard />
            </Suspense>
        ),
        errorElement: <NotFound />,
    },
    {
        path: "/training",
        element: (
            <Suspense fallback={<PacmanFullScreen />}>
                <Outlet />
            </Suspense>
        ),
        children: [
            {
                path: "create",
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <CreateTraining />,
                    },
                    {
                        path: "createPool",
                        element: <Outlet />,
                        children: [
                            {
                                path: "trainer",
                                element: (
                                    <CreateUserPool
                                        role={PoolUserRoleType.TRAINER}
                                    />
                                ),
                            },
                            {
                                path: "moderator",
                                element: (
                                    <CreateUserPool
                                        role={PoolUserRoleType.MODERATOR}
                                    />
                                ),
                            },
                            {
                                path: "candidate",
                                element: (
                                    <CreateUserPool
                                        role={PoolUserRoleType.CANDIDATE}
                                    />
                                ),
                            },
                        ],
                    },
                ],
            },
            {
                path: ":trainingId",
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <TrainingDetails />,
                    },
                    {
                        path: "update",
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: <UpdateTraining />,
                            },
                            {
                                path: "createPool",
                                element: <Outlet />,
                                children: [
                                    {
                                        path: "trainer",
                                        element: (
                                            <CreateUserPool
                                                role={PoolUserRoleType.TRAINER}
                                            />
                                        ),
                                    },
                                    {
                                        path: "moderator",
                                        element: (
                                            <CreateUserPool
                                                role={
                                                    PoolUserRoleType.MODERATOR
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        path: "candidate",
                                        element: (
                                            <CreateUserPool
                                                role={
                                                    PoolUserRoleType.CANDIDATE
                                                }
                                            />
                                        ),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        path: "calendar",
                        element: <Calendar />,
                    },
                    {
                        path: "session",
                        element: <Outlet />,
                        children: [
                            {
                                index: true,
                                element: <NotFound />,
                            },
                            {
                                path: "create",
                                element: <CreateSession />,
                            },
                            {
                                path: ":sessionId",
                                element: <Outlet />,
                                children: [
                                    {
                                        index: true,
                                        element: <SessionDetails />,
                                    },
                                    {
                                        path: "update",
                                        element: <UpdateSession />,
                                    },
                                ],
                            },
                        ],
                        errorElement: <NotFound />,
                    },
                ],
            },
        ],
        errorElement: <NotFound />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    );
}

export default App;
