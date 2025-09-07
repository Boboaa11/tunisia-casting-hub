import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CastingProvider } from "@/contexts/CastingContext";
import Index from "./pages/Index";
import Castings from "./pages/Castings";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProducerDashboard from "./pages/ProducerDashboard";
import CreateCasting from "./pages/CreateCasting";
import MyApplications from "./pages/MyApplications";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import TalentSearch from "./pages/TalentSearch";
import Billing from "./pages/Billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CastingProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/castings" element={<Castings />} />
            <Route path="/news" element={<News />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/producer-dashboard" element={<ProducerDashboard />} />
            <Route path="/create-casting" element={<CreateCasting />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/talent-search" element={<TalentSearch />} />
            <Route path="/billing" element={<Billing />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CastingProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
