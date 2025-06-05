import { useNavigate } from "react-router-dom";

function DashboardImprumuturi() {
  const navigate = useNavigate();

  const actiuni = [
    {titlu: "📚 Împrumuturi active", ruta: "/imprumuturi/active", descriere: "Vezi toate cărțile împrumutate și data returnări"},
    {titlu: "➕ Înregistrare împrumut", ruta: "/imprumuturi/adaugare", descriere: "Înregistrează un nou împrumut pentru un elev"},
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
            <h2 className="text-xl font-semibold mb-2">{item.titlu}</h2>
            <p className="text-gray-700">{item.descriere}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardImprumuturi;
