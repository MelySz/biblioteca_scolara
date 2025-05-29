import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditareElev() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const idDinUrl = params.get("id");

  const [idCautat, setIdCautat] = useState(idDinUrl || "");
  const [elev, setElev] = useState(null);
  const [mesaj, setMesaj] = useState("");
  const token = localStorage.getItem("token");

  const cautaElev = async () => {
    setMesaj("");
    try {
      const res = await axios.get("http://localhost:8000/api/elevi/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const gasit = res.data.find((e) => e.id === idCautat);
      if (gasit) {
        setElev(gasit);
      } else {
        setElev(null);
        setMesaj("❗ Elevul nu a fost găsit.");
      }
    } catch (err) {
      console.error("Eroare la căutare:", err);
      setMesaj("❗ Eroare la căutare.");
    }
  };

  useEffect(() => {
    if (idDinUrl) cautaElev();
  }, [idDinUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElev((prev) => ({ ...prev, [name]: value }));
  };

  const salveaza = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nume: elev.nume,
        prenume: elev.prenume,
        clasa: elev.clasa
      };

      await axios.put(`http://localhost:8000/api/utilizatori/${elev.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMesaj("Modificările au fost salvate.");
    } catch (err) {
      console.error("Eroare la salvare:", err);
      if (err.response?.data) {
        console.error("Detalii backend:", err.response.data);
        alert("Eroare backend: " + JSON.stringify(err.response.data));
      }
      setMesaj("❗ Eroare la salvare.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">✏️ Editare elev</h1>

      {!idDinUrl && (
        <form onSubmit={(e) => { e.preventDefault(); cautaElev(); }} className="bg-white/90 p-4 rounded shadow space-y-4">
          <input
            type="text"
            value={idCautat}
            onChange={(e) => setIdCautat(e.target.value)}
            placeholder="Număr matricol elev"
            required
            className="p-2 border rounded w-full"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow">
            Caută elevul
          </button>
        </form>
      )}

      {elev && (
        <form onSubmit={salveaza} className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[70vh] overflow-y-auto scroll-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input value={elev.id} disabled className="p-2 border rounded bg-gray-100 text-gray-600 font-semibold" title="Numărul matricol nu poate fi modificat" />
            <input name="nume" value={elev.nume} onChange={handleChange} placeholder="Nume" className="p-2 border rounded" />
            <input name="prenume" value={elev.prenume} onChange={handleChange} placeholder="Prenume" className="p-2 border rounded" />
            <input name="clasa" value={elev.clasa || ""} onChange={handleChange} placeholder="Clasa" className="p-2 border rounded" />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-blue-800 text-sm">{mesaj}</p>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
              Salvează modificările
            </button>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => navigate("/gestionare_elevi/cautare")}
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              🔙 Înapoi la căutare elevi
            </button>
          </div>
        </form>
      )}

      {!elev && mesaj && <p className="text-blue-800">{mesaj}</p>}
    </div>
  );
}

export default EditareElev;
