import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  BarChart3, 
  Home, 
  TrendingUp, 
  GitCompare, 
  LogOut, 
  Settings,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/overview', icon: BarChart3, label: 'Overview' },
    { to: '/colleges', icon: GraduationCap, label: 'Colleges' },
    { to: '/trends', icon: TrendingUp, label: 'Trends' },
    { to: '/compare', icon: GitCompare, label: 'Compare' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-gradient-primary">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold gradient-text">
              College Placement Insights
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink 
                key={item.to}
                to={item.to} 
                icon={item.icon} 
                label={item.label} 
                isActive={isActive(item.to)} 
              />
            ))}
            
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

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="glass-effect border-white/20">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-xl border-white/10">
                <SheetHeader>
                  <SheetTitle className="text-left gradient-text">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <MobileNavLink 
                      key={item.to}
                      to={item.to} 
                      icon={item.icon} 
                      label={item.label} 
                      isActive={isActive(item.to)}
                      onClick={() => setIsMobileMenuOpen(false)}
                    />
                  ))}
                  
                  <div className="border-t border-white/10 pt-4 mt-6">
                    {!isAuthenticated ? (
                      <Button
                        onClick={() => {
                          navigate('/login');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-primary hover:opacity-90"
                      >
                        Login
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={() => {
                            navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button
                          onClick={handleLogout}
                          variant="outline"
                          className="w-full glass-effect border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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

const MobileNavLink = ({ to, icon: Icon, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-primary/20 text-primary border border-primary/30'
        : 'hover:bg-white/5 text-foreground/80 hover:text-foreground'
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium text-base">{label}</span>
  </Link>
);

export default Navbar;