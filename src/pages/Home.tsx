import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  GitCompare, 
  Download, 
  Settings,
  BarChart3,
  Users,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { getPlacementStats } from '../data/placementData';

const Home = () => {
  const navigate = useNavigate();
  const stats = getPlacementStats();

  const features = [
    {
      icon: TrendingUp,
      title: 'Placement Trends',
      description: 'Analyze placement data across years, branches, and colleges with interactive charts.',
      action: () => navigate('/trends'),
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: GitCompare,
      title: 'Compare Colleges',
      description: 'Side-by-side comparison of placement statistics between different institutions.',
      action: () => navigate('/compare'),
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: Download,
      title: 'Download Reports',
      description: 'Export comprehensive placement reports in CSV and PDF formats.',
      action: () => navigate('/trends'),
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: Settings,
      title: 'Admin Panel',
      description: 'Upload and manage placement data, configure system settings.',
      action: () => navigate('/login'),
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  const statCards = [
    {
      icon: Briefcase,
      label: 'Total Offers',
      value: stats.totalOffers.toLocaleString(),
      change: '+12%',
      color: 'text-green-400'
    },
    {
      icon: TrendingUp,
      label: 'Placement Rate',
      value: `${stats.placementRate}%`,
      change: '+5%',
      color: 'text-blue-400'
    },
    {
      icon: Users,
      label: 'Avg Package',
      value: stats.avgPackage,
      change: '+8%',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-gradient-glass rounded-full px-4 py-2 border border-white/10">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Data-Driven Placement Insights</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold gradient-text animate-fade-in">
                College Placement
                <br />
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Insights
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
                Explore placement trends, compare colleges, and gain insights into your career prospects
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0 px-8 py-3 text-lg"
              >
                <Users className="h-5 w-5 mr-2" />
                Login as User
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                size="lg"
                className="btn-hover glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10 px-8 py-3 text-lg"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin Access
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-20 h-20 bg-gradient-primary rounded-full opacity-20"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-glass">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="card-hover bg-gradient-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.change} from last year
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-primary rounded-xl">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze and understand placement trends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-hover bg-gradient-card border-white/10 cursor-pointer group"
                onClick={feature.action}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-glass">
        <div className="container mx-auto px-6">
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Explore Placement Data?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students and institutions using our platform for placement insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/trends')}
                size="lg"
                className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0 px-8"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                View Trends
              </Button>
              <Button
                onClick={() => navigate('/compare')}
                variant="outline"
                size="lg"
                className="btn-hover glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10 px-8"
              >
                <GitCompare className="h-5 w-5 mr-2" />
                Compare Colleges
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;