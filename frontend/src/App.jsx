import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiChatbot from './components/AiChatbot';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import AiMatch from './pages/AiMatch';
import PricePredictor from './pages/PricePredictor';
import Compare from './pages/Compare';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Real-Time Notification Toast Banner
const LiveNotificationToast = () => {
  const { activeAlert } = useNotifications();
  if (!activeAlert) return null;

  return (
    <div className="fixed top-20 right-6 z-50 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-top-4 flex items-start gap-3">
      <div className="w-3 h-3 rounded-full bg-emerald-400 mt-1 shrink-0 animate-ping"></div>
      <div className="text-xs space-y-1">
        <p className="font-bold text-amber-300">{activeAlert.title}</p>
        <p className="text-slate-300 leading-relaxed">{activeAlert.message}</p>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <LiveNotificationToast />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/ai-match" element={<AiMatch />} />
          <Route path="/price-predictor" element={<PricePredictor />} />
          <Route path="/compare" element={<Compare />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-property"
            element={
              <ProtectedRoute allowedRoles={['ROLE_LANDLORD', 'ROLE_ADMIN']}>
                <AddProperty />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AiChatbot />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
