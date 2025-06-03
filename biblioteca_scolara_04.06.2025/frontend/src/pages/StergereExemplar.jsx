import React, { useState } from "react";
import axios from "axios";

function EditareExemplar() {
  const [cuvant, setCuvant] = useState("");
  const [exemplare, setExemplare] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const cautaExemplare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMesaj("");
    setExemplare([]);

    try {
      const res = await axios.get("http://localhost:8000/api/carti/cautare/", {
        params: { q: cuvant },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      if (Array.isArray(data) && data.length === 0) {
        setMesaj("Nicio carte găsită.");
      } else if (Array.isArray(data)) {
        const toateExemplarele = data.flatMap(c => c.exemplare);
        const codCautat = cuvant.trim().toLowerCase();
        const filtrate = toateExemplarele.filter(ex => ex.cod_unic?.toLowerCase() === codCautat);
        setExemplare(filtrate.length > 0 ? filtrate : toateExemplarele);
      } else if (data.message) {
        setMesaj(data.message);
      } else {
        setMesaj("Nicio carte găsită.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setMesaj(err.response.data.message);
      } else {
        setMesaj("Eroare la căutare.");
      }
    } finally {
      setLoading(false);
    }
  };

  const stergeExemplar = async (id) => {
    
    try {
        await axios.delete(`http://localhost:8000/api/exemplar/stergere/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExemplare(prev => prev.filter(ex => ex.id !== id));
      setMesaj("Exemplarul a fost șters.");
      setTimeout(() => setMesaj(""), 3000);
    } catch (err) {
      console.error(err);
      setMesaj("Eroare la ștergere.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white"> 🧹 Ștergere Exemplar</h1>

      {/* Căutare */}
      <form onSubmit={cautaExemplare} className="bg-white/90 p-4 rounded shadow space-y-4">
        <input
          type="text"
          value={cuvant}
          onChange={(e) => setCuvant(e.target.value)}
          placeholder="Introdu numărul de inventar, titlul sau autorul cărții"
          className="p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
        >
          Caută
        </button>
      </form>

      {/* Mesaj */}
      {!loading && mesaj && (
        <p className="text-white text-sm text-center transition-all duration-300">{mesaj}</p>
      )}

      {/* Lista exemplare */}
      {exemplare.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[65vh] overflow-y-auto scroll-custom">
          <h2 className="text-lg font-semibold mb-2">Exemplare găsite:</h2>
          {exemplare.map((ex) => (
            <div
              key={ex.id}
              className="border p-3 rounded bg-gray-50 flex justify-between items-center"
            >
              <div>
                <strong>Cod:</strong> {ex.cod_unic} | <strong>Titlu:</strong> {ex.titlu_carte} | <strong>Autor:</strong> {ex.autor_carte} | <strong>Stare:</strong>{" "}
                <span className={
                  ex.stare === "disponibil" ? "text-green-600 font-medium"
                  : ex.stare === "imprumutat" ? "text-yellow-600 font-medium"
                  : "text-red-600 font-medium"
                }>
                  {ex.stare}
                </span>
              </div>
              <button
                onClick={() => stergeExemplar(ex.id)}
                className="text-sm text-blue-800 hover:underline"
              >
                🧹 Șterge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditareExemplar;
