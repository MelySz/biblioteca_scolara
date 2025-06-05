import React, { useEffect, useState } from "react";
import axios from "axios";

function RecenziiAprobateElev() {
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecenzii = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/aprobate-elev/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecenzii(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea recenziilor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecenzii();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">✅ Recenziile mele aprobate</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-h-[70vh] overflow-y-auto scroll-custom">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : recenzii.length === 0 ? (
          <p className="text-gray-500 text-center">Nu ai recenzii aprobate momentan.</p>
        ) : (
          <ul className="space-y-3">
            {recenzii.map((r, index) => (
              <li key={index} className="border p-4 rounded bg-gray-50">
                <p className="text-sm text-gray-800">
                  <strong>{r.carte_titlu}</strong>{" "}
                  <span className="italic text-gray-600">de {r.autor_carte}</span>
                </p>
                <p className="text-sm italic text-gray-700 mt-1">
                  {r.comentariu || "Fără comentariu."}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Rating: {r.rating}/10 · {new Date(r.data_postare).toLocaleString("ro-RO")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RecenziiAprobateElev;
