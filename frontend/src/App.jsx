import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import MedicalStaff from "./pages/MedicalStaff";
import Patient from "./pages/Patient";
import NotFound from "./pages/NotFound";

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
          element={user ? dashboard() : <Login />} 
        />
        <Route 
          path="/login" 
          element={<Login />}
        />
        <Route 
          path="*" 
          element={<NotFound />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
