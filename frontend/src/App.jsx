import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MedicalStaff from "./pages/MedicalStaff";
import Patient from "./pages/Patient";
import NotFound from "./pages/NotFound";
import MedicalStaffRegistrationForm from "./pages/MedicalStaffRegistrationForm";
import PatientRegistrationForm from "./pages/PatientRegistrationForm";
import UpdateMedicalStaffForm from "./pages/UpdateMedicalStaffForm";
import UpdatePatientForm from "./pages/UpdatePatientForm";
import ViewPatientImages from "./pages/ViewPatientImages";
import ViewReports from "./pages/ViewReports";
import AddReport from "./pages/AddReport";
import ViewInvoicesAndPayments from "./pages/ViewInvoicesAndPayments";
import CreateInvoice from "./pages/CreateInvoice";

function App() {
  const { user } = useAuth();
  
  const dashboard = () => {
    const { role } = user;
    switch (role) {
      case 'administrator':
        return <Admin />;
      case 'medicalStaff':
        return <MedicalStaff />;
      default:
        return <Patient />
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={user ? dashboard() : <Navigate to={"/login"} />} 
        />
        <Route 
          path="/login" 
          element={user ? dashboard() : <Login />}
        />
        <Route 
          path="*" 
          element={<NotFound />} 
        />
        <Route 
          path="/add-medical-staff" 
          element={user ? <MedicalStaffRegistrationForm /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/update-medical-staff/:id"
          element={<UpdateMedicalStaffForm />}
        />
        <Route
          path="/update-patient/:id"
          element={<UpdatePatientForm />}
        />
        <Route 
          path="/add-patient" 
          element={user ? <PatientRegistrationForm /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/patients/:patientId/images"
          element={<ViewPatientImages />}
        />
        <Route
          path="/patients/:patientId/reports"
          element={<ViewReports />}
        />
        <Route
          path="/patients/:patientId/add-report"
          element={<AddReport />}
        />
        <Route
          path="/invoices/:patientId"
          element={<ViewInvoicesAndPayments />}
        />
        <Route
          path="/invoices/:patientId/create"
          element={<CreateInvoice />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
