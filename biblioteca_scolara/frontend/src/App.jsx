import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResetareParola from "./pages/ResetareParola";
import SetareParola from "./pages/SetareParola";
import DashboardElev from "./pages/DashboardElev";
import DashboardBibliotecar from "./pages/DashboardBibliotecar";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/resetare-parola" element={<ResetareParola />} />
      <Route path="/resetare-parola/:token" element={<SetareParola />} />
      <Route path="/dashboard-elev" element={<DashboardElev />} />
      <Route path="/dashboard-bibliotecar" element={<DashboardBibliotecar />} />
    </Routes>
  );
}

export default App;
