import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MeniuElev from "../components/MeniuElev";

function DashboardElev() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "elev") {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex h-screen w-full">
      {/* Meniu Elev */}
      <MeniuElev />
    </div>
  );
}

export default DashboardElev;
