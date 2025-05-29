import { useNavigate } from "react-router-dom";

function DashboardCarti() {
  const navigate = useNavigate();

  const actiuni = [
    { titlu: "➕ Adăugare", ruta: "/carti/adaugare", descriere: "Adaugă o carte nouă" },
    { titlu: "🔍 Căutare", ruta: "/carti/cautare", descriere: "Caută o carte după titlu sau autor" },
    { titlu: "✏️ Editare", ruta: "/carti/editare-exemplar", descriere: "Modifică codul, locația sau starea unui exemplar" },
    { titlu: "🧹 Ștergere", ruta: "/carti/stergere-exemplar", descriere: "Casează un exemplar din bibliotecă " },
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

export default DashboardCarti;
