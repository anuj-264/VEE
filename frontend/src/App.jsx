import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  SignUp,
  LogIn,
  CustomAgentImage,
  Home,
  CustomAgentName,
} from "./pages";
import { useContext } from "react";
import { UserDataContext } from "./context/userContext";

const App = () => {
  const { userData } = useContext(UserDataContext);

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        userData?.assistantImage && userData?.assistantName ? (
          <Home />
        ) : (
          <Navigate to="/custom-image" />
        ),
    },
    {
      path: "/signup",

      element: !userData ? <SignUp /> : <Navigate to="/" />,
    },

    {
      path: "/login",

      element: !userData ? <LogIn /> : <Navigate to="/" />,
    },
    {
      path: "/custom-image",
      element: userData ? <CustomAgentImage /> : <Navigate to="/signup" />,
    },
    {
      path: "/custom-name",
      element: userData ? <CustomAgentName /> : <Navigate to="/signup" />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
