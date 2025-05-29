import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetareParola() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.post("http://localhost:8000/resetare-parola/", { email });
      setMessage("Un email cu instrucțiuni de resetare a parolei a fost trimis.");
    } catch (err) {
      setError("Email invalid sau utilizator inexistent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        backgroundImage: "url('/assets/Fundal.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Titlul */}
      <div className="absolute top-2 md:top-8 w-full flex flex-col items-center text-center">
        <h1 className="text-white text-6xl md:text-7xl font-extrabold">Biblioteca Școlară</h1>
        <h1 className="text-white text-6xl md:text-7xl font-extrabold mt-1">Jamu Mare</h1>
      </div>

      {/* Formular de resetare parola */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 mt-44">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Resetare Parolă</h2>
        {message && <p className="text-green-500 text-sm mb-2 text-center">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <form onSubmit={handleReset} className="space-y-4" noValidate>
          <div>
            <label className="block text-gray-600 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="exemplu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300"
            disabled={loading}
          >
            Resetează Parola
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Ți-ai amintit parola?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Conectează-te
          </button>
        </p>
      </div>
    </div>
  );
}

export default ResetareParola;
