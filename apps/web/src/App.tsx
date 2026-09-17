import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserRole } from './types';

const RequireRole: React.FC<{ allowedRoles: UserRole[]; children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect user to their own role dashboard if trying to access unauthorized role route
    if (user.role === 'recruiter') return <Navigate to="/recruiter" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/candidate" replace />;
  }

  return <>{children}</>;
};

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'recruiter') return <Navigate to="/recruiter" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/candidate" replace />;
  }
  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <LoginPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRedirect>
                <RegisterPage />
              </AuthRedirect>
            }
          />
          <Route
            path="/candidate"
            element={
              <RequireRole allowedRoles={['candidate']}>
                <CandidateDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/recruiter"
            element={
              <RequireRole allowedRoles={['recruiter']}>
                <RecruiterDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole allowedRoles={['admin']}>
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-white/[0.06] bg-obsidian-950 py-6 text-center text-xs text-slate-500">
        <p>© 2026 ResumeIQ • Hybrid ATS Architecture & Factual Optimization Engine.</p>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
