import React, { useEffect, useState } from "react";
import axios from "axios";

function AdaugareImprumut() {
  const [cuvant, setCuvant] = useState("");
  const [carti, setCarti] = useState([]);
  const [coduriSelectate, setCoduriSelectate] = useState([]);
  const [clasaSelectata, setClasaSelectata] = useState("");
  const [elevSelectat, setElevSelectat] = useState("");
  const [dataScadenta, setDataScadenta] = useState("");
  const [elevi, setElevi] = useState([]);
  const [mesaj, setMesaj] = useState("");
  const [mesajCarti, setMesajCarti] = useState("");


  const token = localStorage.getItem("token");

  const cautaCarti = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/carti/cautare/", {
        params: { q: cuvant },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Verificăm dacă există cartea înregistrată în bibliotecă 
      const cartiGasite = res.data.results || res.data; // suportă ambele formate

      if (cartiGasite.length === 0) {
        setCarti([]);
        setMesajCarti(res.data.message || "Nicio carte nu a fost găsită.");
        return;
      }

    // Există cărți, dar verificăm dacă există măcar un exemplar în total
      const toateFaraExemplare = cartiGasite.every(carte => carte.exemplare.length === 0);
      if (toateFaraExemplare) {
        setCarti([]);
        setMesajCarti("Nu există niciun exemplar disponibil în bibliotecă.");
        return;
      }

    // Verificăm dacă toate exemplarele sunt imprumutate/deteriorate
      const toateIndisponibile = cartiGasite.every(carte =>
        carte.exemplare.every(ex => ex.stare !== "disponibil")
      );

      if (toateIndisponibile) {
        setCarti([]);
        setMesajCarti("Toate exemplarele existente sunt deja împrumutate sau deteriorate.");
        return;
      }

    // Avem cel puțin un exemplar disponibil
      setCarti(cartiGasite);
      setMesajCarti("");
    } catch (err) {
      console.error("Eroare la căutare:", err);
      setCarti([]);
      setMesajCarti("Eroare la căutare. Încearcă din nou.");
    }
  };

  const fetchElevi = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/elevi/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElevi(res.data);
    } catch (err) {
      console.error("Eroare la elevi:", err);
    }
  };

  useEffect(() => {
    const azi = new Date();
    azi.setDate(azi.getDate() + 14);
    const dataFormatata = azi.toISOString().split("T")[0];
    setDataScadenta(dataFormatata);
  }, []);

  useEffect(() => {
    fetchElevi();
  }, []);

  const claseUnice = [...new Set(elevi.map((e) => e.clasa).filter(Boolean))];
  const eleviFiltrati = elevi.filter((e) => e.clasa === clasaSelectata);

  const handleCheckbox = (cod_unic) => {
    setCoduriSelectate((prev) =>
      prev.includes(cod_unic)
        ? prev.filter((cod) => cod !== cod_unic)
        : [...prev, cod_unic]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (coduriSelectate.length === 0 || !elevSelectat || !dataScadenta) {
      setMesaj("Selectează cel puțin un exemplar, un elev și o dată scadentă.");
      return;
    }

    // verifică dacă toate exemplarele selectate sunt disponibile
    const exemplareIndisponibile = [];
    carti.forEach((carte) => {
      carte.exemplare.forEach((ex) => {
        if (coduriSelectate.includes(ex.cod_unic) && ex.stare !== "disponibil") {
          exemplareIndisponibile.push(ex.cod_unic);
        }
      });
    });

    if (exemplareIndisponibile.length > 0) {
      setMesaj("Exemplarul selectat nu este disponibil pentru împrumut.");
      return;
    }

    try {
      for (let cod_exemplar of coduriSelectate) {
        await axios.post(
          "http://localhost:8000/api/imprumutare-carte/",
          { cod_exemplar, data_scadenta: dataScadenta },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-USER-ID": elevSelectat,
            },
          }
        );
      }

      setMesaj("Împrumutul a fost înregistrat.");
      setTimeout(() => setMesaj(""), 3000);

      setCoduriSelectate([]);
      setClasaSelectata("");
      setElevSelectat("");
      setDataScadenta("");
      setCuvant("");
      setCarti([]);
    } catch (err) {
      console.error("Eroare la înregistrare:", err);
      setMesaj("Eroare la înregistrare împrumut.");
      setTimeout(() => setMesaj(""), 3000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">📘 Înregistrare Împrumut</h1>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[65vh] overflow-y-auto scroll-custom">
        {/* Căutare carte */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            value={cuvant}
            onChange={(e) => setCuvant(e.target.value)}
            placeholder="Caută după titlu, autor sau număr de inventar"
            className="p-2 border rounded flex-grow"
          />
          <button
            type="button"
            onClick={cautaCarti}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Caută
          </button>
        </div>

         {mesajCarti && (
          <p className="text-sm text-red-600 mt-2">{mesajCarti}</p>
        )}

        {/* Lista cărți + bife exemplare cu scroll */}
        {carti.length > 0 && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto scroll-custom pr-2 border rounded-lg p-3">
            {carti.map((carte) => (
              <div key={carte.id} className="border rounded p-3 bg-gray-100">
                <h3 className="font-semibold text-lg">{carte.titlu}</h3>
                <p className="text-sm text-gray-700 mb-2">Autor: {carte.autor}</p>
                {carte.exemplare.map((ex) => (
                  <div key={ex.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={coduriSelectate.includes(ex.cod_unic)}
                      onChange={() => handleCheckbox(ex.cod_unic)}
                    />
                    <label>
                      {ex.cod_unic} | {carte.isbn} | {carte.an_publicatie} |{" "}
                      <span className={
                        ex.stare === "disponibil" ? "text-green-600" :
                        ex.stare === "imprumutat" ? "text-yellow-600" :
                        "text-red-600"
                      }>
                        {ex.stare}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Selectare clasă și elev */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={clasaSelectata}
            onChange={(e) => setClasaSelectata(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">-- Selectează clasa --</option>
            {claseUnice.map((cl, i) => (
              <option key={i} value={cl}>
                {cl}
              </option>
            ))}
          </select>

          {clasaSelectata && (
            <select
              value={elevSelectat}
              onChange={(e) => setElevSelectat(e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="">-- Selectează elevul --</option>
              {eleviFiltrati.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nume} {e.prenume}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Data scadentă */}
        <label className="text-sm text-gray-700 font-medium mt-4 block">
        Data scadentă (14 zile de la data curentă):
        </label>
        <input
          type="date"
          value={dataScadenta}
          onChange={(e) => setDataScadenta(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />

        {/* Aprobare */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-blue-800 text-sm">{mesaj}</p>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow"
          >
            ✅ Aprobă împrumutul
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdaugareImprumut;
