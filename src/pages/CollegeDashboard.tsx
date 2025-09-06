import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, Users, GraduationCap, Building2, Award, Download, 
  MapPin, Calendar, Star, Briefcase, DollarSign, ArrowLeft, Loader2
} from "lucide-react";
import { getCollegeById, type CollegeWithPlacement } from "@/services/database";

const CollegeDashboard = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [college, setCollege] = useState<CollegeWithPlacement | null>(null);
  const [selectedYear] = useState("2024");

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!collegeId) return;
      
      setLoading(true);
      try {
        const collegeData = await getCollegeById(collegeId);
        setCollege(collegeData);
      } catch (error) {
        console.error('Error fetching college data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeId]);

  const placementData = useMemo(() => {
    if (!college?.placement_data || college.placement_data.length === 0) {
      return null;
    }
    
    return college.placement_data[0]?.data;
  }, [college]);

  const branchWiseData = useMemo(() => {
    if (!placementData) return [];
    
    return placementData.branch_data.map(branch => ({
      ...branch,
      placementRate: branch.total_students > 0 ? (branch.placed_students / branch.total_students) * 100 : 0
    }));
  }, [placementData]);

  const packageDistribution = useMemo(() => {
    if (!placementData) return [];
    
    return placementData.branch_data.map(branch => ({
      branch: branch.branch.split(' ')[0], // Shorten branch names
      avg: branch.average_package / 100000, // Convert to lakhs
      highest: branch.highest_package / 100000,
      median: (branch.median_package || branch.average_package) / 100000
    }));
  }, [placementData]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading college dashboard...</p>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">College Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested college dashboard could not be found.
          </p>
          <Button onClick={() => navigate("/colleges")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
        </Card>
      </div>
    );
  }

  const stats = placementData?.overall_stats;
  const chartColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <Button 
            onClick={() => navigate("/colleges")}
            variant="outline"
            className="mb-4 glass-effect border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {college.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {college.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Academic Year {selectedYear}
                </span>
                {college.code && (
                  <Badge variant="outline">{college.code}</Badge>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {!placementData ? (
          <Card className="p-8 text-center">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Placement Data Available</h3>
            <p className="text-muted-foreground">
              Placement data for this college is not currently available.
            </p>
          </Card>
        ) : (
          <>
            {/* Key Statistics */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              <Card className="glass-effect border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-blue-400">{stats?.total_students}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Placed Students</p>
                      <p className="text-3xl font-bold text-green-400">{stats?.total_placed}</p>
                      <p className="text-sm text-green-300">{stats?.placement_percentage.toFixed(1)}% rate</p>
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
                      <p className="text-3xl font-bold text-yellow-400">
                        ₹{stats ? (stats.average_package / 100000).toFixed(1) : 0}L
                      </p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Highest Package</p>
                      <p className="text-3xl font-bold text-purple-400">
                        ₹{stats ? (stats.highest_package / 100000).toFixed(1) : 0}L
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-400" />
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
                transition={{ delay: 0.2 }}
              >
                <Card className="glass-effect border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Branch-wise Placement Rate
                    </CardTitle>
                    <CardDescription>
                      Placement success rate across different branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={branchWiseData}>
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
                          formatter={(value: any) => [`${value.toFixed(1)}%`, 'Placement Rate']}
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

              {/* Package Distribution Chart */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-effect border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Package Distribution
                    </CardTitle>
                    <CardDescription>
                      Average, median, and highest packages by branch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={packageDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="branch" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: 'white'
                          }}
                          formatter={(value: any, name: string) => [
                            `₹${value.toFixed(1)}L`, 
                            name === 'avg' ? 'Average' : name === 'highest' ? 'Highest' : 'Median'
                          ]}
                        />
                        <Bar dataKey="avg" stackId="a" fill="#8B5CF6" />
                        <Bar dataKey="highest" stackId="b" fill="#06B6D4" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Branch Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Branch-wise Details
                  </CardTitle>
                  <CardDescription>
                    Comprehensive breakdown of placement statistics by branch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {branchWiseData.map((branch, index) => (
                      <Card key={branch.branch} className="glass-effect border-white/5">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-sm">{branch.branch}</h4>
                            <Badge 
                              style={{ 
                                backgroundColor: `${chartColors[index % chartColors.length]}20`,
                                color: chartColors[index % chartColors.length],
                                border: `1px solid ${chartColors[index % chartColors.length]}30`
                              }}
                            >
                              {branch.placementRate.toFixed(1)}%
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Students:</span>
                              <span>{branch.placed_students}/{branch.total_students}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Package:</span>
                              <span>₹{(branch.average_package / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Highest:</span>
                              <span>₹{(branch.highest_package / 100000).toFixed(1)}L</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Companies:</span>
                              <span>{branch.companies.length}</span>
                            </div>
                          </div>

                          <Separator className="my-3" />
                          
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Top Recruiters:</p>
                            <div className="flex flex-wrap gap-1">
                              {branch.companies.slice(0, 3).map((company) => (
                                <Badge key={company} variant="outline" className="text-xs">
                                  {company}
                                </Badge>
                              ))}
                              {branch.companies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{branch.companies.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default CollegeDashboard;