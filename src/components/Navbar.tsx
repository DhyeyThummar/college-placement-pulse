import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { toast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Home, 
  GitCompare, 
  LogOut, 
  LogIn,
  GraduationCap,
  Menu,
  Activity,
  Building2,
  User,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, signOut, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast({
      title: 'Logged out successfully',
      description: 'See you soon!',
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/overview', icon: BarChart3, label: 'Overview' },
    { to: '/colleges', icon: Building2, label: 'All Colleges' },
    { to: '/compare', icon: GitCompare, label: 'Compare' },
    { to: '/live-monitor', icon: Activity, label: 'Live Monitor' },
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
              <Link to="/auth">
                <Button variant="outline" className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-effect border-white/10">
                  <DropdownMenuLabel>
                    {user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={userRole === 'admin' ? '/admin' : '/dashboard'} className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                          navigate('/auth');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-gradient-primary hover:opacity-90"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          onClick={() => {
                            navigate(userRole === 'admin' ? '/admin' : '/dashboard');
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full glass-effect border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
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

const NavLink = ({ to, icon: Icon, label, isActive }: any) => (
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

const MobileNavLink = ({ to, icon: Icon, label, isActive, onClick }: any) => (
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