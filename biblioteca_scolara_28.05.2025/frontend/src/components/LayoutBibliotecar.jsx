import MeniuBibliotecar from "./MeniuBibliotecar";

function LayoutBibliotecar({ children }) {
  const nume = localStorage.getItem("nume") || "";
  const prenume = localStorage.getItem("prenume") || "";

  return (
    <div className="relative flex h-screen w-full">
      {/* Fundal */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Fundal.jpg')" }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Conținut */}
      <div className="relative flex flex-col w-full h-full">
        {/* Antet */}
        <div className="w-full shadow-md py-4 px-8 flex justify-between items-center fixed top-0 left-0 z-10 bg-black bg-opacity-40 text-white h-16">
          <h1 className="text-xl font-bold">Biblioteca Școlară Jamu Mare</h1>
          <p className="text-md font-semibold">Bine ai venit, {prenume} {nume}!</p>
        </div>

        <div className="flex flex-grow w-full mt-16">
          <MeniuBibliotecar />
          <div className="flex-1 relative z-10 p-6 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutBibliotecar;
