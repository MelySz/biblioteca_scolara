import { Navigate } from "react-router-dom";

function ProtectedRoute({ element, allowedType }) {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return <Navigate to="/login" />;
  }

  if (userType !== allowedType) {
    return <Navigate to={`/${userType === "elev" ? "dashboard-elev" : "dashboard-bibliotecar"}`} />;
  }

  return element;
}

export default ProtectedRoute;
