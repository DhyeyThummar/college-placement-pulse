import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  Building2, Search, TrendingUp, Users, DollarSign, Award,
  MapPin, Calendar, Star, Filter, Eye, Target
} from 'lucide-react';
import { companies, placementData, colleges } from '@/data/placementData';

const CompanyInsights = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Get company data with placement statistics
  const companyData = useMemo(() => {
    const companyStats = {};
    
    placementData.forEach(placement => {
      placement.companyPlacements?.forEach(cp => {
        if (!companyStats[cp.company]) {
          companyStats[cp.company] = {
            name: cp.company,
            sector: cp.sector,
            totalHires: 0,
            avgPackage: 0,
            colleges: new Set(),
            branches: new Set(),
            packageSum: 0,
            hireCount: 0,
            minPackage: Infinity,
            maxPackage: 0
          };
        }
        
        const stats = companyStats[cp.company];
        stats.totalHires += cp.placements;
        stats.packageSum += cp.avgPackage * cp.placements;
        stats.hireCount += cp.placements;
        stats.colleges.add(placement.collegeName);
        stats.branches.add(placement.branch);
        stats.minPackage = Math.min(stats.minPackage, cp.avgPackage);
        stats.maxPackage = Math.max(stats.maxPackage, cp.avgPackage);
      });
    });

    return Object.values(companyStats).map((stats: any) => ({
      ...stats,
      avgPackage: Math.round((stats.packageSum / stats.hireCount) * 100) / 100,
      collegeCount: stats.colleges.size,
      branchCount: stats.branches.size,
      colleges: Array.from(stats.colleges),
      branches: Array.from(stats.branches)
    }));
  }, []);

  // Filter companies based on search and sector
  const filteredCompanies = useMemo(() => {
    let filtered = companyData;
    
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedSector !== 'all') {
      filtered = filtered.filter(company => company.sector === selectedSector);
    }
    
    return filtered.sort((a, b) => b.totalHires - a.totalHires);
  }, [companyData, searchQuery, selectedSector]);

  // Sector-wise distribution
  const sectorData = useMemo(() => {
    const sectors = {};
    companyData.forEach(company => {
      if (!sectors[company.sector]) {
        sectors[company.sector] = { sector: company.sector, companies: 0, totalHires: 0, avgPackage: 0 };
      }
      sectors[company.sector].companies += 1;
      sectors[company.sector].totalHires += company.totalHires;
      sectors[company.sector].avgPackage += company.avgPackage;
    });
    
    return Object.values(sectors).map((sector: any) => ({
      ...sector,
      avgPackage: Math.round((sector.avgPackage / sector.companies) * 100) / 100
    }));
  }, [companyData]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

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
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Company Insights & Analytics
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive analysis of recruiting companies, hiring trends, and compensation packages
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={itemVariants}>
          <Card className="mb-8 glass-effect">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overview Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Companies</p>
                    <p className="text-2xl font-bold">{companyData.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hires</p>
                    <p className="text-2xl font-bold">
                      {companyData.reduce((sum, c) => sum + c.totalHires, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Package</p>
                    <p className="text-2xl font-bold">
                      ₹{Math.round(companyData.reduce((sum, c) => sum + c.avgPackage, 0) / companyData.length)} LPA
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Top Package</p>
                    <p className="text-2xl font-bold">
                      ₹{Math.max(...companyData.map(c => c.maxPackage))} LPA
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          variants={containerVariants}
        >
          {/* Sector Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Sector-wise Distribution</CardTitle>
                <CardDescription>Companies and hiring by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ sector, companies }) => `${sector} (${companies})`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="companies"
                    >
                      {sectorData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Hiring Companies */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Top Hiring Companies</CardTitle>
                <CardDescription>Companies with highest student recruitment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredCompanies.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={10}
                    />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`${value} students`, 'Total Hires']}
                    />
                    <Bar 
                      dataKey="totalHires" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Company List */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Company Directory</CardTitle>
              <CardDescription>
                Detailed information about recruiting companies ({filteredCompanies.length} companies)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="h-full card-hover cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{company.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {company.sector}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedCompany(company)}
                            className="p-2"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Hires:</span>
                            <span className="font-medium">{company.totalHires}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg Package:</span>
                            <span className="font-medium">₹{company.avgPackage} LPA</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Colleges:</span>
                            <span className="font-medium">{company.collegeCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Branches:</span>
                            <span className="font-medium">{company.branchCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CompanyInsights;