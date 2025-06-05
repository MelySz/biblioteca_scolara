import React from "react";

const PictogramaLectura = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 64 64">
    <circle cx="32" cy="16" r="6" fill="#F4C542" />
    <rect x="24" y="24" width="16" height="6" fill="#A0D8F1" />
    <rect x="20" y="30" width="4" height="18" fill="#5C4033" />
    <rect x="40" y="30" width="4" height="18" fill="#5C4033" />
    <rect x="22" y="36" width="8" height="12" fill="#4B9CD3" />
    <rect x="34" y="36" width="8" height="12" fill="#4B9CD3" />
    <rect x="14" y="30" width="36" height="4" fill="#8B5E3C" />
  </svg>
);

const PictogramaBirou = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 64 64">
    <rect x="10" y="40" width="44" height="6" fill="#8B5E3C" />
    <rect x="14" y="20" width="10" height="20" fill="#C0C0C0" />
    <circle cx="32" cy="12" r="6" fill="#4B9CD3" />
    <rect x="28" y="18" width="8" height="14" fill="#4B9CD3" />
    <rect x="40" y="22" width="8" height="12" fill="#A0D8F1" />
  </svg>
);

const PictogramaIntrare = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 64 64"
    fill="none"
  >
    <rect x="10" y="10" width="20" height="44" rx="2" fill="#8B5E3C" />
    <rect x="30" y="10" width="4" height="44" fill="#D9D9D9" />
    <circle cx="24" cy="32" r="2" fill="#F4C542" />
    <path
      d="M44 32c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4zm-4 6c-3.3 0-6 2.7-6 6v6h12v-6c0-3.3-2.7-6-6-6z"
      fill="#4B9CD3"
    />
  </svg>
);

const pozitiiPeNivel = 10;
const niveluri = 3;

function HartaBiblioteca({ exemplare }) {
  const exemplareMap = {};
  exemplare.forEach((ex) => {
    if (ex.locatie) exemplareMap[ex.locatie] = ex;
  });

  const getCuloare = (ex) => {
    if (!ex) return "bg-gray-300";
    if (ex.stare === "disponibil") return "bg-green-500";
    if (ex.stare === "imprumutat") return "bg-yellow-500";
    return "bg-red-500";
  };

  const RaftVertical = ({ id }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-[2px] rounded-full shadow-sm">Raft {id}</div>
      <div className="flex flex-col gap-[2px]">
        {[...Array(niveluri)].map((_, nivel) => {
          const start = nivel * pozitiiPeNivel + 1;
          return (
            <div key={nivel} className="flex gap-[2px]">
              {[...Array(pozitiiPeNivel)].map((_, i) => {
                const poz = start + i;
                const locatie = `${id}-${poz}`;
                const ex = exemplareMap[locatie];
                return (
                  <div
                    key={poz}
                    className={`w-5 h-5 text-[7px] text-white rounded-sm flex items-center justify-center transition-transform duration-200 hover:scale-125 hover:shadow-md ${getCuloare(ex)}`}
                    title={
                      ex
                        ? `Cod: ${ex.cod_unic} (${ex.stare})\nLocație: ${locatie}`
                        : `Neselectat – ${locatie}`
                    }
                  >
                    {poz}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  const RaftVerticalCompact = ({ id, pozitii, oglindit = false }) => (
    <div className="flex flex-col items-center gap-1">
      <div className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-[2px] rounded-full shadow-sm">Raft {id}</div>
      <div className="grid grid-cols-3 gap-[2px] p-1 rounded">
        {pozitii.flat().map((poz) => {
          const locatie = `${id}-${poz}`;
          const ex = exemplareMap[locatie];
          return (
            <div
              key={poz}
              className={`w-5 h-5 text-[7px] text-white rounded-sm flex items-center justify-center transition-transform duration-200 hover:scale-125 hover:shadow-md ${getCuloare(ex)}`}
              style={{
                writingMode: "vertical-rl",
                transform: oglindit ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s ease"
            }}
              title={
                ex
                    ? `Cod: ${ex.cod_unic} (${ex.stare})\nLocație: ${locatie}`
                    : `Neselectat – ${locatie}`
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                    (oglindit ? "rotate(0deg) " : "rotate(180deg) ") + "scale(1.25)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
            }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = oglindit ? "rotate(0deg)" : "rotate(180deg)";
                e.currentTarget.style.boxShadow = "none";
            }}
            >
              {poz}
            </div>
          );
        })}
      </div>
    </div>
  );

  const pozitiiI = Array.from({ length: 10 }, (_, i) => [10 - i, 20 - i, 30 - i]);
  const pozitiiJ = Array.from({ length: 10 }, (_, i) => [21 + i, 11 + i, 1 + i]);

  return (
    <div className="mt-6 w-full px-4">
      <h2 className="text-lg font-bold text-blue-600 mb-8 text-center">
        🗺️ Hartă rafturi bibliotecă
      </h2>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {["A", "B", "C"].map((id) => (
          <RaftVertical key={id} id={id} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="hidden sm:flex flex-row gap-12 pr-8">
          <PictogramaLectura/>
          <PictogramaLectura/>
        </div>
        <RaftVertical id="D" />
        <div className="hidden sm:flex flex-row gap-12 pl-8">
          <PictogramaLectura/>
          <PictogramaLectura/>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {["E", "F", "G"].map((id) => (
          <RaftVertical key={id} id={id} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mb-4">
        <div className="hidden sm:flex flex-row gap-12 pr-8">
          <PictogramaLectura/>
          <PictogramaLectura/>
        </div>
        <RaftVertical id="H" />
        <div className="hidden sm:flex flex-row gap-12 pl-8">
          <PictogramaLectura/>
          <PictogramaLectura/>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 items-center mt-8">
        <div className="flex justify-center">
          <RaftVerticalCompact id="I" pozitii={pozitiiI} />
        </div>

        <div />
        <div className="hidden sm:grid grid-cols-3 gap-x-16 gap-y-12 justify-center items-center">
          {[...Array(9)].map((_, i) => (
            <div key={i}>
              <PictogramaLectura />
            </div>
          ))}
        </div>
        <div />

        <div className="flex justify-center">
          <RaftVerticalCompact id="J" pozitii={pozitiiJ} oglindit />
        </div>
      </div>

      {/* rând cu intrare/ieșie și cu biroul*/}
    <div className="mt-10 flex justify-between text-sm text-blue-600 px-4">
        <div className="hidden sm:flex items-center gap-2 text-blue-600 mt-8 ml-4">
            <PictogramaIntrare /><span className="text-lg"></span> Intrare / Ieșire 
        </div>

        <div className="hidden sm:flex justify-center">
            <PictogramaBirou/> 
        </div>

        <div className="w-10" /> {/* spațiu gol pentru echilibru la dreapta */}
    </div>

      <div className="mt-8 flex justify-center gap-4 text-xs text-gray-700 font-medium flex-wrap">
        {[
          ["bg-green-500", "Disponibil"],
          ["bg-yellow-500", "Împrumutat"],
          ["bg-red-500", "Deteriorat"],
          ["bg-gray-300", "Neselectat"],
        ].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1">
            <div className={`w-4 h-4 rounded-sm ${color}`}></div> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HartaBiblioteca;
