import React, { useEffect, useState } from "react";
import axios from "axios";

const domenii = ["Literatură", "Științe exacte", "Științe sociale", "Educație", "Dezvoltare personală"];

const DashboardElev = () => {
  const [showModal, setShowModal] = useState(false);
  const [domeniiSelectate, setDomeniiSelectate] = useState([]);
  const [recomandari, setRecomandari] = useState([]);
  const [mesajEroare, setMesajEroare] = useState("");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType !== "elev") return;

    verificareDomenii();
  }, []);

  const verificareDomenii = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/domenii-curente/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      const domeniiCurente = response.data.domenii_interes;

      if (Array.isArray(domeniiCurente) && domeniiCurente.length === 3) {
        setShowModal(false);
        getRecomandari();
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Eroare la verificarea domeniilor", err);
      setShowModal(true);
    }
  };

  const handleSelect = (domeniu) => {
    if (domeniiSelectate.includes(domeniu)) {
      setDomeniiSelectate(domeniiSelectate.filter((item) => item !== domeniu));
    } else if (domeniiSelectate.length < 3) {
      setDomeniiSelectate([...domeniiSelectate, domeniu]);
    }
  };

  const handleConfirm = async () => {
    if (domeniiSelectate.length !== 3) {
      setMesajEroare("Alegeți 3 domenii de interes!");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/setare-domenii/", {
        domenii: domeniiSelectate,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      setMesajEroare("");
      setShowModal(false);
      getRecomandari();
    } catch (error) {
      setMesajEroare("Eroare la salvarea domeniilor.");
    }
  };

  const getRecomandari = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/recomandari-carti/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setRecomandari(response.data.recomandari);
    } catch (err) {
      console.error("Eroare la încărcarea recomandărilor", err);
    }
  };

  return (
    <>
      {/* Pop-up pentru selectarea domeniilor */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-black/20 flex items-center justify-center z-50">
          <div className="bg-[#fef9f2]/90 backdrop-blur-md border border-white/30 p-8 rounded-3xl shadow-2xl w-[400px] text-center">
            <h2 className="text-xl font-bold mb-2">Alege 3 domenii de interes</h2>

            {mesajEroare && (
              <p className="text-red-600 text-sm font-medium mb-4">{mesajEroare}</p>
            )}

            <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
              {domenii.map((domeniu) => (
                <button
                  key={domeniu}
                  onClick={() => handleSelect(domeniu)}
                  className={`p-2 rounded-md font-medium border text-sm transition duration-200 ${
                    domeniiSelectate.includes(domeniu)
                      ? "bg-[#d9e4dd] border-[#5f8670] text-[#2f4034]"
                      : "bg-[#fdfaf4] hover:bg-[#f3ebdd] border-[#e0d5c3] text-[#4b3f33]"
                  }`}
                >
                  {domeniu}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md transition duration-300"
            >
              Confirmă
            </button>
          </div>
        </div>
      )}

      {/* Recomandări */}
      {!showModal && (
        recomandari.length === 0 ? (
          <div className="flex-1 p-8 mt-2">
            <p className="text-md font-medium text-white/90 drop-shadow-md">
              Momentan nu există recomandări disponibile.
            </p>
          </div>
        ) : (
          <div className="p-8 overflow-auto mt-2">
            <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-md">Recomandările tale</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recomandari.map((carte) => (
                <div key={carte.id} className="bg-white shadow rounded p-4">
                  <img
                    src={carte.poza || "/assets/default-book.jpg"}
                    alt={carte.titlu}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="mt-2 text-lg font-semibold">{carte.titlu}</h3>
                  <p className="text-sm text-gray-600">{carte.autor}</p>
                  <p className="text-xs italic text-gray-500">{carte.categorie}</p>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </>
  );
};

export default DashboardElev;
