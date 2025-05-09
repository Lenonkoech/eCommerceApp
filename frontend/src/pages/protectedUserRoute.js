import { Navigate, Outlet } from "react-router-dom";

const ProtectedUserRoute = () => {
    const token = sessionStorage.getItem("token");

    return token ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedUserRoute;
