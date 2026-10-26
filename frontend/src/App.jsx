import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { AdminRoute } from "./components/ProtectedRoute";
import OpportunityList from "./pages/OpportunityList";
import OpportunityDetails from "./pages/OpportunityDetails";
import ApplyForm from "./pages/ApplyForm";
import Confirmation from "./pages/Confirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplications from "./pages/AdminApplications";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<OpportunityList />} />
              <Route path="/opportunities/:id" element={<OpportunityDetails />} />
              <Route path="/apply/:id" element={<ApplyForm />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <AdminRoute>
                    <AdminApplications />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
