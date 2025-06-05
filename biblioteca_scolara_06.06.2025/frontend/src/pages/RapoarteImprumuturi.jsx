import { useEffect, useState } from "react";
import axios from "axios";

function RapoarteImprumuturi() {
  const [rapoarte, setRapoarte] = useState([]);
  const [tip, setTip] = useState("imprumuturi");
  const [luna, setLuna] = useState(0);  // 0 înseamnă toate lunile
  const [an, setAn] = useState(new Date().getFullYear());
  const token = localStorage.getItem("token");

  const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  useEffect(() => {
    const fetchRapoarte = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/rapoarte-imprumuturi/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { tip, luna, an }
        });
        setRapoarte(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea rapoartelor:", err);
      }
    };
    fetchRapoarte();
  }, [tip, luna, an, token]);

  const exportaExcel = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/export/imprumuturi/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { tip, luna, an },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapoarte_imprumuturi.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Eroare la export:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">📘 Rapoarte Împrumuturi și Retururi</h1>

      {/* Filtre */}
      <div className="flex flex-wrap gap-4 bg-white/90 p-4 rounded shadow items-center">
        <select value={tip} onChange={(e) => setTip(e.target.value)} className="border p-2 rounded">
          <option value="imprumuturi">📤 Împrumuturi</option>
          <option value="retururi">📥 Retururi</option>
        </select>

        <select value={luna} onChange={(e) => setLuna(parseInt(e.target.value))} className="border p-2 rounded">
          <option value={0}>📅 Toate lunile</option>
          {luni.map((nume, index) => (
            <option key={index + 1} value={index + 1}>{nume}</option>
          ))}
        </select>

        <select value={an} onChange={(e) => setAn(parseInt(e.target.value))} className="border p-2 rounded">
          {[2024, 2025].map((anVal) => (
            <option key={anVal} value={anVal}>{anVal}</option>
          ))}
        </select>

        <div className="ml-auto bg-gray-100 text-sm font-semibold px-4 py-2 rounded shadow border border-gray-300">
          Total: {rapoarte.length}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white/90 rounded-xl shadow max-h-[500px] overflow-y-auto scroll-custom">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Cod exemplar</th>
              <th className="p-2 text-left">Titlu</th>
              <th className="p-2 text-left">Autor</th>
              <th className="p-2 text-left">Elev</th>
              <th className="p-2 text-left">Clasa</th>
              <th className="p-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {rapoarte.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.cod_unic}</td>
                <td className="p-2">{item.titlu}</td>
                <td className="p-2">{item.autor}</td>
                <td className="p-2">{item.elev}</td>
                <td className="p-2">{item.clasa}</td>
                <td className="p-2">{item.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rapoarte.length === 0 && (
          <p className="text-center py-4 text-gray-700">Niciun rezultat găsit.</p>
        )}
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button onClick={exportaExcel} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mt-4">
          📥 Exportă raport
        </button>
      </div>
    </div>
  );
}

export default RapoarteImprumuturi;
