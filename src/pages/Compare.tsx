import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { GitCompare, Download, TrendingUp, Users, DollarSign } from 'lucide-react';
import { colleges, branches, placementData } from '../data/placementData';
import { saveAs } from 'file-saver';

const Compare = () => {
  const [collegeA, setCollegeA] = useState('');
  const [collegeB, setCollegeB] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [minCGPA, setMinCGPA] = useState('7.0');

  const getFilteredData = (collegeName: string) => {
    return placementData.filter(item => 
      item.college === collegeName &&
      item.year === parseInt(selectedYear) &&
      (selectedBranch === 'all' || item.branch === selectedBranch) &&
      item.minCGPA >= parseFloat(minCGPA)
    );
  };

  const calculateStats = (data: any[]) => {
    if (data.length === 0) return null;
    
    const totalOffers = data.reduce((sum, item) => sum + item.offers, 0);
    const totalStudents = data.reduce((sum, item) => sum + item.totalStudents, 0);
    const avgPackage = data.reduce((sum, item) => sum + item.avgPackage, 0) / data.length;
    const highestPackage = Math.max(...data.map(item => item.highestPackage));
    
    return {
      totalOffers,
      totalStudents,
      placementRate: Math.round((totalOffers / totalStudents) * 100),
      avgPackage: Math.round(avgPackage / 100000),
      highestPackage: Math.round(highestPackage / 100000)
    };
  };

  const dataA = getFilteredData(collegeA);
  const dataB = getFilteredData(collegeB);
  const statsA = calculateStats(dataA);
  const statsB = calculateStats(dataB);

  const comparisonData = [
    {
      metric: 'Placement Rate',
      collegeA: statsA?.placementRate || 0,
      collegeB: statsB?.placementRate || 0
    },
    {
      metric: 'Avg Package (LPA)',
      collegeA: statsA?.avgPackage || 0,
      collegeB: statsB?.avgPackage || 0
    },
    {
      metric: 'Highest Package (LPA)',
      collegeA: statsA?.highestPackage || 0,
      collegeB: statsB?.highestPackage || 0
    }
  ];

  const exportComparison = () => {
    const csvContent = [
      ['Metric', collegeA || 'College A', collegeB || 'College B'],
      ['Total Offers', statsA?.totalOffers || 0, statsB?.totalOffers || 0],
      ['Placement Rate (%)', statsA?.placementRate || 0, statsB?.placementRate || 0],
      ['Average Package (LPA)', statsA?.avgPackage || 0, statsB?.avgPackage || 0],
      ['Highest Package (LPA)', statsA?.highestPackage || 0, statsB?.highestPackage || 0]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `college-comparison-${Date.now()}.csv`);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Compare Colleges</h1>
          <p className="text-muted-foreground">Side-by-side comparison of placement statistics</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <span>Comparison Filters</span>
            </CardTitle>
            <CardDescription>Select colleges and apply filters for comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label>College A</Label>
                <Select value={collegeA} onValueChange={setCollegeA}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue placeholder="Select College A" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map(college => (
                      <SelectItem key={college.id} value={college.name}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>College B</Label>
                <Select value={collegeB} onValueChange={setCollegeB}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue placeholder="Select College B" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map(college => (
                      <SelectItem key={college.id} value={college.name}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map(branch => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Min CGPA</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCGPA}
                  onChange={(e) => setMinCGPA(e.target.value)}
                  className="glass-effect border-white/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Results */}
        {collegeA && collegeB && statsA && statsB && (
          <>
            {/* Stats Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="card-hover bg-gradient-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Placement Rate</h3>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeA}</span>
                      <span className="font-bold text-lg">{statsA.placementRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeB}</span>
                      <span className="font-bold text-lg">{statsB.placementRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover bg-gradient-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Avg Package</h3>
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeA}</span>
                      <span className="font-bold text-lg">{statsA.avgPackage} LPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeB}</span>
                      <span className="font-bold text-lg">{statsB.avgPackage} LPA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover bg-gradient-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Total Offers</h3>
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeA}</span>
                      <span className="font-bold text-lg">{statsA.totalOffers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{collegeB}</span>
                      <span className="font-bold text-lg">{statsB.totalOffers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Comparison Chart */}
            <Card className="mb-8 bg-gradient-card border-white/10">
              <CardHeader>
                <CardTitle>Comparative Analysis</CardTitle>
                <CardDescription>Side-by-side metrics comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="metric" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                      }}
                    />
                    <Bar dataKey="collegeA" fill="#6366f1" name={collegeA} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="collegeB" fill="#8b5cf6" name={collegeB} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Export Button */}
            <div className="text-center">
              <Button
                onClick={exportComparison}
                className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0 px-8"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Comparison as CSV
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {(!collegeA || !collegeB) && (
          <Card className="bg-gradient-card border-white/10">
            <CardContent className="p-12 text-center">
              <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Select Colleges to Compare</h3>
              <p className="text-muted-foreground">
                Choose two colleges from the dropdown menus above to see detailed comparison
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;