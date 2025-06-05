import { useEffect, useState } from "react";
import axios from "axios";

function RecenziiDeAprobat() {
  const [recenzii, setRecenzii] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecenzii = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/recenzii/?aprobat=false", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecenzii(res.data);
      } catch (err) {
        console.error("Eroare la recenzii neaprobate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecenzii();
  }, [token]);

  const aprobaRecenzie = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/recenzii/${id}/aprobare/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecenzii((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error("Eroare la aprobarea recenziei:", err);
    }
  };

  const respingeRecenzie = async (id) => {
  try {
    await axios.patch(`http://localhost:8000/api/recenzii/${id}/respingere/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecenzii((prev) => prev.filter((rec) => rec.id !== id));
  } catch (err) {
    console.error("Eroare la respingerea recenziei:", err);
  }
};

  // sortare: recenziile din ziua curentă primele
  const recenziiSortate = [...recenzii].sort((a, b) => {
    const azi = new Date().toLocaleDateString();
    const dataA = new Date(a.data_postare).toLocaleDateString();
    const dataB = new Date(b.data_postare).toLocaleDateString();

    if (dataA === azi && dataB !== azi) return -1;
    if (dataA !== azi && dataB === azi) return 1;
    return new Date(b.data_postare) - new Date(a.data_postare);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white">🕓 Recenzii de aprobat</h1>

      <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl max-h-[70vh] overflow-y-auto scroll-custom space-y-4">
        {loading ? (
          <p className="text-gray-600">Se încarcă...</p>
        ) : recenzii.length === 0 ? (
          <p className="text-gray-600">Nu sunt recenzii în așteptare.</p>
        ) : (
          recenziiSortate.map((recenzie) => (
            <div key={recenzie.id} className="border p-4 rounded bg-gray-50 shadow-sm space-y-2">
              <p className="text-lg font-semibold text-blue-800">
                {recenzie.carte_titlu} – <span className="italic text-gray-600 text-base">de {recenzie.autor_carte}</span>
              </p>
              <p className="text-sm italic text-gray-600">
                recenzie scrisă de {recenzie.utilizator_nume} {recenzie.utilizator_prenume} - clasa {recenzie.utilizator_clasa}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500 text-lg">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < Math.round(recenzie.rating / 2) ? "★" : "☆"}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({recenzie.rating}/10)</span>
              </div>
              <p className="text-sm text-gray-800">{recenzie.comentariu}</p>
              <p className="text-xs text-right text-gray-500">
                📅 {new Date(recenzie.data_postare).toLocaleDateString()}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => aprobaRecenzie(recenzie.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded shadow"
                >
                  ✅ Aprobă
                </button>
                <button
                  onClick={() => respingeRecenzie(recenzie.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow"
                >
                  ❌ Respinge
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RecenziiDeAprobat;
