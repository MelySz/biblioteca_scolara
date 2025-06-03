import React, { useState } from "react";
import axios from "axios";
import HartaBiblioteca from "../components/HartaBiblioteca";

function CautareCarte() {
  const [criterii, setCriterii] = useState({
    titlu: "",
    autor: "",
    editura: "",
    categorie: "",
    an_publicatie: "",
    isbn: "",
    q: ""
  });

  const [rezultate, setRezultate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cautat, setCautat] = useState(false); // 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriterii({ ...criterii, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCautat(true);
    try {
      const response = await axios.get("http://localhost:8000/api/carti/cautare/", {
        params: criterii,
      });
      setRezultate(response.data);
    } catch (error) {
      console.error("Eroare la căutare:", error);
      setRezultate([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCriterii({
      titlu: "",
      autor: "",
      editura: "",
      categorie: "",
      an_publicatie: "",
      cod_unic: "",
      isbn: "",
      q: ""
    });
    setRezultate([]);
    setCautat(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">🔍 Caută o carte</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[75vh] overflow-y-auto scroll-custom">

        {/* Formular */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="titlu" value={criterii.titlu} onChange={handleChange} placeholder="Titlu" className="p-2 border rounded" />
            <input name="autor" value={criterii.autor} onChange={handleChange} placeholder="Autor" className="p-2 border rounded" />
            <input name="editura" value={criterii.editura} onChange={handleChange} placeholder="Editura" className="p-2 border rounded" />
            <input name="an_publicatie" type="number" min="1900" max={new Date().getFullYear()} value={criterii.an_publicatie} onChange={handleChange} placeholder="An publicație" className="p-2 border rounded" />
            <input name="cod_unic" value={criterii.cod_unic} onChange={handleChange} placeholder="Cod unic / Număr inventar" className="p-2 border rounded"/>
            <input name="isbn" value={criterii.isbn} onChange={handleChange} placeholder="ISBN" className="p-2 border rounded" />
            <select name="categorie" value={criterii.categorie} onChange={handleChange} className="p-2 border rounded">
              <option value="">-- Alege categorie --</option>
              <option>Literatură</option>
              <option>Științe exacte</option>
              <option>Științe sociale</option>
              <option>Educație</option>
              <option>Dezvoltare personală</option>
            </select>
            <input name="q" value={criterii.q} onChange={handleChange} placeholder="Căutare după un cuvânt cheie" className="p-2 border rounded" />
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

        {/* Rezultate doar dacă s-a căutat */}
        {cautat && (
          <>
            {loading && <p className="text-gray-600">Se caută...</p>}

            <div className="space-y-4">
              {rezultate.length > 0 ? (
                rezultate.map((carte) => (
                  <div key={carte.id} className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-1">{carte.titlu}</h3>
                    <p className="text-sm text-gray-700"><strong>Autor:</strong> {carte.autor}</p>
                    <p className="text-sm text-gray-700"><strong>Editura:</strong> {carte.editura}</p>
                    <p className="text-sm text-gray-700"><strong>Categorie:</strong> {carte.categorie}</p>
                    <p className="text-sm text-gray-700"><strong>Exemplare disponibile:</strong> {carte.exemplare_disponibile}</p>
                    {carte.poza && <img src={carte.poza} alt={carte.titlu} className="w-24 h-32 object-cover rounded mt-2" />}

                    {/* Exemplare */}
                    <div className="mt-3">
                      <h4 className="text-md font-semibold">📚 Exemplare:</h4>
                      <ul className="space-y-1 text-sm">
                        {carte.exemplare.map((ex) => (
                          <li key={ex.id} className="border p-2 rounded bg-gray-50">
                          <strong>Cod:</strong> {ex.cod_unic} | <strong>ISBN:</strong> {ex.isbn} | <strong>An:</strong> {ex.an_publicatie} | <strong>Stare:</strong> 
                          <span className={
                            ex.stare === "disponibil" ? "text-green-600 font-medium"
                            : ex.stare === "imprumutat" ? "text-yellow-600 font-medium"
                            : "text-red-600 font-medium"
                          }> {ex.stare}</span>
                        </li>
                        ))}
                      </ul>
                      {carte.exemplare.length > 0 && (<HartaBiblioteca exemplare={carte.exemplare} />)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-red-600">Nicio carte nu a fost găsită în bibliotecă.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CautareCarte;
