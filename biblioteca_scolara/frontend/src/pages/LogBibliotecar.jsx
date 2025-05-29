import React, { useEffect, useState } from "react";
import axios from "axios";

function LogActivitate() {
  const [loguri, setLoguri] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLoguri = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/loguri/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoguri(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea logurilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoguri();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">📜 Loguri - Jurnal Activitate</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-h-[70vh] overflow-y-auto scroll-custom">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : loguri.length === 0 ? (
          <p className="text-gray-500 text-center">Nu există activitate în ultimele 30 de zile.</p>
        ) : (
          <ul className="space-y-3">
            {loguri.map((log, index) => (
              <li key={index} className="border p-4 rounded bg-gray-50">
                <p className="text-sm text-gray-800">
                  <strong>{log.utilizator_email || "Anonim"}:</strong> {log.actiune}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(log.data_actiune).toLocaleString("ro-RO")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default LogActivitate;
