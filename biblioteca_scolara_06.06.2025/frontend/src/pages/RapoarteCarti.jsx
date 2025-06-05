import { useEffect, useState } from "react";
import axios from "axios";

function RapoarteCarti() {
  const [exemplare, setExemplare] = useState([]);
  const [tipAfisare, setTipAfisare] = useState("toate");
  const token = localStorage.getItem("token");
  const azi = new Date().toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  useEffect(() => {
    const fetchExemplare = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/exemplare-extinse/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExemplare(res.data);
      } catch (err) {
        console.error("Eroare la încărcarea exemplarelor:", err);
      }
    };
    fetchExemplare();
  }, [token]);

  const filtrareExemplare = exemplare.filter((ex) => {
    if (tipAfisare === "imprumutate") return ex.imprumutat;
    if (tipAfisare === "neimprumutate") return !ex.imprumutat;
    return true;
  });

  const exportaExcel = async () => {
    try {
      const params = {};
      if (tipAfisare !== "toate") params.tip = tipAfisare;

      const res = await axios.get("http://localhost:8000/api/export/exemplare/", {
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapoarte_exemplare.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Eroare la export:", err);
      alert("❗ Exportul a eșuat.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold text-white">📚 Rapoarte Cărți - Exemplare (centralizator: {azi})</h1>

      {/* Filtrare + Total */}
      <div className="flex flex-wrap gap-4 bg-white/90 p-4 rounded shadow items-center">
        {["toate", "neimprumutate", "imprumutate"].map((tip) => (
          <label key={tip} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={tipAfisare === tip}
              onChange={() => setTipAfisare(tip)}
              className="h-4 w-4"
            />
            <span>
              {tip === "toate" && "📊 Total exemplare"}
              {tip === "imprumutate" && "📤 Exemplare împrumutate"}
              {tip === "neimprumutate" && "📦 Exemplare neîmprumutate"}
            </span>
          </label>
        ))}

        <div className="ml-auto bg-gray-100 text-sm font-semibold px-4 py-2 rounded shadow border border-gray-300">
          Total: {filtrareExemplare.length}
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
              {tipAfisare === "toate" && <th className="p-2 text-left">Disponibilitate</th>}
              {tipAfisare === "imprumutate" && (
                <>
                  <th className="p-2 text-left">Elev</th>
                  <th className="p-2 text-left">Data împrumut</th>
                  <th className="p-2 text-left">Data retur estimat</th>
                  <th className="p-2 text-left">Zile rămase</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filtrareExemplare.map((ex) => (
              <tr key={ex.id} className="border-t">
                <td className="p-2">{ex.cod_unic}</td>
                <td className="p-2">{ex.titlu}</td>
                <td className="p-2">{ex.autor}</td>
                {tipAfisare === "toate" && (
                  <td className="p-2">
                    {ex.imprumutat ? (
                      <span className="text-red-500 font-semibold">Indisponibil</span>
                    ) : (
                      <span className="text-green-600 font-semibold">Disponibil</span>
                    )}
                  </td>
                )}
                {tipAfisare === "imprumutate" && (
                  <>
                    <td className="p-2">{ex.elev || "-"}</td>
                    <td className="p-2">{ex.data_imprumut || "-"}</td>
                    <td className="p-2">{ex.data_retur || "-"}</td>
                    <td className="p-2">{ex.zile_ramase ?? "-"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtrareExemplare.length === 0 && (
          <p className="text-center py-4 text-gray-700">Niciun exemplar găsit.</p>
        )}
      </div>

      {/* Export */}
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

export default RapoarteCarti;
