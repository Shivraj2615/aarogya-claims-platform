import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import NotFound from "./pages/error/NotFound";
import Unauthorized from "./pages/error/Unauthorized";

import PatientDashboard from "./pages/patient/PatientDashboard";
import SubmitClaim from "./pages/patient/SubmitClaim";
import PatientClaimDetails from "./pages/patient/PatientClaimDetails";

import InsurerDashboard from "./pages/insurer/InsurerDashboard";
import ClaimReview from "./pages/insurer/ClaimReview";

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
