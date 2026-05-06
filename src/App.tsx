import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { LocationProvider } from './context/LocationContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import InputPage from './pages/InputPage';
import ReportPage from './pages/ReportPage';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Warga
import WargaHomePage from './pages/warga/WargaHomePage';
import WargaRankingPage from './pages/warga/WargaRankingPage';
import WargaProfilePage from './pages/warga/WargaProfilePage';

import { useAuth } from './context/AuthContext';

function RouterConfig() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Shared App Layout */}
      <Route element={<AppLayout />}>
        {/* Dynamic Home Route */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute feature="dashboard">
              {user?.role === 'warga' ? <WargaHomePage /> : <HomePage />}
            </ProtectedRoute>
          } 
        />
        
        {/* Shared Map Route */}
        <Route 
          path="/map" 
          element={
            <ProtectedRoute feature="map">
              <MapPage />
            </ProtectedRoute>
          } 
        />

        {/* Petugas Only Routes */}
        <Route
          path="/input"
          element={
            <ProtectedRoute feature="input">
              <InputPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute feature="report">
              <ReportPage />
            </ProtectedRoute>
          }
        />

        {/* Warga Only Routes */}
        <Route
          path="/rangking"
          element={
            <ProtectedRoute feature="rangking">
              <WargaRankingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute feature="profile">
              <WargaProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <ToastProvider>
            <RouterConfig />
          </ToastProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
