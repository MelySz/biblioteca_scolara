import { useEffect, useState } from "react";
import axios from "axios";

function RapoarteUtilizatori() {
  const [utilizatori, setUtilizatori] = useState([]);
  const [clasaFiltrata, setClasaFiltrata] = useState("");
  const [doarSuspendati, setDoarSuspendati] = useState(false);
  const [frecventa, setFrecventa] = useState("0");
  const [an, setAn] = useState(new Date().getFullYear());
  const token = localStorage.getItem("token");

  const clasePrimare = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  const luni = [
    { label: "📅 Suspendați astăzi", value: "azi" },
    { label: "📆 Toate lunile", value: "toate" },
    { label: "Ianuarie", value: 1 },
    { label: "Februarie", value: 2 },
    { label: "Martie", value: 3 },
    { label: "Aprilie", value: 4 },
    { label: "Mai", value: 5 },
    { label: "Iunie", value: 6 },
    { label: "Iulie", value: 7 },
    { label: "August", value: 8 },
    { label: "Septembrie", value: 9 },
    { label: "Octombrie", value: 10 },
    { label: "Noiembrie", value: 11 },
    { label: "Decembrie", value: 12 },
  ];

  useEffect(() => {
    const fetchUtilizatori = async () => {
      try {
        const params = {};
        if (clasaFiltrata) params.clasa = clasaFiltrata;

        if (doarSuspendati) {
          if (frecventa === "azi") {
            params.azi = "true";
          } else if (frecventa === "toate") {
            params.suspendati = "true";
          } else if (parseInt(frecventa)) {
            params.suspendati = "true";
            params.luna = frecventa;
            params.an = an;
          }
        }

        const res = await axios.get("http://localhost:8000/api/elevi/", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        setUtilizatori(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea utilizatorilor:", err);
      }
    };

    fetchUtilizatori();
  }, [token, clasaFiltrata, doarSuspendati, frecventa, an]);

  const exportaExcel = async () => {
    try {
      const params = {};
      if (clasaFiltrata) params.clasa = clasaFiltrata;

      if (doarSuspendati) {
        if (frecventa === "azi") {
          params.azi = "true";
        } else if (frecventa === "toate") {
          params.suspendati = "true";
        } else if (parseInt(frecventa)) {
          params.suspendati = "true";
          params.luna = frecventa;
          params.an = an;
        }
      }

      const res = await axios.get("http://localhost:8000/api/export/utilizatori/", {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapoarte_utilizatori.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Eroare la export:", err);
      alert("❗ Exportul a eșuat.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">📄 Raport Utilizatori</h1>

      {/* Filtre */}
      <div className="flex flex-wrap items-center gap-6 bg-white/90 p-4 rounded shadow">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-700 whitespace-nowrap">Filtrare după clasă:</label>
          <select
            value={clasaFiltrata}
            onChange={(e) => setClasaFiltrata(e.target.value)}
            className="p-2 border rounded min-w-[150px]"
          >
            <option value="">Toate clasele</option>
            {clasePrimare.map((clasa, index) => (
              <option key={index} value={clasa}>Clasa {clasa}</option>
            ))}
          </select>
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={doarSuspendati}
            onChange={(e) => setDoarSuspendati(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Utilizatori suspendați</span>
        </label>

        <select
          value={frecventa}
          onChange={(e) => setFrecventa(e.target.value)}
          className="p-2 border rounded"
          disabled={!doarSuspendati}
        >
          <option value="0">Alege opțiune</option>
          {luni.map((luna) => (
            <option key={luna.value} value={luna.value}>{luna.label}</option>
          ))}
        </select>

        <select
          value={an}
          onChange={(e) => setAn(parseInt(e.target.value))}
          className="p-2 border rounded"
          disabled={!doarSuspendati || frecventa === "azi" || frecventa === "0"}
        >
          {[2024, 2025].map((anVal) => (
            <option key={anVal} value={anVal}>{anVal}</option>
          ))}
        </select>

        <div className="ml-auto bg-gray-100 text-sm font-semibold px-4 py-2 rounded shadow border border-gray-300">
          Total: {utilizatori.length}
        </div>
      </div>

      {/* Tabel scrollabil */}
      <div className="bg-white/90 rounded-xl shadow max-h-[500px] overflow-y-auto scroll-custom">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Nume</th>
              <th className="p-2 text-left">Prenume</th>
              <th className="p-2 text-left">Clasa</th>
              {doarSuspendati && frecventa === "azi" && (
                <th className="p-2 text-left">Zile rămase</th>
              )}
            </tr>
          </thead>
          <tbody>
            {utilizatori.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.nume}</td>
                <td className="p-2">{u.prenume}</td>
                <td className="p-2">{u.clasa || "-"}</td>
                {doarSuspendati && frecventa === "azi" && (
                  <td className="p-2">{u.zile_ramase}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {utilizatori.length === 0 && (
          <p className="text-center py-4 text-gray-700">Niciun utilizator găsit.</p>
        )}
      </div>

      {/* Buton export */}
      <div className="flex justify-end">
        <button
          onClick={exportaExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow mt-4"
        >
          📥 Exportă raport
        </button>
      </div>
    </div>
  );
}

export default RapoarteUtilizatori;
