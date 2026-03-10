import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CastingProvider } from "@/contexts/CastingContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Castings from "./pages/Castings";
import CastingDetail from "./pages/CastingDetail";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import ProducerDashboard from "./pages/ProducerDashboard";
import CreateCasting from "./pages/CreateCasting";
import MyApplications from "./pages/MyApplications";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import TalentSearch from "./pages/TalentSearch";
import Billing from "./pages/Billing";
import Subscription from "./pages/Subscription";
import ApplicationManagement from "./pages/ApplicationManagement";
import TalentOnboarding from "./pages/TalentOnboarding";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

// Handles redirecting verified-but-not-onboarded users to onboarding
const AuthRedirectHandler = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, onboardingComplete, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    // If user is authenticated but hasn't completed onboarding, redirect to onboarding
    // Skip if already on onboarding page or signup page
    if (
      isAuthenticated &&
      !onboardingComplete &&
      user?.role === 'talent' &&
      location.pathname !== '/onboarding' &&
      location.pathname !== '/signup'
    ) {
      navigate('/onboarding', { replace: true });
    }
  }, [isAuthenticated, isLoading, onboardingComplete, user, location.pathname, navigate]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CastingProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthRedirectHandler>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/castings" element={<Castings />} />
                <Route path="/castings/:id" element={<Castings />} />
                <Route path="/casting/:id" element={<CastingDetail />} />
                <Route path="/news" element={<News />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/producer-dashboard" element={<ProducerDashboard />} />
                <Route path="/create-casting" element={<CreateCasting />} />
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/talent-search" element={<TalentSearch />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/applications-management" element={<ApplicationManagement />} />
                <Route path="/onboarding" element={<TalentOnboarding />} />
                <Route path="/settings" element={<Settings />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthRedirectHandler>
          </BrowserRouter>
        </CastingProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
