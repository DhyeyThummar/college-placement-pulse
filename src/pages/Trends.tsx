import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { TrendingUp, Download, Filter, BarChart3 } from 'lucide-react';
import { colleges, branches, placementData } from '../data/placementData';
import { saveAs } from 'file-saver';

const Trends = () => {
  const [selectedCollege, setSelectedCollege] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [minCGPA, setMinCGPA] = useState('7.0');

  const getFilteredData = () => {
    return placementData
      .filter(item => 
        (selectedCollege === 'all' || item.college === selectedCollege) &&
        (selectedBranch === 'all' || item.branch === selectedBranch) &&
        item.minCGPA >= parseFloat(minCGPA)
      )
      .reduce((acc, item) => {
        const existing = acc.find(x => x.year === item.year);
        if (existing) {
          existing.totalOffers += item.offers;
          existing.totalStudents += item.totalStudents;
          existing.totalPackage += item.avgPackage;
          existing.count += 1;
        } else {
          acc.push({
            year: item.year,
            totalOffers: item.offers,
            totalStudents: item.totalStudents,
            totalPackage: item.avgPackage,
            count: 1
          });
        }
        return acc;
      }, [] as any[])
      .map(item => ({
        year: item.year,
        placementRate: Math.round((item.totalOffers / item.totalStudents) * 100),
        avgPackage: Math.round(item.totalPackage / item.count / 100000),
        totalOffers: item.totalOffers
      }))
      .sort((a, b) => a.year - b.year);
  };

  const trendData = getFilteredData();

  const downloadCSV = () => {
    const csvContent = [
      ['Year', 'Placement Rate (%)', 'Average Package (LPA)', 'Total Offers'],
      ...trendData.map(item => [
        item.year,
        item.placementRate,
        item.avgPackage,
        item.totalOffers
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `placement-trends-${Date.now()}.csv`);
  };

  const downloadPDF = () => {
    // For demo purposes, we'll just show an alert
    alert('PDF download feature would be implemented with a library like jsPDF');
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Placement Trends</h1>
          <p className="text-muted-foreground">Analyze placement patterns across years and institutions</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-card border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <span>Filter Options</span>
            </CardTitle>
            <CardDescription>Customize the data view with various filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>College</Label>
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue placeholder="All Colleges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Colleges</SelectItem>
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

              <div className="space-y-2">
                <Label>Actions</Label>
                <div className="flex space-x-2">
                  <Button
                    onClick={downloadCSV}
                    variant="outline"
                    size="sm"
                    className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    CSV
                  </Button>
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    size="sm"
                    className="glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trends Charts */}
        {trendData.length > 0 ? (
          <div className="space-y-8">
            {/* Placement Rate Trend */}
            <Card className="bg-gradient-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Placement Rate Trends</span>
                </CardTitle>
                <CardDescription>Placement rate percentage over the years</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="placementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
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
                    <Area 
                      type="monotone" 
                      dataKey="placementRate" 
                      stroke="#6366f1" 
                      fillOpacity={1} 
                      fill="url(#placementGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Package Trend */}
            <Card className="bg-gradient-card border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Average Package Trends</span>
                </CardTitle>
                <CardDescription>Average package (in LPA) growth over time</CardDescription>
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
                      dataKey="avgPackage" 
                      stroke="#8b5cf6" 
                      strokeWidth={4}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 8 }}
                      activeDot={{ r: 10, stroke: '#8b5cf6', strokeWidth: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Combined Trends */}
            <Card className="bg-gradient-card border-white/10">
              <CardHeader>
                <CardTitle>Combined Trends Analysis</CardTitle>
                <CardDescription>Placement rate and package trends on the same chart</CardDescription>
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
                      name="Placement Rate (%)"
                      dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgPackage" 
                      stroke="#ec4899" 
                      strokeWidth={3}
                      name="Avg Package (LPA)"
                      dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-gradient-card border-white/10">
            <CardContent className="p-12 text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see placement trends
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Trends;