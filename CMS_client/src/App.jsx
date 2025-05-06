import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./page/Dashboard";
import DoctorDashboard from "./page/DoctorDashboard";
import BookAppointment from "./page/BookAppointment";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
