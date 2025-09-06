import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter
} from "recharts";
import { 
  TrendingUp, Users, GraduationCap, Building2, Award, Download, 
  Briefcase, DollarSign, Target, BarChart3, Calendar, MapPin, Loader2
} from "lucide-react";
import { 
  getPlacementStats, getBranchWiseData, getCollegeWiseData 
} from "@/services/database";

const OverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [collegeType, setCollegeType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOffers: 0,
    placementRate: 0,
    avgPackage: 0,
    totalCompanies: 0
  });
  const [branchData, setBranchData] = useState<any[]>([]);
  const [collegeData, setCollegeData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [placementStats, branchStats, colleges] = await Promise.all([
          getPlacementStats(),
          getBranchWiseData(),
          getCollegeWiseData()
        ]);

        setStats(placementStats);
        setBranchData(branchStats);
        setCollegeData(colleges);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCollegeData = useMemo(() => {
    let data = [...collegeData];
    
    if (collegeType !== "all") {
      data = data.filter(college => 
        college.type.toLowerCase() === collegeType.toLowerCase()
      );
    }
    
    return data.sort((a, b) => b.placementRate - a.placementRate);
  }, [collegeData, collegeType]);

  const typeWiseData = useMemo(() => {
    const typeStats: Record<string, any> = {};
    
    collegeData.forEach(college => {
      if (!typeStats[college.type]) {
        typeStats[college.type] = {
          type: college.type,
          colleges: 0,
          totalStudents: 0,
          placedStudents: 0,
          avgPackage: 0,
          packageSum: 0
        };
      }
      
      typeStats[college.type].colleges += 1;
      typeStats[college.type].totalStudents += college.totalStudents;
      typeStats[college.type].placedStudents += college.placedStudents;
      typeStats[college.type].packageSum += college.avgPackage * college.placedStudents;
    });
    
    return Object.values(typeStats).map((stat: any) => ({
      ...stat,
      placementRate: stat.totalStudents > 0 ? (stat.placedStudents / stat.totalStudents) * 100 : 0,
      avgPackage: stat.placedStudents > 0 ? stat.packageSum / stat.placedStudents : 0
    }));
  }, [collegeData]);

  const chartColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Overview Dashboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive placement insights across all colleges with interactive visualizations and trends.
          </p>
        </motion.div>

        {/* Filters */}
        <Card className="glass-effect border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Dashboard Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="glass-effect border-white/20 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2023-24</SelectItem>
                    <SelectItem value="2023">2022-23</SelectItem>
                    <SelectItem value="2022">2021-22</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>College Type</Label>
                <Select value={collegeType} onValueChange={setCollegeType}>
                  <SelectTrigger className="glass-effect border-white/20 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Statistics */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="glass-effect border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Offers</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.totalOffers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Placement Rate</p>
                  <p className="text-3xl font-bold text-green-400">{stats.placementRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Package</p>
                  <p className="text-3xl font-bold text-yellow-400">₹{(stats.avgPackage / 100000).toFixed(1)}L</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Companies</p>
                  <p className="text-3xl font-bold text-purple-400">{stats.totalCompanies}</p>
                </div>
                <Building2 className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Branch-wise Placement Chart */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Branch-wise Placement
                </CardTitle>
                <CardDescription>
                  Placement statistics across different engineering branches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={branchData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="branch" 
                      stroke="#888"
                      fontSize={12}
                      tickFormatter={(value) => value.split(' ')[0]}
                    />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'placementRate') {
                          return [`${value.toFixed(1)}%`, 'Placement Rate'];
                        }
                        return [value, name];
                      }}
                    />
                    <Bar 
                      dataKey="placementRate" 
                      fill="url(#branchGradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="branchGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* College Type Distribution */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-effect border-white/10 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  College Type Analysis
                </CardTitle>
                <CardDescription>
                  Placement distribution by college type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeWiseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="placedStudents"
                    >
                      {typeWiseData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={chartColors[index % chartColors.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {typeWiseData.map((entry, index) => (
                    <div key={entry.type} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: chartColors[index % chartColors.length] }}
                      />
                      <span className="text-sm text-muted-foreground">{entry.type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Performing Colleges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Top Performing Colleges
              </CardTitle>
              <CardDescription>
                Colleges with highest placement rates {collegeType !== 'all' && `(${collegeType} only)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCollegeData.slice(0, 6).map((college, index) => (
                  <Card key={college.id} className="glass-effect border-white/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm line-clamp-2">{college.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {college.location}
                          </p>
                        </div>
                        <Badge className="ml-2 text-xs">
                          #{index + 1}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Placement Rate:</span>
                          <span className="font-medium text-green-400">
                            {college.placementRate.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Package:</span>
                          <span className="font-medium">
                            ₹{(college.avgPackage / 100000).toFixed(1)}L
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Students:</span>
                          <span className="font-medium">{college.totalStudents}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Import Trophy icon
import { Trophy } from "lucide-react";

export default OverviewDashboard;