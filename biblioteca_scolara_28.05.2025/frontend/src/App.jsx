import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResetareParola from "./pages/ResetareParola";
import SetareParola from "./pages/SetareParola";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardElev from "./pages/DashboardElev";
import LayoutElev from "./components/LayoutElev";
import DashboardBibliotecar from "./pages/DashboardBibliotecar";
import LayoutBibliotecar from "./components/LayoutBibliotecar";
import DashboardCarti from "./pages/DashboardCarti";
import AdaugareCarte from "./pages/AdaugareCarte";
import CautareCarte from "./pages/CautareCarte";
import EditareExemplar from "./pages/EditareExemplar";
import StergereExemplar from "./pages/StergereExemplar";
import DashboardImprumuturi from "./pages/DashboardImprumuturi";
import ImprumuturiActive from "./pages/ImprumuturiActive";
import AdaugareImprumut from "./pages/AdaugareImprumut";
import DashboardRecenzii from "./pages/DashboardRecenzii";
import RecenziiAprobate from "./pages/RecenziiAprobate";
import RecenziiDeAprobat from "./pages/RecenziiDeAprobat";
import RecenziiNeaprobate from "./pages/RecenziiNeaprobate";
import DashboardGestionareElevi from "./pages/DashboardGestionareElevi";
import AdaugareElev from "./pages/AdaugareElev";
import CautareElev from "./pages/CautareElev";
import EditareElev from "./pages/EditareElev";
import StergereElev from "./pages/StergereElev";
import LogBibliotecar from "./pages/LogBibliotecar";

import Footer from "./components/Footer";

function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Conținutul principal */}
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetare-parola" element={<ResetareParola />} />
          <Route path="/resetare-parola/:token" element={<SetareParola />} />
          <Route path="/dashboard-elev" element={<ProtectedRoute element={<LayoutElev><DashboardElev /></LayoutElev>}allowedType="elev"/>}/>
          <Route path="/dashboard-bibliotecar" element={<ProtectedRoute element={<LayoutBibliotecar><DashboardBibliotecar /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/carti" element={<ProtectedRoute element={<LayoutBibliotecar><DashboardCarti /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/carti/cautare" element={<ProtectedRoute element={<LayoutBibliotecar><CautareCarte /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/carti/adaugare" element={<ProtectedRoute element={<LayoutBibliotecar><AdaugareCarte /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/carti/editare-exemplar" element={<ProtectedRoute element={<LayoutBibliotecar><EditareExemplar /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/carti/stergere-exemplar" element={<ProtectedRoute element={<LayoutBibliotecar><StergereExemplar /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/imprumuturi" element={<ProtectedRoute element={<LayoutBibliotecar><DashboardImprumuturi /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/imprumuturi/active" element={<ProtectedRoute element={<LayoutBibliotecar><ImprumuturiActive /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/imprumuturi/adaugare" element={<ProtectedRoute element={<LayoutBibliotecar><AdaugareImprumut /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/recenzii" element={<ProtectedRoute element={<LayoutBibliotecar><DashboardRecenzii /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/recenzii/aprobate" element={<ProtectedRoute element={<LayoutBibliotecar><RecenziiAprobate /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/recenzii/deaprobat" element={<ProtectedRoute element={<LayoutBibliotecar><RecenziiDeAprobat /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/recenzii/neaprobate" element={<ProtectedRoute element={<LayoutBibliotecar><RecenziiNeaprobate /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/gestionare_elevi/dashboard" element={<ProtectedRoute element={<LayoutBibliotecar><DashboardGestionareElevi /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/gestionare_elevi/adaugare" element={<ProtectedRoute element={<LayoutBibliotecar><AdaugareElev /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/gestionare_elevi/cautare" element={<ProtectedRoute element={<LayoutBibliotecar><CautareElev /></LayoutBibliotecar>} allowedType="bibliotecar" />} />  
          <Route path="/gestionare_elevi/editare" element={<ProtectedRoute element={<LayoutBibliotecar><EditareElev /></LayoutBibliotecar>} allowedType="bibliotecar" />} />
          <Route path="/gestionare_elevi/stergere" element={<ProtectedRoute element={<LayoutBibliotecar><StergereElev /></LayoutBibliotecar>} allowedType="bibliotecar" />} />

          <Route path="/loguri" element={<ProtectedRoute element={<LayoutBibliotecar><LogBibliotecar /></LayoutBibliotecar>}allowedType="bibliotecar"/> } />
        </Routes>
      </div>
      {/* Footer fix pe toate paginile */}
      <Footer />
    </div>
  );
}

export default App;