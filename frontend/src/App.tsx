import { Provider } from "react-redux";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import store from "./store/store";

import Login from "./pages/login/Login";
import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import CommonDashboard from "./pages/commonDashboard/CommonDashboard";
import TrainingDetails from "./pages/training/TrainingDetails";
import CreateTraining from "./pages/training/CreateTraining";
import UpdateTraining from "./pages/training/UpdateTraining";
import Calendar from "./components/calendar/Calendar";
import SessionDetails from "./pages/session/SessionDetails";
import CreateSession from "./pages/session/CreateSession";
import UpdateSession from "./pages/session/UpdateSession";
import NotFound from "./components/error/notFound/NoutFound";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/adminDashboard/:userId",
        element: <AdminDashboard />,
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard/:userId",
        element: <CommonDashboard />,
        errorElement: <NotFound />,
    },
    {
        path: "/training",
        element: <Outlet />,
        children: [
            {
                path: "create",
                element: <CreateTraining />,
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
                        element: <UpdateTraining />,
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
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
