import { useEffect, useState } from "react";
import axios from "axios";

function AdaugareRecenzie() {
  const [comentariu, setComentariu] = useState("");
  const [carteId, setCarteId] = useState("");
  const [rating, setRating] = useState(0);
  const [carti, setCarti] = useState([]);
  const [mesaj, setMesaj] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCartiImprumutate = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/istoric-imprumuturi/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartiUnice = [];
        const idCartiAdaugate = new Set();

        res.data.forEach((imp) => {
          if (imp.carte_id && !idCartiAdaugate.has(imp.carte_id)) {
            cartiUnice.push({
              carte_id: imp.carte_id,
              carte: imp.carte,
              autor: imp.autor,
            });
            idCartiAdaugate.add(imp.carte_id);
          }
        });

        setCarti(cartiUnice);
      } catch (err) {
        console.error("Eroare la încărcarea cărților împrumutate:", err);
        setMesaj("Eroare la încărcarea datelor. Încearcă din nou.");
      }
    };

    fetchCartiImprumutate();
  }, [token]);

  const trimiteRecenzie = async () => {
    if (!carteId || !comentariu || rating === 0) {
      setMesaj("❗ Completați toate câmpurile și acordați un rating.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/recenzii/",
        { carte: carteId, comentariu, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComentariu("");
      setCarteId("");
      setRating(0);
      setMesaj("✅ Recenzia a fost trimisă spre aprobare.");
      setTimeout(() => setMesaj(""), 3000);
    } catch (err) {
      console.error("Eroare la trimiterea recenziei:", err);
      setMesaj("❌ Eroare la trimitere.");
    }
  };

  const handleStarClick = (index) => {
    const newRating = (index + 1) * 2;
    setRating(newRating);
  };

  const renderStele = () => {
    const steleActive = rating / 2;
    const procent = (rating / 10) * 100;

    return (
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${procent}%` }}
          />
        </div>

        <div className="flex space-x-2 justify-center items-center text-3xl font-bold select-none">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              onClick={() => handleStarClick(i)}
              className={`cursor-pointer transition-all duration-200 transform hover:scale-125 ${
                i < steleActive ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-700 ml-3">{rating}/10</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold text-white drop-shadow">✍️ Scrie o recenzie</h1>

      <div className="bg-white/90 rounded-xl p-6 shadow-lg space-y-4 border border-gray-200">
        {mesaj && <p className="text-sm font-medium text-blue-600">{mesaj}</p>}

        <div className="space-y-2">
          <label className="block font-medium text-sm text-gray-700">Cartea:</label>
          <select
            value={carteId}
            onChange={(e) => setCarteId(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="">Selectează cartea</option>
            {carti.map((c) => (
              <option key={c.carte_id} value={c.carte_id}>
                {c.carte} – {c.autor}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm text-gray-700">Comentariu:</label>
          <textarea
            value={comentariu}
            onChange={(e) => setComentariu(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Scrie recenzia..."
          />
        </div>

        <div className="space-y-1">
          <label className="block font-medium text-sm text-gray-700">Rating:</label>
          {renderStele()}
        </div>

        <button
          onClick={trimiteRecenzie}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md shadow"
        >
          Trimite recenzia
        </button>
      </div>
    </div>
  );
}

export default AdaugareRecenzie;
