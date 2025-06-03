import React, { useState } from "react";
import axios from "axios";

function EditareExemplar() {
  const [cuvant, setCuvant] = useState("");
  const [exemplare, setExemplare] = useState([]);
  const [exemplarSelectat, setExemplarSelectat] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const cautaExemplare = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMesaj("");
    setExemplare([]);
    setExemplarSelectat(null);

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

  const handleExemplarChange = (e) => {
    const { name, value } = e.target;
    setExemplarSelectat((prev) => ({ ...prev, [name]: value }));
  };

  const salveazaExemplar = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/exemplare/${exemplarSelectat.id}/`,
        exemplarSelectat,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMesaj("Exemplarul a fost actualizat cu succes!");
      setTimeout(() => setMesaj(""), 3000);
    } catch (err) {
      console.error(err);
      setMesaj("Eroare la salvare.");
    }
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white">✏️ Editare Exemplar</h1>

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

      {/* Mesaj eroare dacă nu e găsită nicio carte */}
      {!loading && mesaj && !exemplarSelectat && (
        <p className="text-white text-sm text-center transition-all duration-300">{mesaj}</p>
      )}

      {/* Lista exemplare */}
      {exemplare.length > 0 && !exemplarSelectat && (
        <div className="bg-white/90 p-4 rounded shadow">
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
                onClick={() => setExemplarSelectat(ex)}
                className="text-sm text-blue-600 hover:underline"
              >
                ✏️ Editează
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formular editare */}
      {exemplarSelectat && (
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[65vh] overflow-y-auto scroll-custom">
          <form onSubmit={salveazaExemplar} className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Editare carte cu numărul de inventar: {exemplarSelectat.cod_unic}
              </h2>
              <button
                type="button"
                onClick={() => setExemplarSelectat(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                🔙 Înapoi la listă
              </button>
            </div>

            {/* Câmpuri de editare */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="cod_unic"
                value={exemplarSelectat.cod_unic}
                onChange={handleExemplarChange}
                className="p-2 border rounded"
                placeholder="Cod unic"
                required
              />
              <input
                name="locatie"
                value={exemplarSelectat.locatie || ""}
                onChange={handleExemplarChange}
                className="p-2 border rounded"
                placeholder="Locație"
              />
              <select
                name="stare"
                value={exemplarSelectat.stare}
                onChange={handleExemplarChange}
                className="p-2 border rounded col-span-1 sm:col-span-2"
              >
                <option value="disponibil">Disponibil</option>
                <option value="deteriorat">Deteriorat</option>
              </select>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-blue-800 text-sm">{mesaj}</p>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
              >
                Salvează modificările
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditareExemplar;
