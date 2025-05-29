import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardRecenzii() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    aprobate: 0,
    inAprobare: 0,
    respinse: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [aprobate, inAprobare, respinse] = await Promise.all([
          axios.get("http://localhost:8000/api/recenzii/?aprobat=true", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/recenzii/?aprobat=false", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/recenzii/?respinse=true", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats({
          aprobate: aprobate.data.length,
          inAprobare: inAprobare.data.length,
          respinse: respinse.data.length,
        });
      } catch (err) {
        console.error("Eroare la statistici recenzii:", err);
      }
    };

    fetchStats();
  }, [token]);

  const actiuni = [
    {
      titlu: "✅ Total recenzii aprobate",
      ruta: "/recenzii/aprobate",
      descriere: "Recenzii aprobate de către bibliotecar",
      numar: stats.aprobate,
    },
    {
      titlu: "🕓 În curs de aprobare",
      ruta: "/recenzii/deaprobat",
      descriere: "Recenzii care necesită validarea bibliotecarului",
      numar: stats.inAprobare,
    },
    {
      titlu: "❌ Total recenzii neaprobate",
      ruta: "/recenzii/neaprobate",
      descriere: "Recenzii neaprobate de către bibliotecar",
      numar: stats.respinse,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center mt-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {actiuni.slice(0, 2).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.ruta)}
            className="cursor-pointer bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-md hover:scale-105 transition-transform text-center"
          >
            <h2 className="text-lg font-semibold mb-1">{item.titlu}</h2>
            <p className="text-sm text-gray-700">{item.descriere}</p>
            <p className="text-2xl font-bold mt-2" style={{ color: "#5f8670" }}>{item.numar}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm">
        <div
          onClick={() => navigate(actiuni[2].ruta)}
          className="cursor-pointer bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-md hover:scale-105 transition-transform text-center"
        >
          <h2 className="text-lg font-semibold mb-1">{actiuni[2].titlu}</h2>
          <p className="text-sm text-gray-700">{actiuni[2].descriere}</p>
          <p className="text-2xl font-bold mt-2" style={{ color: "#5f8670" }}>{actiuni[2].numar}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardRecenzii;
