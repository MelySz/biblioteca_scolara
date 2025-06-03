import { Link, useNavigate } from "react-router-dom";

function MeniuElev() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
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
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-md py-3 px-6 rounded mt-auto"
      >
        Logout
      </button>
    </div>
  );
}

export default MeniuElev;
