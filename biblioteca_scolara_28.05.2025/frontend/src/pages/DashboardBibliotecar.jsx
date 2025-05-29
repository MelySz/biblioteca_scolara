import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardBibliotecar() {
  const [statistici, setStatistici] = useState({
    carti: 0,
    exemplare: 0,
    imprumuturi: 0,
    utilizatori: 0,
    suspendati: 0,
    recenzii: 0,
  });
  const [loguri, setLoguri] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "bibliotecar") {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchStatistici = async () => {
      try {
        const cartiRes = await axios.get("http://localhost:8000/api/carti/");
        const carti = cartiRes.data;
        const toateExemplarele = carti.reduce((acc, c) => acc + c.exemplare.length, 0);

        const imprumuturiRes = await axios.get("http://localhost:8000/api/imprumuturi/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const imprumuturi = imprumuturiRes.data;
        const imprumuturiActive = imprumuturi.filter(i => !i.returnat);

        const eleviRes = await axios.get("http://localhost:8000/api/elevi/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const elevi = eleviRes.data; // fără filtrare pe is_active

        const recenziiRes = await axios.get("http://localhost:8000/api/recenzii/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eleviSuspendati = [
          ...new Set(
            imprumuturi
              .filter(i =>
                i.returnat === true &&
                new Date(i.data_restituire) > new Date(i.data_scadenta)
              )
              .map(i => i.utilizator_id)
          )
        ];

        setStatistici({
          carti: carti.length,
          exemplare: toateExemplarele,
          imprumuturi: imprumuturiActive.length,
          utilizatori: elevi.length,
          suspendati: eleviSuspendati.length,
          recenzii: recenziiRes.data.length,
        });
      } catch (error) {
        console.error("Eroare la încărcarea statisticilor:", error);
      }
    };

    const fetchLoguri = async () => {
      try {
        const loguriRes = await axios.get("http://localhost:8000/api/loguri/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoguri(loguriRes.data.slice(0, 5));
      } catch (error) {
        console.error("Eroare la încărcarea logurilor:", error);
      }
    };

    fetchStatistici();
    fetchLoguri();
  }, [token]);

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold text-white drop-shadow">📈 Panou de administrare</h1>

      {/* Statistici */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon="📚" label="Total cărți" value={statistici.exemplare} />
        <StatCard icon="📖" label="Împrumuturi active" value={statistici.imprumuturi} />
        <StatCard icon="👥" label="Utilizatori" value={statistici.utilizatori} />
        <StatCard icon="⛔" label="Utilizatori suspendați" value={statistici.suspendati} />
        <StatCard icon="📝" label="Recenzii" value={statistici.recenzii} />
      </div>

      {/* Loguri recente */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📝 Ultimele acțiuni</h2>
        {loguri.length === 0 ? (
          <p className="text-gray-600">Nu există loguri în ultimele 30 de zile.</p>
        ) : (
          <ul className="space-y-3 max-h-[200px] overflow-y-auto scroll-custom pr-2">
            {loguri.map((log, index) => (
              <li key={index} className="text-sm border-b pb-2">
                <strong>{log.utilizator_email || "Anonim"}</strong> – {log.actiune}
                <div className="text-xs text-gray-500">{new Date(log.data_actiune).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-md text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{label}</h3>
      <p className="text-3xl font-bold" style={{ color: "#5f8670" }}>{value}</p>
    </div>
  );
}

export default DashboardBibliotecar;
