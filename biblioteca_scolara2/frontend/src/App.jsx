import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResetareParola from "./pages/ResetareParola";
import SetareParola from "./pages/SetareParola";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardElev from "./pages/DashboardElev";
import DashboardBibliotecar from "./pages/DashboardBibliotecar";
import Footer from "./components/Footer";

{/*}
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/resetare-parola" element={<ResetareParola />} />
      <Route path="/resetare-parola/:token" element={<SetareParola />} />
      <Route path="/dashboard-elev" element={<ProtectedRoute element={<DashboardElev />} allowedType="elev" />} />
      <Route path="/dashboard-bibliotecar" element={<ProtectedRoute element={<DashboardBibliotecar />} allowedType="bibliotecar" />} />
    </Routes>
  );
}

export default App;
*/}
function App() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Conținutul principal */}
      <div className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetare-parola" element={<ResetareParola />} />
          <Route path="/resetare-parola/:token" element={<SetareParola />} />
          <Route path="/dashboard-elev" element={<ProtectedRoute element={<DashboardElev />} allowedType="elev" />} />
          <Route path="/dashboard-bibliotecar" element={<ProtectedRoute element={<DashboardBibliotecar />} allowedType="bibliotecar" />} />
        </Routes>
      </div>
      {/* Footer fix pe toate paginile */}
      <Footer />
    </div>
  );
}

export default App;