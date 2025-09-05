import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ComposedChart
} from "recharts";
import { 
  BarChart3, TrendingUp, Users, Building2, Award, Target, DollarSign,
  Zap, Activity, Eye, Brain, Rocket
} from 'lucide-react';
import { placementData } from '@/data/enhancedPlacementData';

const Analytics = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMetric, setSelectedMetric] = useState('placement');

  // Advanced analytics calculations
  const advancedMetrics = useMemo(() => {
    const data = placementData.filter(d => d.year === parseInt(selectedYear));
    
    // Performance distribution
    const performanceRanges = [
      { range: 'Excellent (90-100%)', min: 90, max: 100, count: 0 },
      { range: 'Good (75-89%)', min: 75, max: 89, count: 0 },
      { range: 'Average (60-74%)', min: 60, max: 74, count: 0 },
      { range: 'Below Average (<60%)', min: 0, max: 59, count: 0 }
    ];
    
    data.forEach(d => {
      const rate = d.placementRate;
      performanceRanges.forEach(range => {
        if (rate >= range.min && rate <= range.max) {
          range.count++;
        }
      });
    });

    // Package vs Placement correlation
    const correlationData = data.map(d => ({
      placementRate: d.placementRate,
      avgPackage: d.avgPackage,
      college: d.collegeName,
      totalStudents: d.totalStudents
    }));

    // Growth metrics
    const currentYear = data;
    const prevYear = placementData.filter(d => d.year === parseInt(selectedYear) - 1);
    
    const growthMetrics = {
      placementGrowth: currentYear.length > 0 && prevYear.length > 0 
        ? ((currentYear.reduce((sum, d) => sum + d.placementRate, 0) / currentYear.length) - 
           (prevYear.reduce((sum, d) => sum + d.placementRate, 0) / prevYear.length))
        : 0,
      packageGrowth: currentYear.length > 0 && prevYear.length > 0
        ? ((currentYear.reduce((sum, d) => sum + d.avgPackage, 0) / currentYear.length) - 
           (prevYear.reduce((sum, d) => sum + d.avgPackage, 0) / prevYear.length))
        : 0
    };

    return {
      performanceRanges: performanceRanges.filter(r => r.count > 0),
      correlationData,
      growthMetrics,
      totalColleges: data.length,
      avgPlacement: data.reduce((sum, d) => sum + d.placementRate, 0) / data.length,
      avgPackage: data.reduce((sum, d) => sum + d.avgPackage, 0) / data.length
    };
  }, [selectedYear]);

  // Sector performance radar data
  const sectorRadarData = useMemo(() => {
    const sectorStats = {};
    
    placementData
      .filter(d => d.year === parseInt(selectedYear))
      .forEach(d => {
        d.companyPlacements?.forEach(cp => {
          if (!sectorStats[cp.sector]) {
            sectorStats[cp.sector] = {
              sector: cp.sector,
              avgPackage: 0,
              totalPlacements: 0,
              count: 0
            };
          }
          sectorStats[cp.sector].avgPackage += cp.avgPackage;
          sectorStats[cp.sector].totalPlacements += cp.placements;
          sectorStats[cp.sector].count++;
        });
      });

    return Object.values(sectorStats).map((s: any) => ({
      sector: s.sector,
      package: Math.round(s.avgPackage / s.count),
      placements: s.totalPlacements,
      demand: Math.min(100, s.totalPlacements * 2), // Normalized demand score
      growth: Math.random() * 20 + 80, // Mock growth data
      satisfaction: Math.random() * 20 + 75 // Mock satisfaction data
    }));
  }, [selectedYear]);

  const COLORS = [
    'hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))', 'hsl(var(--chart-5))'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
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
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Advanced Analytics Hub
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep insights and predictive analytics for placement intelligence
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <Card className="mb-8 glass-enhanced">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2023-24</SelectItem>
                    <SelectItem value="2023">2022-23</SelectItem>
                    <SelectItem value="2022">2021-22</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placement">Placement Analysis</SelectItem>
                    <SelectItem value="package">Package Analysis</SelectItem>
                    <SelectItem value="trend">Trend Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Placement</p>
                    <p className="text-2xl font-bold">
                      {Math.round(advancedMetrics.avgPlacement)}%
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {advancedMetrics.growthMetrics.placementGrowth > 0 ? '+' : ''}
                      {Math.round(advancedMetrics.growthMetrics.placementGrowth)}% YoY
                    </Badge>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Package</p>
                    <p className="text-2xl font-bold">
                      ₹{Math.round(advancedMetrics.avgPackage)} LPA
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {advancedMetrics.growthMetrics.packageGrowth > 0 ? '+' : ''}
                      ₹{Math.round(advancedMetrics.growthMetrics.packageGrowth)} LPA
                    </Badge>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Colleges</p>
                    <p className="text-2xl font-bold">{advancedMetrics.totalColleges}</p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Participating
                    </Badge>
                  </div>
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Performance</p>
                    <p className="text-2xl font-bold">
                      {advancedMetrics.performanceRanges[0]?.range.split(' ')[0] || 'Good'}
                    </p>
                    <Badge variant="secondary" className="text-xs mt-1">
                      Overall Rating
                    </Badge>
                  </div>
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Advanced Analytics Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="performance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 glass-enhanced">
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="correlation" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Correlation
              </TabsTrigger>
              <TabsTrigger value="sectors" className="flex items-center gap-2">
                <Rocket className="h-4 w-4" />
                Sectors
              </TabsTrigger>
              <TabsTrigger value="predictions" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Predictions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                  <CardDescription>
                    College performance across different placement rate ranges
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={advancedMetrics.performanceRanges}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--primary) / 0.2)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-elegant)',
                        }}
                        cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(var(--primary))" 
                        radius={[8, 8, 0, 0]}
                        className="hover:opacity-80 transition-all duration-300"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="correlation" className="space-y-6">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle>Placement Rate vs Package Correlation</CardTitle>
                  <CardDescription>
                    Relationship between placement rates and average packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart data={advancedMetrics.correlationData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="placementRate" 
                        name="Placement Rate (%)"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                      />
                      <YAxis 
                        dataKey="avgPackage" 
                        name="Avg Package (LPA)"
                        type="number"
                        domain={['dataMin', 'dataMax']}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--primary) / 0.2)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-elegant)',
                        }}
                        cursor={{ strokeDasharray: '3 3' }}
                        formatter={(value, name, props) => [
                          `${value}${name === 'Placement Rate (%)' ? '%' : ' LPA'}`,
                          name
                        ]}
                        labelFormatter={(value, payload) => 
                          payload?.[0]?.payload?.college || 'College'
                        }
                      />
                      <Scatter 
                        dataKey="avgPackage" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.8}
                        r={8}
                        className="hover:opacity-80 transition-opacity"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors" className="space-y-6">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle>Sector Performance Radar</CardTitle>
                  <CardDescription>
                    Multi-dimensional analysis of sector performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={sectorRadarData}>
                      <PolarGrid className="opacity-30" />
                      <PolarAngleAxis dataKey="sector" />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        className="text-xs"
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--primary) / 0.2)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-elegant)',
                        }}
                      />
                      <Radar
                        name="Package"
                        dataKey="package"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Demand"
                        dataKey="demand"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-6">
              <Card className="glass-enhanced">
                <CardHeader>
                  <CardTitle>Predictive Insights</CardTitle>
                  <CardDescription>
                    AI-powered predictions and trends for upcoming placements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">Trend Prediction</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on historical data, placement rates are expected to increase by 5-8% in the next academic year.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">Market Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Technology and Analytics sectors show highest growth potential with 15% YoY increase in hiring.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        Focus on skill development in AI/ML and Data Science for better placement outcomes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;