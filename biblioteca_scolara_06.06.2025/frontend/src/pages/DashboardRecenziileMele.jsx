import { useNavigate } from "react-router-dom";

function DashboardRecenziileMele() {
  const navigate = useNavigate();

  const actiuni = [
    {
      titlu: "✍️ Scrie o recenzie",
      ruta: "/recenzii/adaugare",
      descriere: "Completează un formular pentru o carte citită",
    },
    {
      titlu: "✅ Recenzii aprobate",
      ruta: "/recenziile-mele/aprobate",
      descriere: "Vezi lista recenziilor aprobate de către bibliotecar",
    },
    {
      titlu: "🕓 Recenzii în așteptare",
      ruta: "/recenziile-mele/in-asteptare",
      descriere: "Recenzii trimise, în curs de aprobare",
    },
    {
      titlu: "❌ Recenzii neaprobate",
      ruta: "/recenziile-mele/respinse",
      descriere: "Recenzii respinse de către bibliotecar",
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

export default DashboardRecenziileMele;
