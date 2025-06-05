import { useNavigate } from "react-router-dom";

function DashboardGestionareElevi() {
  const navigate = useNavigate();

  const actiuni = [
    {
      titlu: "➕ Adăugare",
      ruta: "/gestionare_elevi/adaugare",
      descriere: "Înregistrează un elev nou în sistem",
    },
    {
      titlu: "🔍 Căutare  ✏️ Editare  🧹 Ștergere",
      ruta: "/gestionare_elevi/cautare",
      descriere: "Caută un elev după nume sau clasă, editează datele sau șterge un cont existent",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
        {actiuni.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.ruta)}
            className="cursor-pointer bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-md hover:scale-105 transition-transform text-center"
          >
            <h2 className="text-lg font-semibold mb-1">{item.titlu}</h2>
            <p className="text-sm text-gray-700">{item.descriere}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardGestionareElevi;
