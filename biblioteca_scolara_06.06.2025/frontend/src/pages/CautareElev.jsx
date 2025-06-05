import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CautareElev() {
  const [criterii, setCriterii] = useState({
    id: "",
    nume: "",
    prenume: "",
    clasa: ""
  });

  const [rezultate, setRezultate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cautat, setCautat] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriterii({ ...criterii, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCautat(true);
    try {
      const res = await axios.get("http://localhost:8000/api/elevi/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtrate = res.data.filter((elev) =>
        (criterii.id === "" || elev.id.toLowerCase().includes(criterii.id.toLowerCase())) &&
        (criterii.nume === "" || elev.nume.toLowerCase().includes(criterii.nume.toLowerCase())) &&
        (criterii.prenume === "" || elev.prenume.toLowerCase().includes(criterii.prenume.toLowerCase())) &&
        (criterii.clasa === "" || elev.clasa?.toLowerCase() === criterii.clasa.toLowerCase())
      );
      setRezultate(filtrate);
    } catch (error) {
      console.error("Eroare la căutare:", error);
      setRezultate([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCriterii({ id: "", nume: "", prenume: "", clasa: "", email: "" });
    setRezultate([]);
    setCautat(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">🔍 Caută elev</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[75vh] overflow-y-auto scroll-custom">
        {/* Formular de căutare */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="id" value={criterii.id} onChange={handleChange} placeholder="Număr matricol" className="p-2 border rounded" />
            <input name="nume" value={criterii.nume} onChange={handleChange} placeholder="Nume" className="p-2 border rounded" />
            <input name="prenume" value={criterii.prenume} onChange={handleChange} placeholder="Prenume" className="p-2 border rounded" />
            <input name="clasa" value={criterii.clasa} onChange={handleChange} placeholder="Clasa (ex: V)" className="p-2 border rounded" />
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={handleReset} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded shadow">
              Resetează
            </button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
              Caută
            </button>
          </div>
        </form>

        {/* Rezultate */}
        {cautat && (
          <>
            {loading && <p className="text-gray-600">Se caută...</p>}
            <div className="space-y-4">
              {rezultate.length > 0 ? (
                rezultate.map((e) => (
                  <div key={e.id} className="bg-white p-4 rounded shadow space-y-2">
                    <h3 className="text-lg font-bold">{e.nume} {e.prenume}</h3>
                    <p className="text-sm text-gray-700"><strong>Nr. matricol:</strong> {e.id}</p>
                    <p className="text-sm text-gray-700">Clasa: {e.clasa || "-"}</p>
                    <p className="text-sm text-gray-700">Email: {e.email}</p>
                    <p className="text-sm text-gray-700">Oraș: {e.oras || "-"}</p>

                    {/* Butoane editare/ștergere */}
                    <div className="flex gap-4 pt-2 border-t mt-2">
                      <button
                        onClick={() => navigate(`/gestionare_elevi/editare?id=${e.id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow text-sm"
                      >
                        ✏️ Editare
                      </button>
                      <button
                        onClick={() => navigate(`/gestionare_elevi/stergere?id=${e.id}`)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-sm"
                      >
                        🧹 Ștergere
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-red-600">Niciun elev găsit.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CautareElev;
