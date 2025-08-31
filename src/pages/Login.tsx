import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Shield, 
  Mail, 
  Lock, 
  LogIn,
  GraduationCap
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    const success = login(email, password, activeTab as 'user' | 'admin');
    
    if (success) {
      toast({
        title: 'Success',
        description: `Logged in as ${activeTab}`,
      });
      
      // Navigate based on role
      if (activeTab === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = (role: 'user' | 'admin') => {
    setActiveTab(role);
    setEmail(`demo@${role}.com`);
    setPassword('demo123');
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
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          <Card className="glass-effect border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-foreground">Sign In</CardTitle>
              <CardDescription className="text-center">
                Choose your account type and enter your credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="user" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>User</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
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
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
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
                        <span>Sign In as {activeTab === 'user' ? 'User' : 'Admin'}</span>
                      </div>
                    )}
                  </Button>
                </form>

                <TabsContent value="user" className="mt-6">
                  <div className="space-y-3">
                    <div className="text-center text-sm text-muted-foreground">
                      Demo User Account
                    </div>
                    <Button
                      onClick={() => handleDemoLogin('user')}
                      variant="outline"
                      className="w-full glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Use Demo User Account
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Access user dashboard with sample data
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="mt-6">
                  <div className="space-y-3">
                    <div className="text-center text-sm text-muted-foreground">
                      Demo Admin Account
                    </div>
                    <Button
                      onClick={() => handleDemoLogin('admin')}
                      variant="outline"
                      className="w-full glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Use Demo Admin Account
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Access admin panel with data management features
                    </p>
                  </div>
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

export default Login;