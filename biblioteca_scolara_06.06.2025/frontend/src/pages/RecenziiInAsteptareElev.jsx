import React, { useEffect, useState } from "react";
import axios from "axios";

function RecenziiInAsteptareElev() {
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/in-asteptare-elev/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setRecenzii(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea recenziilor în așteptare:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">🕒 Recenziile mele în așteptare</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-h-[70vh] overflow-y-auto scroll-custom">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : recenzii.length === 0 ? (
          <p className="text-gray-500 text-center">Nu ai recenzii în curs de aprobare.</p>
        ) : (
          <ul className="space-y-3">
            {recenzii.map((r) => (
              <li key={r.id} className="border p-4 rounded bg-gray-50">
                <p className="text-sm text-gray-800 font-medium">
                  {r.carte_titlu}{" "}
                  <span className="italic text-gray-600">de {r.autor_carte}</span>
                </p>
                <p className="text-sm italic text-gray-700 mt-1">
                  {r.comentariu || "Fără comentariu."}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RecenziiInAsteptareElev;
