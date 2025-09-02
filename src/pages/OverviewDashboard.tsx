import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter
} from "recharts";
import { 
  TrendingUp, Users, GraduationCap, Building2, Award, Download, 
  Briefcase, DollarSign, Target, BarChart3, Calendar, MapPin
} from "lucide-react";
import { 
  colleges, getCollegeWiseData, getTrendData, getTopRecruiters, getPlacementStats,
  getBranchWiseData, getSectorWiseData
} from "@/data/enhancedPlacementData";
import { saveAs } from 'file-saver';
import * as Papa from 'papaparse';

const OverviewDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [collegeType, setCollegeType] = useState("all");

  const overallStats = useMemo(() => getPlacementStats(), []);
  const trendData = useMemo(() => getTrendData(), []);
  const topRecruiters = useMemo(() => getTopRecruiters(null, parseInt(selectedYear), 15), [selectedYear]);
  const branchData = useMemo(() => getBranchWiseData(null, parseInt(selectedYear)), [selectedYear]);
  const sectorData = useMemo(() => getSectorWiseData(null, parseInt(selectedYear)), [selectedYear]);

  const collegeData = useMemo(() => {
    let data = getCollegeWiseData(parseInt(selectedYear));
    
    if (collegeType !== "all") {
      data = data.filter(d => {
        const college = colleges.find(c => c.id === d.collegeId);
        return college?.type === collegeType;
      });
    }
    
    return data.sort((a, b) => b.placementRate - a.placementRate);
  }, [selectedYear, collegeType]);

  const typeWiseData = useMemo(() => {
    const typeStats: Record<string, {
      type: string;
      colleges: number;
      totalStudents: number;
      placedStudents: number;
      avgPlacementRate: number;
      avgPackage: number;
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
          avgPlacementRate: 0,
          avgPackage: 0
        };
      }
      
      typeStats[type].colleges += 1;
      typeStats[type].totalStudents += college.totalStudents;
      typeStats[type].placedStudents += college.placedStudents;
      typeStats[type].avgPackage += college.avgPackage;
    });
    
    return Object.values(typeStats).map(stat => ({
      ...stat,
      avgPlacementRate: Math.round((stat.placedStudents / stat.totalStudents) * 100),
      avgPackage: Math.round(stat.avgPackage / stat.colleges)
    }));
  }, [collegeData]);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];

  const exportData = () => {
    const csvData = collegeData.map(college => {
      const collegeInfo = colleges.find(c => c.id === college.collegeId);
      return {
        College: college.collegeName,
        Type: collegeInfo?.type || "Unknown",
        Location: collegeInfo?.location || "Unknown",
        'Total Students': college.totalStudents,
        'Placed Students': college.placedStudents,
        'Placement Rate (%)': college.placementRate,
        'Average Package (LPA)': college.avgPackage,
        'Highest Package (LPA)': college.highestPackage,
        'Top Recruiter': college.topRecruiter || 'N/A'
      };
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `overall-placement-data-${selectedYear}.csv`);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: overallStats.totalStudents.toLocaleString(),
      subtitle: 'Across all colleges',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Overall Placement Rate',
      value: `${overallStats.placementRate}%`,
      subtitle: 'Successfully placed',
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Average Package',
      value: `${overallStats.avgPackage} LPA`,
      subtitle: 'Across all placements',
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Participating Companies',
      value: overallStats.totalCompanies.toString(),
      subtitle: 'Active recruiters',
      icon: Building2,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Overall Placement Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive placement insights across all participating colleges
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 glass-effect border-white/10">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2023-24</SelectItem>
                    <SelectItem value="2023">2022-23</SelectItem>
                    <SelectItem value="2022">2021-22</SelectItem>
                    <SelectItem value="2021">2020-21</SelectItem>
                    <SelectItem value="2020">2019-20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">College Type</Label>
                <Select value={collegeType} onValueChange={setCollegeType}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="glass-effect border-white/10 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* College Type Analysis */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                College Type Analysis
              </CardTitle>
              <CardDescription>
                Performance comparison by college type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}
                  />
                  <Bar dataKey="avgPlacementRate" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Branch-wise Distribution */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Branch-wise Placements
              </CardTitle>
              <CardDescription>
                Placement distribution across branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={branchData.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => {
                      const branchName = name && typeof name === 'string' ? name.split(' ')[0] : name || 'Unknown';
                      return `${branchName}: ${value}%`;
                    }}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="placementRate"
                  >
                    {branchData.slice(0, 6).map((entry, index) => (
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

        {/* 5-Year Trends */}
        <Card className="glass-effect border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              5-Year Placement Trends
            </CardTitle>
            <CardDescription>
              Historical placement data and package trends
            </CardDescription>
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
                  name="Placement Rate (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="avgPackage" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                  name="Avg Package (LPA)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sector-wise Analysis */}
        <Card className="glass-effect border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Sector-wise Placements
            </CardTitle>
            <CardDescription>
              Industry-wise placement distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sectorData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="sector" type="category" stroke="#9ca3af" width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                />
                <Bar dataKey="placements" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Recruiters */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Top Recruiters - {selectedYear}
            </CardTitle>
            <CardDescription>
              Companies with highest placement numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRecruiters.slice(0, 12).map((recruiter, index) => (
                <div 
                  key={recruiter.company}
                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">{recruiter.company}</h4>
                    <Badge variant="secondary" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Placements:</span>
                      <span className="font-medium text-foreground">{recruiter.totalPlacements}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Package:</span>
                      <span className="font-medium text-foreground">{recruiter.avgPackage} LPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sector:</span>
                      <span className="font-medium text-foreground">{recruiter.sector}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;