import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import OverviewDashboard from "./pages/OverviewDashboard";
import Compare from "./pages/Compare";
import AdminDashboard from "./pages/AdminDashboard";
import CollegeDashboard from "./pages/CollegeDashboard";
import AllColleges from "./pages/AllColleges";
import NotFound from "./pages/NotFound";
import RealTimeMonitor from './pages/RealTimeMonitor';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/overview" element={<OverviewDashboard />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/colleges" element={<AllColleges />} />
              <Route path="/college/:collegeId" element={<CollegeDashboard />} />
              <Route path="/live-monitor" element={<RealTimeMonitor />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
