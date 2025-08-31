import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Download,
  GitCompare,
  Building,
  GraduationCap,
  DollarSign
} from 'lucide-react';
import { getBranchWiseData, getCollegeWiseData, getTrendData, getPlacementStats } from '../data/placementData';

const UserDashboard = () => {
  const navigate = useNavigate();
  const branchData = getBranchWiseData().slice(0, 6);
  const collegeData = getCollegeWiseData().slice(0, 6);
  const trendData = getTrendData();
  const stats = getPlacementStats();

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  const statCards = [
    {
      title: 'Total Placements',
      value: stats.totalOffers.toLocaleString(),
      change: '+12%',
      icon: Briefcase,
      color: 'text-blue-400'
    },
    {
      title: 'Placement Rate',
      value: `${stats.placementRate}%`,
      change: '+5%',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Average Package',
      value: stats.avgPackage,
      change: '+8%',
      icon: DollarSign,
      color: 'text-purple-400'
    },
    {
      title: 'Participating Companies',
      value: stats.totalCompanies.toString(),
      change: '+15%',
      icon: Building,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">User Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive placement insights and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="card-hover bg-gradient-card border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className={`text-sm ${stat.color} flex items-center mt-1`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Branch-wise Placements */}
          <Card className="card-hover bg-gradient-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span>Branch-wise Placements</span>
              </CardTitle>
              <CardDescription>Placement rates across different branches</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="branch" 
                    stroke="#9ca3af"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  />
                  <Bar dataKey="placementRate" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* College-wise Placements */}
          <Card className="card-hover bg-gradient-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-primary" />
                <span>College-wise Placements</span>
              </CardTitle>
              <CardDescription>Placement distribution across institutions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={collegeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="placementRate"
                  >
                    {collegeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Placement Trends */}
        <Card className="card-hover bg-gradient-card border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Placement Trends Over Years</span>
            </CardTitle>
            <CardDescription>Historical placement data and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="placementRate" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgPackage" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Compare Colleges</h3>
                  <p className="text-muted-foreground mb-4">
                    Get detailed side-by-side comparison of placement statistics
                  </p>
                  <Button 
                    onClick={() => navigate('/compare')}
                    className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
                  >
                    <GitCompare className="h-4 w-4 mr-2" />
                    Start Comparison
                  </Button>
                </div>
                <GitCompare className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Download Reports</h3>
                  <p className="text-muted-foreground mb-4">
                    Export comprehensive placement data in various formats
                  </p>
                  <Button 
                    onClick={() => navigate('/trends')}
                    variant="outline"
                    className="btn-hover glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Data
                  </Button>
                </div>
                <Download className="h-12 w-12 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;