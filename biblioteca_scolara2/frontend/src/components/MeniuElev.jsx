import { Link, useNavigate } from "react-router-dom";

function MeniuElev() {
  const navigate = useNavigate();
  const nume = localStorage.getItem("nume") || "";
  const prenume = localStorage.getItem("prenume") || "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative flex h-screen w-full">
      {/* Imaginea de fundal */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/Fundal.jpg')",
        }}
      ></div>

      {/* Overlay pentru contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Conținutul */}
      <div className="relative flex flex-col w-full h-full">
        {/* Antetul */}
        <div className="w-full shadow-md py-4 px-8 flex justify-between items-center fixed top-0 left-0 z-10 bg-black bg-opacity-40 text-white h-16">
          <h1 className="text-xl font-bold">Biblioteca Școlară Jamu Mare</h1>
          <p className="text-md font-semibold">Bine ai venit, {prenume} {nume}!</p>
        </div>

        <div className="flex flex-grow w-full mt-16">
          {/* Meniul */}
          <div className="w-64 text-white flex flex-col p-8 bg-black bg-opacity-40">
            {/* Mesaj introductiv */}
            <div className="border-b border-white pb-4 text-center">
              <h2 className="text-md font-semibold">Descoperă lumea cărților!</h2>
              <p className="text-sm mt-1">Citește, învață, explorează.</p>
            </div>

            {/* Meniu */}
            <nav className="flex flex-col flex-grow mt-4 space-y-4">
              <ul className="flex flex-col space-y-3">
                <li><Link to="/dashboard-elev" className="hover:text-yellow-400 transition-colors duration-200">🏠 Acasă</Link></li>
                <li><Link to="/carti" className="hover:text-yellow-400 transition-colors duration-200">📚 Catalog cărți</Link></li>
                <li><Link to="/imprumuturile-mele" className="hover:text-yellow-400 transition-colors duration-200">📖 Împrumuturile mele</Link></li>
                <li><Link to="/recenziile-mele" className="hover:text-yellow-400 transition-colors duration-200">⭐ Recenziile mele</Link></li>
              </ul>
            </nav>

            {/* Buton Logout */}
            <button 
              onClick={handleLogout} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded mt-auto"
            >
              Logout
            </button>
          </div>

          {/* Zona principală de conținut */}
          <div className="flex-1 h-full"></div>
        </div>
      </div>
    </div>
  );
}

export default MeniuElev;
