import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import AdminDashboard from "./page/AdminDashboard";
import DoctorDashboard from "./page/DoctorDashboard";
import PatientDashboard from "./page/PatientDashboard";
import ReceptionistPage from "./page/ReceptionistPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/receptionist-dashboard" element={<ReceptionistPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
