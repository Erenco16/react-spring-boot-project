// src/components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
