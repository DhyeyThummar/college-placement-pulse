import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Home, 
  TrendingUp, 
  GitCompare, 
  LogOut, 
  Settings,
  GraduationCap
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">
              College Placement Insights
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={Home} label="Home" isActive={isActive('/')} />
            <NavLink to="/colleges" icon={GraduationCap} label="Colleges" isActive={isActive('/colleges')} />
            <NavLink to="/trends" icon={TrendingUp} label="Trends" isActive={isActive('/trends')} />
            <NavLink to="/compare" icon={GitCompare} label="Compare" isActive={isActive('/compare')} />
            
            {!isAuthenticated ? (
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="ml-4 glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/dashboard')}
                  variant="outline"
                  className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="glass-effect border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            {/* Add mobile menu logic here if needed */}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'hover:bg-white/5 text-foreground/80 hover:text-foreground'
    }`}
  >
    <Icon className="h-4 w-4" />
    <span className="font-medium">{label}</span>
  </Link>
);

export default Navbar;