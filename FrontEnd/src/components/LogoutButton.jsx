import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LogoutButton = ({ children }) => {
  const { logout } = useAuthStore();

  const onLogout = async () => {
    await logout();
    <Navigate to={"/login"}/>
  };
  return (
    <div>
      <button className="btn btn-primary" onClick={onLogout}>
        {children}
      </button>
    </div>
  );
};

export default LogoutButton;
