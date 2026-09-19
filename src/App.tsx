import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import EventDetails from './pages/EventDetails';
import AuthPage from './pages/AuthPage';
import Onboarding from './pages/Onboarding';
import ProfilePage from './pages/ProfilePage';
import ClubPortal from './pages/ClubPortal';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';

export default function App() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
          <Navbar />
          <main className="flex-1 relative">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" replace />} />
              <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} />
              
              {/* Role-based routes */}
              <Route 
                path="/portal/*" 
                element={profile?.role === 'club_owner' || profile?.role === 'admin' ? <ClubPortal /> : <Navigate to="/" />} 
              />
              <Route 
                path="/admin/*" 
                element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} 
              />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
}
