import { useState } from "react";
import axios from "axios";

function AdaugareElev() {
  const [elev, setElev] = useState({
    id: "",
    email: "",
    parola: "",
    nume: "",
    prenume: "",
    data_nasterii: "",
    clasa: "",
    oras: ""
  });

  const [mesaj, setMesaj] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setElev({ ...elev, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/utilizatori/", {
        ...elev,
        tip: "elev",
        password: elev.parola,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMesaj("✅ Elev adăugat cu succes!");
      setElev({
        id: "", email: "", parola: "", nume: "", prenume: "",
        data_nasterii: "", clasa: "", oras: ""
      });
    } catch (err) {
      console.error("Eroare la adăugare:", err);
      setMesaj("❗ Eroare la salvare. Verifică datele introduse.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">
        <span className="text-green-600">➕</span> Adaugă elev
      </h1>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[75vh] overflow-y-auto scroll-custom">
        {/* Informații elev */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="id" value={elev.id} onChange={handleChange} placeholder="Număr matricol" required className="p-2 border rounded" />
          <input name="email" value={elev.email} onChange={handleChange} placeholder="Email" type="email" required className="p-2 border rounded" />
          <input name="parola" value={elev.parola} onChange={handleChange} placeholder="Parolă" type="password" required className="p-2 border rounded" />
          <input name="nume" value={elev.nume} onChange={handleChange} placeholder="Nume" required className="p-2 border rounded" />
          <input name="prenume" value={elev.prenume} onChange={handleChange} placeholder="Prenume" required className="p-2 border rounded" />
          <input name="data_nasterii" type="date" value={elev.data_nasterii} onChange={handleChange} required className="p-2 border rounded" />
          <input name="clasa" value={elev.clasa} onChange={handleChange} placeholder="Clasa (ex: V)" className="p-2 border rounded" />
          <input name="oras" value={elev.oras} onChange={handleChange} placeholder="Oraș" className="p-2 border rounded" />
        </div>

        {/* Acțiune */}
        <div className="px-6 pb-6 pt-2 border-t border-gray-200 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
            Salvează
          </button>
        </div>

        {mesaj && <p className="text-sm mt-2 text-blue-800">{mesaj}</p>}
      </form>
    </div>
  );
}

export default AdaugareElev;
