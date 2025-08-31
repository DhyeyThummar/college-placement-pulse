import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container mx-auto px-6">
        <Card className="max-w-lg mx-auto glass-effect border-white/10">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold gradient-text mb-2">404</h1>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
              >
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
