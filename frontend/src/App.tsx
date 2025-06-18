import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import CreateUserPool, {
    PoolUserRole,
} from "./pages/createUserPool/CreateUserPool";

import AdminDashboard from "./pages/adminDashboard/AdminDashboard";
import CreateTraining from "./pages/training/CreateTraining";
import UpdateTraining from "./pages/training/UpdateTraining";
import Login from "./pages/login/Login";
import TrainingDetails from "./pages/training/TrainingDetails";
import NotFound from "./components/error/notFound/NoutFound";

import CreateSession from "./components/createSession/CreateSession";

import SessionDetails from "./pages/session/SessionDetails";
import { Provider } from "react-redux";
import store from "./store/store";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard",
        element: <AdminDashboard />,
        errorElement: <NotFound />,
    },
    {
        path: "/training",
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <NotFound />,
            },
            {
                path: "create",
                element: <CreateTraining />,
            },
            {
                path: ":trainingId",
                element: <TrainingDetails />,
            },
            {
                path: ":trainingId/update",
                element: <UpdateTraining />,
            },
        ],
        errorElement: <NotFound />,
    },
    {
        path: "/session",
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <NotFound />,
            },
            {
                path: ":sessionId",
                element: <SessionDetails />,
            },
            {
                path: "create",
                element: <CreateSession />,
            },
        ],
        errorElement: <NotFound />,
    },
    {
        path: "/createPool",
        element: <Outlet />,
        children: [
            {
                path: "trainer",
                element: <CreateUserPool role={PoolUserRole.TRAINER} />,
            },
            {
                path: "moderator",
                element: <CreateUserPool role={PoolUserRole.MODERATOR} />,
            },
            {
                path: "candidate",
                element: <CreateUserPool role={PoolUserRole.CANDIDATE} />,
            },
        ],
        errorElement: <NotFound />,
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
