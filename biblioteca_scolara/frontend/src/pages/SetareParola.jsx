import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function SetareParola() {
  const { token } = useParams();
  const [parolaNoua, setParolaNoua] = useState("");
  const [confirmareParola, setConfirmareParola] = useState("");
  const [errorParolaNoua, setErrorParolaNoua] = useState(false);
  const [errorConfirmareParola, setErrorConfirmareParola] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorParolaNoua(false);
    setErrorConfirmareParola(false);
    setMessage("");
    setError("");

    let hasError = false;

    if (!parolaNoua.trim()) {
      setErrorParolaNoua(true);
      hasError = true;
    }

    if (!confirmareParola.trim()) {
      setErrorConfirmareParola(true);
      hasError = true;
    }

    if (parolaNoua !== confirmareParola) {
      setErrorConfirmareParola(true);
      hasError = true;
    }

    if (hasError) return;

    try {
      await axios.post(`http://localhost:8000/resetare-parola/setare/${token}/`, {
        parola_noua: parolaNoua,
      });

      setMessage("Parola a fost resetată cu succes! Redirecționare către login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("A apărut o eroare. Asigură-te că parola respectă cerințele de securitate.");
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full"
      style={{ backgroundImage: "url('/assets/Fundal.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      
      <div className="absolute top-2 md:top-8 w-full flex flex-col items-center text-center">
        <h1 className="text-white text-6xl md:text-7xl font-extrabold">Biblioteca Școlară</h1>
        <h1 className="text-white text-6xl md:text-7xl font-extrabold mt-1">Jamu Mare</h1>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 mt-44">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Setare Parolă Nouă</h2>
        {message && <p className="text-green-500 text-sm mb-2 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-gray-600 font-medium">Parolă Nouă</label>
            <div className="relative flex items-center">
              <input
                type="password"
                className={`w-full p-2 pr-10 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errorParolaNoua ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                placeholder="********"
                value={parolaNoua}
                onChange={(e) => setParolaNoua(e.target.value)}
              />
              {errorParolaNoua && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-red-500 text-xl">
                  ❗
                </span>
              )}
            </div>
            {/* Mesaj cu cerințele parolei sub câmp */}
            <p className="text-gray-600 text-xs mt-1">
              Parola trebuie să aibă cel puțin 8 caractere, o literă mare, o literă mică și un număr.
            </p>
          </div>

          <div className="relative">
            <label className="block text-gray-600 font-medium">Confirmă Parola</label>
            <div className="relative flex items-center">
              <input
                type="password"
                className={`w-full p-2 pr-10 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errorConfirmareParola ? "border-red-500 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                placeholder="********"
                value={confirmareParola}
                onChange={(e) => setConfirmareParola(e.target.value)}
              />
              {errorConfirmareParola && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-red-500 text-xl">
                  ❗
                </span>
              )}
            </div>
          </div>

          <button type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300">
            Resetează Parola
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetareParola;
