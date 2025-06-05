import { useNavigate } from "react-router-dom";

function DashboardRapoarte() {
  const navigate = useNavigate();

  const rapoarte = [
    {
      titlu: "📄 Utilizatori",
      descriere: "Rapoarte utilizatorii activi și suspendați",
      ruta: "/rapoarte/utilizatori",
    },
    {
      titlu: "📚 Cărți",
      descriere: "Rapoarte cărți și exemplare din bibliotecă din ziua curentă",
      ruta: "/rapoarte/carti",
    },
    {
      titlu: "🔁 Împrumuturi & retururi",
      descriere: "Rapoarte împrumuturi și returnări efectuate",
      ruta: "/rapoarte/imprumuturi",
    },
    {
      titlu: "📝 Recenzii",
      descriere: "Rapoarte recenzii de carte primite de la elevi",
      ruta: "/rapoarte/recenzii",
    },
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mt-8">
        {rapoarte.map((raport, index) => (
          <div
            key={index}
            onClick={() => navigate(raport.ruta)}
            className="cursor-pointer bg-white/90 backdrop-blur-md p-4 rounded-lg shadow-md hover:scale-105 transition-transform text-center"
          >
            <h2 className="text-lg font-semibold mb-1">{raport.titlu}</h2>
            <p className="text-sm text-gray-700">{raport.descriere}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardRapoarte;
