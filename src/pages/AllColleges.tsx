import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  TrendingUp, Users, GraduationCap, Building2, Award, Filter, Download, 
  MapPin, Calendar, Star, Briefcase, DollarSign, Target, Eye, BarChart3
} from "lucide-react";
import { 
  colleges, getCollegeWiseData, getTrendData, getTopRecruiters, getPlacementStats 
} from "@/data/enhancedPlacementData";

const AllColleges = () => {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [sortBy, setSortBy] = useState("placementRate");
  const [collegeType, setCollegeType] = useState("all");

  const collegeData = useMemo(() => {
    let data = getCollegeWiseData(parseInt(selectedYear));
    
    // Filter by college type
    if (collegeType !== "all") {
      data = data.filter(d => {
        const college = colleges.find(c => c.id === d.collegeId);
        return college?.type === collegeType;
      });
    }
    
    // Sort data
    data.sort((a, b) => {
      switch (sortBy) {
        case "placementRate":
          return b.placementRate - a.placementRate;
        case "avgPackage":
          return b.avgPackage - a.avgPackage;
        case "totalStudents":
          return b.totalStudents - a.totalStudents;
        case "alphabetical":
          return a.collegeName.localeCompare(b.collegeName);
        default:
          return b.placementRate - a.placementRate;
      }
    });
    
    return data;
  }, [selectedYear, sortBy, collegeType]);

  const trendData = useMemo(() => getTrendData(), []);
  const topRecruiters = useMemo(() => getTopRecruiters(null, parseInt(selectedYear), 15), [selectedYear]);
  const overallStats = useMemo(() => getPlacementStats(), []);

  // Prepare visualization data
  const collegeComparisonData = useMemo(() => {
    return collegeData.map(college => {
      const collegeInfo = colleges.find(c => c.id === college.collegeId);
      return {
        ...college,
        ranking: collegeInfo?.ranking || 0,
        type: collegeInfo?.type || "Unknown"
      };
    });
  }, [collegeData]);

  const typeWiseData = useMemo(() => {
    const typeStats: Record<string, {
      type: string;
      colleges: number;
      totalStudents: number;
      placedStudents: number;
      totalPackage: number;
      count: number;
    }> = {};
    
    collegeData.forEach(college => {
      const collegeInfo = colleges.find(c => c.id === college.collegeId);
      const type = collegeInfo?.type || "Unknown";
      
      if (!typeStats[type]) {
        typeStats[type] = {
          type,
          colleges: 0,
          totalStudents: 0,
          placedStudents: 0,
          totalPackage: 0,
          count: 0
        };
      }
      
      typeStats[type].colleges += 1;
      typeStats[type].totalStudents += college.totalStudents;
      typeStats[type].placedStudents += college.placedStudents;
      typeStats[type].totalPackage += college.avgPackage;
      typeStats[type].count += 1;
    });
    
    return Object.values(typeStats).map(stat => ({
      ...stat,
      avgPlacementRate: Math.round((stat.placedStudents / stat.totalStudents) * 100),
      avgPackage: Math.round((stat.totalPackage / stat.count) * 100) / 100
    }));
  }, [collegeData]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const exportData = () => {
    const csvData = collegeData.map(d => {
      const college = colleges.find(c => c.id === d.collegeId);
      return {
        College: d.collegeName,
        Type: college?.type,
        Location: college?.location,
        Ranking: college?.ranking,
        TotalStudents: d.totalStudents,
        PlacedStudents: d.placedStudents,
        PlacementRate: d.placementRate,
        AvgPackage: d.avgPackage,
        HighestPackage: d.highestPackage,
        TotalCompanies: d.totalCompanies
      };
    });
    
    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_colleges_placement_data_${selectedYear}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="text-3xl gradient-text">All Colleges Placement Overview</CardTitle>
              <CardDescription className="text-lg">
                Comprehensive placement statistics across all participating institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Total Offers</Label>
                  <p className="text-2xl font-semibold">{overallStats.totalOffers.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Overall Placement Rate</Label>
                  <p className="text-2xl font-semibold">{overallStats.placementRate}%</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Average Package</Label>
                  <p className="text-2xl font-semibold">₹{overallStats.avgPackage} LPA</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Total Companies</Label>
                  <p className="text-2xl font-semibold">{overallStats.totalCompanies}</p>
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
              Filters & Sort
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
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
                <Label htmlFor="type">College Type</Label>
                <Select value={collegeType} onValueChange={setCollegeType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sort">Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placementRate">Placement Rate</SelectItem>
                    <SelectItem value="avgPackage">Average Package</SelectItem>
                    <SelectItem value="totalStudents">Total Students</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={exportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* College Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>College Placement Comparison</CardTitle>
              <CardDescription>Placement rate vs average package</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={collegeComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    type="number" 
                    dataKey="placementRate" 
                    name="Placement Rate"
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="avgPackage" 
                    name="Avg Package"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">{data.collegeName}</p>
                            <p>Placement Rate: {data.placementRate}%</p>
                            <p>Avg Package: ₹{data.avgPackage} LPA</p>
                            <p>Students: {data.totalStudents}</p>
                            <p>Type: {data.type}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    dataKey="avgPackage" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.7}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* College Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>College Type Analysis</CardTitle>
              <CardDescription>Performance by institution type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeWiseData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="type" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="avgPlacementRate" 
                    fill="hsl(var(--primary))"
                    name="Avg Placement Rate (%)"
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="avgPackage" 
                    fill="hsl(var(--accent))"
                    name="Avg Package (LPA)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Overall Placement Trends */}
          <Card>
            <CardHeader>
              <CardTitle>5-Year Placement Trends</CardTitle>
              <CardDescription>Industry-wide placement trends</CardDescription>
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
                    strokeWidth={3}
                    name="Placement Rate (%)"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="avgPackage" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={3}
                    name="Avg Package (LPA)"
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="highestPackage" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Highest Package (LPA)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Companies Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Top Companies by Placements</CardTitle>
              <CardDescription>Most active recruiters across all colleges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topRecruiters.slice(0, 10)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="company" width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))'
                    }}
                  />
                  <Bar dataKey="totalPlacements" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* College Cards Grid */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              College Rankings ({selectedYear})
            </CardTitle>
            <CardDescription>Individual college performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collegeData.map((college, index) => {
                const collegeInfo = colleges.find(c => c.id === college.collegeId);
                return (
                  <Card key={college.collegeId} className="card-hover cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{college.collegeName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {collegeInfo?.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant={collegeInfo?.type === "Government" ? "default" : "secondary"}>
                            #{index + 1}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Rank #{collegeInfo?.ranking}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Placement Rate</span>
                          <span className="font-semibold">{college.placementRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Package</span>
                          <span className="font-semibold">₹{college.avgPackage} LPA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Highest Package</span>
                          <span className="font-semibold">₹{college.highestPackage} LPA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Students</span>
                          <span className="font-semibold">{college.totalStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Companies</span>
                          <span className="font-semibold">{college.totalCompanies}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/college/${college.collegeId}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/dashboard?college=${college.collegeId}`)}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Recruiters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Recruiters ({selectedYear})
            </CardTitle>
            <CardDescription>Companies with highest recruitment numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRecruiters.slice(0, 12).map((recruiter, index) => (
                <Card key={recruiter.company} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{recruiter.company}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={recruiter.tier === "Tier 1" ? "default" : "secondary"}>
                          {recruiter.tier}
                        </Badge>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Total Placements: <span className="font-medium text-foreground">{recruiter.totalPlacements}</span></p>
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
      </div>
    </div>
  );
};

export default AllColleges;