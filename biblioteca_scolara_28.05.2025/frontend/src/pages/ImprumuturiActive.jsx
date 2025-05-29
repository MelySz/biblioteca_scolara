import React, { useEffect, useState } from "react";
import axios from "axios";

function ImprumuturiActive() {
  const [imprumuturi, setImprumuturi] = useState([]);
  const [filtrate, setFiltrate] = useState([]);
  const [titlu, setTitlu] = useState("");
  const [autor, setAutor] = useState("");
  const [clasa, setClasa] = useState("");
  const [elev, setElev] = useState("");
  const [filtruData, setFiltruData] = useState("toate");
  const [mesaj, setMesaj] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchImprumuturi();
  }, []);

  const fetchImprumuturi = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/imprumuturi/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImprumuturi(res.data);
      applyFiltre(res.data, filtruData);
    } catch (err) {
      console.error("Eroare la încărcare:", err);
    }
  };

  const handleFiltruZile = (tip) => {
    setFiltruData(tip);
    if (tip === "toate") {
      setTitlu("");
      setAutor("");
      setClasa("");
      setElev("");
    }
    setTimeout(() => applyFiltre(imprumuturi, tip), 0);
  };

  const applyFiltre = (lista, filtruZile = filtruData) => {
    let rezultat = [...lista].filter((imp) => !imp.returnat);

    if (titlu) {
      rezultat = rezultat.filter((imp) =>
        imp.carte?.toLowerCase().includes(titlu.toLowerCase())
      );
    }
    if (autor) {
      rezultat = rezultat.filter((imp) =>
        imp.autor?.toLowerCase().includes(autor.toLowerCase())
      );
    }
    if (clasa) {
      rezultat = rezultat.filter((imp) => imp.utilizator_clasa === clasa);
    }
    if (elev) {
      rezultat = rezultat.filter((imp) =>
        `${imp.utilizator_nume} ${imp.utilizator_prenume}`.toLowerCase().includes(elev.toLowerCase())
      );
    }

    if (filtruZile !== "toate") {
      const azi = new Date();
      rezultat = rezultat.filter((imp) => {
        if (!imp.data_imprumut) return false;
        const [zi, luna, an] = imp.data_imprumut.split(".");
        const data = new Date(`${an}-${luna}-${zi}`);
        const diff = Math.floor((azi - data) / (1000 * 60 * 60 * 24));
        switch (filtruZile) {
          case "azi": return diff === 0;
          case "ieri": return diff === 1;
          case "14zile": return diff <= 14;
          case "intarziate": return diff > 14;
          default: return true;
        }
      });
    }

    setFiltrate(rezultat);
  };

  const handleFiltrare = () => {
    applyFiltre(imprumuturi);
  };

  const claseUnice = [...new Set(imprumuturi.map((i) => i.utilizator_clasa).filter(Boolean))];

  // Elevi unici
  const eleviUnici = [];
  const vazuti = new Set();
  imprumuturi.forEach((i) => {
    if (i.utilizator_clasa === clasa) {
      const cheia = `${i.utilizator_nume} ${i.utilizator_prenume}`;
      if (!vazuti.has(cheia)) {
        eleviUnici.push(i);
        vazuti.add(cheia);
      }
    }
  });

  const handleReturnare = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/returnare-carte/${id}/`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setMesaj(response.data.message || "Cartea a fost returnată cu succes.");
        setTimeout(() => setMesaj(""), 3000);
        const updated = imprumuturi.filter((imp) => imp.id !== id);
        setImprumuturi(updated);
        applyFiltre(updated, filtruData);
      }
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("deja returnată")
      ) {
        setMesaj("Această carte a fost deja returnată.");
        setTimeout(() => setMesaj(""), 3000);
        const updated = imprumuturi.filter((imp) => imp.id !== id);
        setImprumuturi(updated);
        applyFiltre(updated, filtruData);
      } else {
        setMesaj("Eroare la returnare.");
        setTimeout(() => setMesaj(""), 3000);
      }
      console.error("Eroare la returnare:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">📚 Împrumuturi active</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
        {/* Filtrare principală */}
        <div className="flex flex-wrap gap-2 items-end">
          <input value={titlu} onChange={(e) => setTitlu(e.target.value)} placeholder="Titlu" className="p-2 border rounded text-sm w-36" />
          <input value={autor} onChange={(e) => setAutor(e.target.value)} placeholder="Autor" className="p-2 border rounded text-sm w-36" />
          <select value={clasa} onChange={(e) => { setClasa(e.target.value); setElev(""); }} className="p-2 border rounded text-sm w-32">
            <option value="">Clasa</option>
            {claseUnice.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
          {clasa && (
            <select value={elev} onChange={(e) => setElev(e.target.value)} className="p-2 border rounded text-sm w-44">
              <option value="">Elev</option>
              {eleviUnici.map((e) => (
                <option key={e.id} value={`${e.utilizator_nume} ${e.utilizator_prenume}`}>
                  {e.utilizator_nume} {e.utilizator_prenume}
                </option>
              ))}
            </select>
          )}
          <button onClick={handleFiltrare} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
            🔍 Filtrează
          </button>
        </div>

        {/* Butoane filtrare pe zile */}
        <div className="flex gap-2 flex-wrap text-sm text-gray-700">
          {[
            { tip: "azi", label: "📅 Azi" },
            { tip: "ieri", label: "🕓 Ieri" },
            { tip: "14zile", label: "🗓️ Ultimele 14 zile" },
            { tip: "intarziate", label: "⚠️ Întârziate >14 zile" },
            { tip: "toate", label: "🔄 Toate" },
          ].map(({ tip, label }) => (
            <button
              key={tip}
              onClick={() => handleFiltruZile(tip)}
              className={`px-3 py-1 rounded ${
                filtruData === tip ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mesaj && <p className="text-blue-800 text-sm mt-2">{mesaj}</p>}

        {/* Lista cu scroll custom */}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto scroll-custom pr-2">
          {filtrate.length === 0 ? (
            <p className="text-red-600 text-sm">Niciun rezultat găsit pentru filtrele selectate.</p>
          ) : (
            filtrate.map((imp) => (
              <div key={imp.id} className="bg-gray-100 p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-sm text-gray-800 space-y-1">
                  <p><strong>📘 Carte:</strong> {imp.carte} | <strong>Exemplar:</strong> {imp.exemplar_cod}</p>
                  <p><strong>👤 Elev:</strong> {imp.utilizator_nume} {imp.utilizator_prenume} | <strong>Clasa:</strong> {imp.utilizator_clasa}</p>
                  <p><strong>📅 Împrumutat:</strong> {imp.data_imprumut} | <strong>Scadent:</strong> {imp.data_scadenta}</p>
                </div>
                <button onClick={() => handleReturnare(imp.id)} className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded text-sm">
                  ✅ Returnează
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ImprumuturiActive;
