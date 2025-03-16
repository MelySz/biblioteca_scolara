const backup = `
function Footer() {
    return (
      <footer className="w-full py-2 text-center text-xs text-white text-opacity-100 font-semibold absolute bottom-0">
        © Biblioteca Școlară Jamu Mare {new Date().getFullYear()} - Toate drepturile rezervate.
      </footer>
    );
}

export default Footer;
`;

import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  // Listează paginile unde textul trebuie să fie maro
  const paginiCuTextMaro = ["/login", "/resetare-parola", "/schimbare-parola"];

  // Verifică dacă ruta curentă se află în lista paginilor cu text maro
  const textColor = paginiCuTextMaro.includes(location.pathname) ? "text-brown-500" : "text-white";

  return (
    <footer className={`w-full py-2 text-center text-xs ${textColor} font-semibold absolute bottom-0`}>
      © Biblioteca Școlară Jamu Mare {new Date().getFullYear()} - Toate drepturile rezervate.
    </footer>
  );
}

export default Footer;
 
  
  