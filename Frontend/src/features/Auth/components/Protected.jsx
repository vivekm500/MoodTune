import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";

// it will check if the user is authenticated. If the user is not authenticated, it will redirect them to the login page. If the user is authenticated, it will render the children components.
const Protected = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  
  if (!user) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default Protected;
