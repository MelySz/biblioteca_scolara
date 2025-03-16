import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MeniuBibliotecar from "../components/MeniuBibliotecar";

function DashboardBibliotecar() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "bibliotecar") {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex h-screen w-full">
      {/* Meniu Bibliotecar */}
      <MeniuBibliotecar />
    </div>
  );
}

export default DashboardBibliotecar;
