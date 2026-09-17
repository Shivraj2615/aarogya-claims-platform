import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import PatientDashboard from "./pages/PatientDashboard";
import SubmitClaim from "./pages/SubmitClaim";
import PatientClaimDetails from "./pages/PatientClaimDetails";

import InsurerDashboard from "./pages/InsurerDashboard";
import ClaimReview from "./pages/ClaimReview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Patient Routes */}

        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout>
                <PatientDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/claims/new"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout>
                <SubmitClaim />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient/claims/:id"
          element={
            <ProtectedRoute allowedRole="patient">
              <AppLayout>
                <PatientClaimDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Insurer Routes */}

        <Route
          path="/insurer"
          element={
            <ProtectedRoute allowedRole="insurer">
              <AppLayout>
                <InsurerDashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/insurer/claims/:id"
          element={
            <ProtectedRoute allowedRole="insurer">
              <AppLayout>
                <ClaimReview />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
