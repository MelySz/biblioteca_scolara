import React, { useEffect, useState } from "react";
import axios from "axios";

function RecenziiRespinseElev() {
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mesaj, setMesaj] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecenzii = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/respinse-elev/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecenzii(res.data);
      } catch (error) {
        console.error("Eroare la încărcarea recenziilor respinse:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecenzii();
  }, []);

  const stergeRecenzie = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/recenzii/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecenzii((prev) => prev.filter((r) => r.id !== id));
      setMesaj("Recenzia a fost ștearsă");

      setTimeout(() => {
        setMesaj("");
      }, 3000);
    } catch (error) {
      console.error("Eroare la ștergerea recenziei:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">❌ Recenziile mele neaprobate</h1>

      {mesaj && (
        <p className="text-sm text-white">{mesaj}</p>
      )}

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg max-h-[70vh] overflow-y-auto scroll-custom">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : recenzii.length === 0 ? (
          <p className="text-gray-500 text-center">Nu ai recenzii neaprobate.</p>
        ) : (
          <ul className="space-y-3">
            {recenzii.map((recenzie) => (
              <li key={recenzie.id} className="border p-4 rounded bg-gray-50 relative">
                <p className="text-sm text-gray-800 font-medium">
                  {recenzie.carte_titlu}{" "}
                  <span className="italic text-gray-600">de {recenzie.autor_carte}</span>
                </p>
                <p className="text-sm italic text-gray-700 mt-1">
                  {recenzie.comentariu || "Fără comentariu."}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Data: {new Date(recenzie.data_postare).toLocaleDateString("ro-RO")}
                </p>
                <button
                  onClick={() => stergeRecenzie(recenzie.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Șterge
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default RecenziiRespinseElev;
