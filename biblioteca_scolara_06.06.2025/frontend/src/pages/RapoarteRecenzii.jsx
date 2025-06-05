import { useEffect, useState } from "react";
import axios from "axios";

function RapoarteRecenzii() {
  const [recenzii, setRecenzii] = useState([]);
  const [tip, setTip] = useState("toate");
  const [luna, setLuna] = useState(0);
  const [an, setAn] = useState(new Date().getFullYear());
  const token = localStorage.getItem("token");

  const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  useEffect(() => {
    const fetchRecenzii = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/all/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const toate = res.data;

        const filtrate = toate.filter((r) => {
          const data = new Date(r.data_postare);
          const lunaOk = luna === 0 || data.getMonth() + 1 === luna;
          const anOk = data.getFullYear() === an;
          const tipOk =
            tip === "toate" ||
            (tip === "aprobate" && r.aprobat) ||
            (tip === "neaprobate" && !r.aprobat);
          return lunaOk && anOk && tipOk;
        });

        setRecenzii(filtrate);
      } catch (err) {
        console.error("Eroare la încărcarea recenziilor:", err);
      }
    };

    fetchRecenzii();
  }, [tip, luna, an, token]);

  const exportaExcel = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/export/recenzii/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { tip, luna, an },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapoarte_recenzii.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Eroare la export:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">📝 Rapoarte Recenzii</h1>

      {/* Filtre */}
      <div className="flex flex-wrap gap-4 bg-white/90 p-4 rounded shadow items-center">
        <select value={tip} onChange={(e) => setTip(e.target.value)} className="border p-2 rounded">
          <option value="toate">📄 Toate recenziile</option>
          <option value="aprobate">✅ Recenzii aprobate</option>
          <option value="neaprobate">❌ Recenzii neaprobate</option>
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
          Total: {recenzii.length}
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white/90 rounded-xl shadow max-h-[500px] overflow-y-auto scroll-custom">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Recenzie</th>
              <th className="p-2 text-left">Elev</th>
              <th className="p-2 text-left">Clasa</th>
              <th className="p-2 text-left">Cartea</th>
              <th className="p-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {recenzii.map((r, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{r.comentariu || "-"}</td>
                <td className="p-2">{r.utilizator_nume}</td>
                <td className="p-2">{r.utilizator?.clasa || "-"}</td>
                <td className="p-2">{r.carte_titlu}</td>
                <td className="p-2">{new Date(r.data_postare).toLocaleDateString("ro-RO")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {recenzii.length === 0 && (
          <p className="text-center py-4 text-gray-700">Nicio recenzie găsită.</p>
        )}
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <button
          onClick={exportaExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
        >
          📅 Exportă raport
        </button>
      </div>
    </div>
  );
}

export default RapoarteRecenzii;
