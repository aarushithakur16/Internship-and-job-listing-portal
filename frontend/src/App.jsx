import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import OpportunityList from "./pages/OpportunityList";
import OpportunityDetails from "./pages/OpportunityDetails";
import ApplyForm from "./pages/ApplyForm";
import Confirmation from "./pages/Confirmation";
import AdminDashboard from "./pages/AdminDashboard";
import AdminApplications from "./pages/AdminApplications";
function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<OpportunityList />} />
            <Route path="/opportunities/:id" element={<OpportunityDetails />} />
            <Route path="/apply/:id" element={<ApplyForm />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/applications" element={<AdminApplications />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
