import React, { useEffect, useState } from "react";
import axios from "axios";

function RecenziiAprobate() {
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carteSearch, setCarteSearch] = useState("");
  const [elevSearch, setElevSearch] = useState("");
  const [sort, setSort] = useState("data-desc");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecenzii = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/?aprobat=true", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecenzii(res.data);
      } catch (err) {
        console.error("Eroare la recenzii aprobate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecenzii();
  }, [token]);

  const recenziiFiltrate = recenzii
    .filter((rec) =>
      rec.carte_titlu.toLowerCase().includes(carteSearch.toLowerCase()) &&
      rec.utilizator_nume.toLowerCase().includes(elevSearch.toLowerCase())
    )
    .sort((a, b) => {
      const azi = new Date().toLocaleDateString();
      const dataA = new Date(a.data_postare).toLocaleDateString();
      const dataB = new Date(b.data_postare).toLocaleDateString();

      if (dataA === azi && dataB !== azi) return -1;
      if (dataA !== azi && dataB === azi) return 1;

      if (sort === "data-desc") return new Date(b.data_postare) - new Date(a.data_postare);
      if (sort === "data-asc") return new Date(a.data_postare) - new Date(b.data_postare);
      if (sort === "rating-desc") return b.rating - a.rating;
      if (sort === "rating-asc") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="flex flex-col max-w-5xl mx-auto h-[calc(100vh-80px)] space-y-6">
      <h1 className="text-3xl font-bold text-white">✅ Recenzii aprobate</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="bg-white/90 backdrop-blur-md p-4 rounded-lg shadow flex flex-wrap gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Titlu carte"
          value={carteSearch}
          onChange={(e) => setCarteSearch(e.target.value)}
          className="px-3 py-2 border rounded flex-grow min-w-[150px]"
        />
        <input
          type="text"
          placeholder="Nume elev"
          value={elevSearch}
          onChange={(e) => setElevSearch(e.target.value)}
          className="px-3 py-2 border rounded flex-grow min-w-[150px]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 border rounded flex-grow min-w-[150px]"
        >
          <option value="data-desc">🕒 Cele mai recente</option>
          <option value="data-asc">🕒 Cele mai vechi</option>
          <option value="rating-desc">⭐ Rating descrescător</option>
          <option value="rating-asc">⭐ Rating crescător</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow"
        >
          🔍 Filtrează
        </button>
      </form>

      {/* Scroll container cu flex-grow */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl space-y-4 max-h-[60vh] overflow-y-auto scroll-custom">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : recenzii.length === 0 ? (
          <p className="text-gray-600">Nu există nicio recenzie aprobată.</p>
        ) : recenziiFiltrate.length === 0 ? (
          <p className="text-sm text-red-600">❗ Nicio recenzie găsită pentru criteriile introduse.</p>
        ) : (
          recenziiFiltrate.map((recenzie) => (
            <div key={recenzie.id} className="border p-4 rounded bg-gray-50 space-y-2">
              <p className="text-lg font-semibold text-blue-800">{recenzie.carte_titlu}</p>
              <p className="text-sm italic text-gray-600">de {recenzie.utilizator_nume}</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-lg">
                    {i < Math.round(recenzie.rating / 2) ? "★" : "☆"}
                  </span>
                ))}
                <span className="text-sm text-gray-600">({recenzie.rating}/10)</span>
              </div>
              <p className="text-sm text-gray-800">{recenzie.comentariu}</p>
              <p className="text-xs text-right text-gray-500">
                📅 {new Date(recenzie.data_postare).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecenziiAprobate;
