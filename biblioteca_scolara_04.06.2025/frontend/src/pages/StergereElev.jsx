import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function StergereElev() {
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
        setMesaj("Elevul nu a fost găsit.");
      }
    } catch (err) {
      console.error("Eroare la căutare:", err);
      setMesaj("Eroare la căutare.");
    }
  };

  useEffect(() => {
    if (idDinUrl) cautaElev();
  }, [idDinUrl]);

  const stergeElev = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/utilizatori/stergere/${elev.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMesaj("Elevul a fost șters cu succes.");
      setElev(null);
      setIdCautat("");
    } catch (err) {
      console.error("Eroare la ștergere:", err);
      setMesaj("Eroare la ștergere.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">🧹 Ștergere elev</h1>

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
        <div className="bg-white/90 p-6 rounded-xl shadow-lg space-y-6">
          <p className="text-lg text-gray-800">
            Sigur dorești să ștergi contul elevului/ei <strong>{elev.nume} {elev.prenume}</strong> (Nr. matricol {elev.id})?
          </p>

          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => navigate("/gestionare_elevi/cautare")}
              className="text-sm text-blue-600 hover:underline"
            >
              🔙 Înapoi la căutare elevi
            </button>

            <button
              onClick={stergeElev}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded shadow"
            >
              🧹 Confirmă ștergerea
            </button>
          </div>
        </div>
      )}

      {mesaj && <p className="text-white">{mesaj}</p>}
    </div>
  );
}

export default StergereElev;
