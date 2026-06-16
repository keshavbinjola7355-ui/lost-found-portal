import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path:"/register",
      element: <Register />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
