import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;  // Ridrejto në Login nëse nuk ka token
  }

  return children;
};

export default ProtectedRoute;
