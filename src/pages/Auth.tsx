import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { getColleges } from '@/services/database';
import { 
  User, 
  Shield, 
  Mail, 
  Lock, 
  LogIn,
  GraduationCap,
  UserPlus,
  Building
} from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  const [accountType, setAccountType] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);
  
  const { signIn, signUp, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userRole, navigate]);

  // Load colleges for admin signup
  useEffect(() => {
    const loadColleges = async () => {
      const collegesData = await getColleges();
      setColleges(collegesData);
    };
    loadColleges();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Signed in successfully',
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !fullName) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (accountType === 'admin' && !selectedCollege) {
      toast({
        title: 'Error',
        description: 'Please select a college for admin account',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const collegeName = accountType === 'admin' 
      ? colleges.find(c => c.id === selectedCollege)?.name 
      : undefined;

    const { error } = await signUp(email, password, fullName, collegeName);
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign up',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Check your email to confirm your account',
      });
      setActiveTab('signin');
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setEmail(`demo@${role}.com`);
    setPassword('demo123');
    setAccountType(role);
    
    const { error } = await signIn(`demo@${role}.com`, 'demo123');
    
    if (error) {
      toast({
        title: 'Demo Login Failed',
        description: 'Demo accounts may not be set up yet',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-muted-foreground">
              {activeTab === 'signin' 
                ? 'Sign in to access your dashboard' 
                : 'Join our placement tracking platform'
              }
            </p>
          </div>

          <Card className="glass-effect border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-foreground">
                {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
              </CardTitle>
              <CardDescription className="text-center">
                {activeTab === 'signin' 
                  ? 'Enter your credentials to access your account'
                  : 'Create your account to get started'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 glass-effect border-white/20 focus:border-primary/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 glass-effect border-white/20 focus:border-primary/50"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <LogIn className="h-4 w-4" />
                          <span>Sign In</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 space-y-3">
                    <div className="text-center text-sm text-muted-foreground">
                      Demo Accounts
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handleDemoLogin('user')}
                        variant="outline"
                        size="sm"
                        className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Demo User
                      </Button>
                      <Button
                        onClick={() => handleDemoLogin('admin')}
                        variant="outline"
                        size="sm"
                        className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Demo Admin
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Tabs value={accountType} onValueChange={setAccountType} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="user" className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>User</span>
                          </TabsTrigger>
                          <TabsTrigger value="admin" className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Admin</span>
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="glass-effect border-white/20 focus:border-primary/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 glass-effect border-white/20 focus:border-primary/50"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 glass-effect border-white/20 focus:border-primary/50"
                          required
                        />
                      </div>
                    </div>

                    {accountType === 'admin' && (
                      <div className="space-y-2">
                        <Label htmlFor="college-select">College</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                          <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                            <SelectTrigger className="pl-10 glass-effect border-white/20 focus:border-primary/50">
                              <SelectValue placeholder="Select your college" />
                            </SelectTrigger>
                            <SelectContent>
                              {colleges.map((college) => (
                                <SelectItem key={college.id} value={college.id}>
                                  {college.name} {college.location && `- ${college.location}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <UserPlus className="h-4 w-4" />
                          <span>Create Account</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;