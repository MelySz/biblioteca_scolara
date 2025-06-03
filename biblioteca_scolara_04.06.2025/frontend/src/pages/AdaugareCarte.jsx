import React, { useState } from "react";
import axios from "axios";

function AdaugareCarte() {
  const [carte, setCarte] = useState({
    titlu: "",
    autor: "",
    editura: "",
    descriere: "",
    categorie: "",
    isbn: "",
    an_publicatie: "",
    poza: "",
  });

  const [exemplare, setExemplare] = useState([
    { cod_unic: "", locatie: "", stare: "disponibil" }
  ]);
  const [pozaPreview, setPozaPreview] = useState(null);
  const [loadingPoza, setLoadingPoza] = useState(false);
  const [mesaj, setMesaj] = useState("");

  const token = localStorage.getItem("token");

  const handleCarteChange = (e) => {
    const { name, value } = e.target;
    setCarte({ ...carte, [name]: value });
  };

  const handleExemplarChange = (index, field, value) => {
    const updated = [...exemplare];
    updated[index][field] = value;
    setExemplare(updated);
  };

  const adaugaExemplar = () => {
    setExemplare([...exemplare, { cod_unic: "", locatie: "", stare: "disponibil" }]);
  };

  const stergeExemplar = (index) => {
    const updated = exemplare.filter((_, i) => i !== index);
    setExemplare(updated);
  };

  const handleUploadPoza = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingPoza(true);
    const formData = new FormData();
    formData.append("imagine", file);

    try {
      const res = await axios.post("http://localhost:8000/api/upload-imagine/", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setCarte({ ...carte, poza: res.data.url });
      setPozaPreview(res.data.url);
    } catch (err) {
      console.error("Eroare la upload imagine:", err);
    } finally {
      setLoadingPoza(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const carteRes = await axios.post("http://localhost:8000/api/carte/adaugare/", carte, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const carteId = carteRes.data.id;

      await Promise.all(
        exemplare.map((ex) =>
          axios.post("http://localhost:8000/api/exemplar/adaugare/", {
            carte_id: carteId,
            cod_unic: ex.cod_unic,
            stare: ex.stare,
            locatie: "", 
          }, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      setMesaj("Carte și exemplare adăugate cu succes!");
      setCarte({
        titlu: "",
        autor: "",
        editura: "",
        descriere: "",
        categorie: "",
        isbn: "",
        an_publicatie: "",
        poza: "",
      });
      setExemplare([{ cod_unic: "", locatie: "", stare: "disponibil" }]);
      setPozaPreview(null);
    } catch (err) {
      console.error("Eroare la salvare:", err);
      setMesaj("A apărut o eroare. Verifică datele introduse.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white"><span className="text-green-600">➕</span> Adaugă o carte</h1>

      <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-6 max-h-[65vh] overflow-y-auto scroll-custom">
        {/* Informații carte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="titlu" value={carte.titlu} onChange={handleCarteChange} placeholder="Titlu" required className="p-2 border rounded" />
          <input name="autor" value={carte.autor} onChange={handleCarteChange} placeholder="Autor" required className="p-2 border rounded" />
          <input name="editura" value={carte.editura} onChange={handleCarteChange} placeholder="Editura" className="p-2 border rounded" />
          <input name="isbn" value={carte.isbn} onChange={handleCarteChange} placeholder="ISBN" className="p-2 border rounded"/>
          <input name="an_publicatie" type="number" min={1900} max={new Date().getFullYear()} value={carte.an_publicatie} onChange={handleCarteChange} placeholder="An publicare" className="p-2 border rounded"/>
          <select name="categorie" value={carte.categorie} onChange={handleCarteChange} required className="p-2 border rounded">
            <option value="">-- Alege categorie --</option>
            <option>Literatură</option>
            <option>Științe exacte</option>
            <option>Științe sociale</option>
            <option>Educație</option>
            <option>Dezvoltare personală</option>
          </select>
          <textarea name="descriere" value={carte.descriere} onChange={handleCarteChange} placeholder="Descriere (opțional)" rows={2} className="p-2 border rounded col-span-1 sm:col-span-2"/>
          <div className="flex flex-col gap-2 col-span-1 sm:col-span-2">
            <input type="file" accept="image/*" onChange={handleUploadPoza} className="p-2 border rounded" />
            {loadingPoza && <p className="text-sm text-gray-500">Se încarcă imaginea...</p>}
            {pozaPreview && <img src={pozaPreview} alt="Preview" className="w-32 h-40 object-cover rounded shadow" />}
          </div>
        </div>

        {/* Exemplare */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Exemplare</h2>
          {exemplare.map((ex, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
              <input value={ex.cod_unic} onChange={(e) => handleExemplarChange(index, "cod_unic", e.target.value)} placeholder={`Cod exemplar ${index + 1}`} className="p-2 border rounded" required/>
              <input value={ex.locatie} onChange={(e) => handleExemplarChange(index, "locatie", e.target.value)} placeholder="Locație" className="p-2 border rounded" />
              <select value={ex.stare} onChange={(e) => handleExemplarChange(index, "stare", e.target.value)} className="p-2 border rounded">
                <option value="disponibil">Disponibil</option>
                <option value="deteriorat">Deteriorat</option>
              </select>
              <button type="button" onClick={() => stergeExemplar(index)} className="text-red-600 hover:text-red-800">✖️</button>
            </div>
          ))}
          <button type="button" onClick={adaugaExemplar} className="text-sm text-blue-600 hover:underline">➕ Adaugă exemplar</button>
        </div>

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

export default AdaugareCarte;
