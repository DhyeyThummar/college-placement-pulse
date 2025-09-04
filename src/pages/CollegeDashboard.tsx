import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  TrendingUp, Users, GraduationCap, Building2, Award, Filter, Download, 
  MapPin, Calendar, Star, Briefcase, DollarSign, Target, ArrowLeft
} from "lucide-react";
import { 
  colleges, branches, getCollegePlacementData, getBranchWiseData, 
  getTrendData, getTopRecruiters 
} from "@/data/enhancedPlacementData";

const CollegeDashboard = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    year: "2024",
    branch: "",
    minCGPA: "",
    minPackage: "",
    maxPackage: ""
  });

  const college = colleges.find(c => c.id === parseInt(collegeId || "1"));
  
  if (!college) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">College Not Found</h2>
          <Button onClick={() => navigate("/colleges")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
        </Card>
      </div>
    );
  }

  const placementData = useMemo(() => 
    getCollegePlacementData(college.id, filters), 
    [college.id, filters]
  );

  const branchWiseData = useMemo(() => 
    getBranchWiseData(college.id, parseInt(filters.year)), 
    [college.id, filters.year]
  );

  const trendData = useMemo(() => 
    getTrendData(college.id), 
    [college.id]
  );

  const topRecruiters = useMemo(() => 
    getTopRecruiters(college.id, parseInt(filters.year)), 
    [college.id, filters.year]
  );

  // Calculate aggregate statistics
  const stats = useMemo(() => {
    if (placementData.length === 0) return null;
    
    const totalStudents = placementData.reduce((sum, d) => sum + d.totalStudents, 0);
    const placedStudents = placementData.reduce((sum, d) => sum + d.placedStudents, 0);
    const avgPackage = placementData.reduce((sum, d) => sum + d.avgPackage, 0) / placementData.length;
    const highestPackage = Math.max(...placementData.map(d => d.highestPackage));
    const internships = placementData.reduce((sum, d) => sum + d.internshipOffers, 0);
    const higherStudies = placementData.reduce((sum, d) => sum + d.higherStudies, 0);
    
    const companies = new Set();
    placementData.forEach(d => {
      d.companyPlacements.forEach(cp => companies.add(cp.company));
    });

    return {
      totalStudents,
      placedStudents,
      placementRate: Math.round((placedStudents / totalStudents) * 100),
      avgPackage: Math.round(avgPackage * 100) / 100,
      highestPackage: Math.round(highestPackage * 100) / 100,
      totalCompanies: companies.size,
      internships,
      higherStudies,
      unplaced: totalStudents - placedStudents
    };
  }, [placementData]);

  // Prepare chart data
  const packageDistribution = useMemo(() => {
    if (!placementData.length) return [];
    
    const ranges = [
      { range: "0-10 LPA", min: 0, max: 10, count: 0 },
      { range: "10-20 LPA", min: 10, max: 20, count: 0 },
      { range: "20-50 LPA", min: 20, max: 50, count: 0 },
      { range: "50-100 LPA", min: 50, max: 100, count: 0 },
      { range: "100+ LPA", min: 100, max: Infinity, count: 0 }
    ];
    
    placementData.forEach(d => {
      d.companyPlacements.forEach(cp => {
        const pkg = cp.avgPackage;
        ranges.forEach(range => {
          if (pkg >= range.min && pkg < range.max) {
            range.count += cp.placements;
          }
        });
      });
    });
    
    return ranges.filter(r => r.count > 0);
  }, [placementData]);

  const sectorWiseData = useMemo(() => {
    if (!placementData.length) return [];
    
    const sectors: Record<string, {
      sector: string;
      placements: number;
      avgPackage: number;
      totalPackage: number;
    }> = {};
    
    placementData.forEach(d => {
      d.companyPlacements.forEach(cp => {
        if (!sectors[cp.sector]) {
          sectors[cp.sector] = { sector: cp.sector, placements: 0, avgPackage: 0, totalPackage: 0 };
        }
        sectors[cp.sector].placements += cp.placements;
        sectors[cp.sector].totalPackage += cp.avgPackage * cp.placements;
      });
    });
    
    return Object.values(sectors).map(s => ({
      ...s,
      avgPackage: Math.round((s.totalPackage / s.placements) * 100) / 100
    }));
  }, [placementData]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const handleFilterChange = (key: string, value: string) => {
    const processedValue = key === "branch" && value === "all" ? "" : value;
    setFilters(prev => ({ ...prev, [key]: processedValue }));
  };

  const clearFilters = () => {
    setFilters({
      year: "2024",
      branch: "",
      minCGPA: "",
      minPackage: "",
      maxPackage: ""
    });
  };

  const exportData = () => {
    const csvData = placementData.map(d => ({
      College: d.collegeName,
      Branch: d.branch,
      Year: d.year,
      TotalStudents: d.totalStudents,
      PlacedStudents: d.placedStudents,
      PlacementRate: d.placementRate,
      AvgPackage: d.avgPackage,
      HighestPackage: d.highestPackage
    }));
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${college.name}_placement_data.csv`;
    a.click();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        {/* College Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/colleges")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Colleges
          </Button>
          
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl gradient-text">{college.name}</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {college.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Est. {college.established}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        Rank #{college.ranking}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {college.type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Students</Label>
                  <p className="text-2xl font-semibold">{college.totalStudents.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Placement Officer</Label>
                  <p className="text-lg">{college.placementOfficer}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Type</Label>
                  <p className="text-lg">{college.type} Institution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="branch">Branch</Label>
                <Select value={filters.branch} onValueChange={(value) => handleFilterChange("branch", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="minCGPA">Min CGPA</Label>
                <Input
                  id="minCGPA"
                  type="number"
                  placeholder="7.0"
                  value={filters.minCGPA}
                  onChange={(e) => handleFilterChange("minCGPA", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="minPackage">Min Package (LPA)</Label>
                <Input
                  id="minPackage"
                  type="number"
                  placeholder="10"
                  value={filters.minPackage}
                  onChange={(e) => handleFilterChange("minPackage", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="maxPackage">Max Package (LPA)</Label>
                <Input
                  id="maxPackage"
                  type="number"
                  placeholder="100"
                  value={filters.maxPackage}
                  onChange={(e) => handleFilterChange("maxPackage", e.target.value)}
                />
              </div>
              
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={exportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        {stats && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.placedStudents.toLocaleString()} placed ({stats.placementRate}%)
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Package</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.avgPackage} LPA</div>
                  <p className="text-xs text-muted-foreground">
                    Highest: ₹{stats.highestPackage} LPA
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                  <p className="text-xs text-muted-foreground">
                    Recruiters participated
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Internships</CardTitle>
                  <Briefcase className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.internships}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.higherStudies} opted for higher studies
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Charts Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          variants={containerVariants}
        >
          {/* Branch-wise Placement Rate */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Branch-wise Placement Rate</CardTitle>
                <CardDescription>Placement percentage by engineering branch</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={branchWiseData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="branch" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [`${value}%`, 'Placement Rate']}
                    labelFormatter={(label) => `Branch: ${label}`}
                  />
                  <Bar 
                    dataKey="placementRate" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </motion.div>

          {/* Package Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Package Distribution</CardTitle>
                <CardDescription>Number of students by salary range</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={packageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {packageDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [`${value} students`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </motion.div>

          {/* Placement Trends */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>5-Year Placement Trend</CardTitle>
                <CardDescription>Placement rate and average package over years</CardDescription>
              </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="placementRate" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Placement Rate (%)"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="avgPackage" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Avg Package (LPA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          </motion.div>

          {/* Sector-wise Placements */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Sector-wise Placements</CardTitle>
                <CardDescription>Placements across different industry sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sectorWiseData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="sector" width={100} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Bar dataKey="placements" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Top Recruiters */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Recruiters ({filters.year})
              </CardTitle>
              <CardDescription>Companies with highest number of placements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topRecruiters.map((recruiter, index) => (
                  <Card key={recruiter.company} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{recruiter.company}</h3>
                        <Badge variant={recruiter.tier === "Tier 1" ? "default" : "secondary"}>
                          {recruiter.tier}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Placements: <span className="font-medium text-foreground">{recruiter.totalPlacements}</span></p>
                        <p>Avg Package: <span className="font-medium text-foreground">₹{recruiter.avgPackage} LPA</span></p>
                        <p>Highest: <span className="font-medium text-foreground">₹{recruiter.highestPackage} LPA</span></p>
                        <p>Sector: <span className="font-medium text-foreground">{recruiter.sector}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CollegeDashboard;