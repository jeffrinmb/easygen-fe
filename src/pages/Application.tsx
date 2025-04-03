import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";
// import styles from "../styles/glob/al.css";

const Application: React.FC = () => {
  const { user, signOut } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">Welcome to the application.</h1>
        <p className="app-subtitle">
          You are signed in as {user.name} ({user.email})
        </p>

        <Button onClick={signOut} className="logout-button">
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Application;
