import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorEmail(false);
    setErrorPassword(false);

    let hasError = false;

    if (!email.trim()) {
      setErrorEmail(true);
      hasError = true;
    }

    if (!password.trim()) {
      setErrorPassword(true);
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/login/", {
        email,
        password,
      });

      const { tip, access } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("userType", tip);

      if (tip === "elev") {
        navigate("/dashboard-elev");
      } else if (tip === "bibliotecar") {
        navigate("/dashboard-bibliotecar");
      } else {
        setErrorEmail(true);
      }
    } catch (err) {
      setErrorEmail(true);
      setErrorPassword(true);
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
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Titlul */}
      <div className="absolute top-2 md:top-8 w-full flex flex-col items-center text-center">
        <h1 className="text-white text-6xl md:text-7xl font-extrabold">
          Biblioteca Școlară
        </h1>
        <h1 className="text-white text-6xl md:text-7xl font-extrabold mt-1">
          Jamu Mare
        </h1>
      </div>

      {/* Formularul de autentificare */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mt-48 md:mt-56 z-10">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Autentificare
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="relative">
            <label className="block text-gray-600 font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errorEmail ? "border-red-500 pr-10 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                placeholder="Introduceți adresa de email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorEmail && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
                  ❗
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-600 font-medium">Parolă</label>
            <div className="relative">
              <input
                type="password"
                className={`w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errorPassword ? "border-red-500 pr-10 focus:ring-red-400" : "focus:ring-blue-400"
                }`}
                placeholder="Introduceți parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorPassword && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 text-xl">
                  ❗
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Se încarcă..." : "Conectează-te"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Ai uitat parola?{" "}
          <a href="/resetare-parola" className="text-blue-500 hover:underline">
            Resetează parola
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
