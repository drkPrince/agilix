import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Boards from "./screens/Boards";
import Kanban from "./screens/Kanban";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Boards />,
    errorElement: <p>Sorry</p>,
  },
  {
    path: "/board/:boardId",
    element: <Kanban />,
    errorElement: <p>Sorry</p>,
  },
]);

const AuthenticatedApp = () => {
  return <RouterProvider router={router} />;
};

export default AuthenticatedApp;
