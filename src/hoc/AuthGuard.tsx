import React, { useContext } from "react"
import { AppContext } from "../context/app.context";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps>= ({ children }) => {
    const {authUser} = useContext(AppContext);

    if (!authUser) {
        return <Navigate to="/" />;
    }

    return <>{children}</>
}

export default AuthGuard;