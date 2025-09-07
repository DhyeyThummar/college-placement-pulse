import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getColleges, getCollegeById } from '@/services/database';
import { 
  Upload, 
  Download, 
  FileText, 
  Database,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Building,
  Loader2
} from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

interface ProcessedData {
  year: number;
  branch_data: Array<{
    branch: string;
    total_students: number;
    placed_students: number;
    highest_package: number;
    average_package: number;
    median_package?: number;
    companies: string[];
  }>;
  overall_stats: {
    total_students: number;
    total_placed: number;
    placement_percentage: number;
    total_companies: number;
    highest_package: number;
    average_package: number;
  };
}

const AdminDashboard = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [colleges, setColleges] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState('');
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalColleges: 0,
    totalBranches: 0,
    lastUpdated: new Date().toLocaleDateString()
  });
  
  const { user, userRole, userProfile } = useAuth();

  useEffect(() => {
    loadColleges();
    loadStats();
  }, []);

  const loadColleges = async () => {
    const collegesData = await getColleges();
    setColleges(collegesData);
  };

  const loadStats = async () => {
    try {
      const { data: placementData } = await supabase
        .from('placement_data')
        .select('*');

      if (placementData) {
        const totalRecords = placementData.length;
        const uniqueColleges = new Set(placementData.map(item => item.college_id)).size;
        
        let totalBranches = 0;
        placementData.forEach(item => {
          if (item.data?.branch_data) {
            totalBranches += item.data.branch_data.length;
          }
        });

        setStats({
          totalRecords,
          totalColleges: uniqueColleges,
          totalBranches,
          lastUpdated: new Date().toLocaleDateString()
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const processCSVData = (rawData: any[]) => {
    // Group data by branch
    const branchMap = new Map();
    const companiesSet = new Set<string>();
    
    rawData.forEach(row => {
      const branch = row.Branch || row.branch;
      const students = parseInt(row['Total Students'] || row.total_students) || 0;
      const placed = parseInt(row['Placed Students'] || row.placed) || 0;
      const avgPackage = parseFloat(row['Average Package'] || row.avg_package) || 0;
      const highestPackage = parseFloat(row['Highest Package'] || row.highest_package) || 0;
      const companies = (row.Companies || row.companies || '').split(',').map((c: string) => c.trim()).filter((c: string) => c);
      
      companies.forEach(company => companiesSet.add(company));
      
      if (!branchMap.has(branch)) {
        branchMap.set(branch, {
          branch,
          total_students: 0,
          placed_students: 0,
          highest_package: 0,
          average_package: 0,
          companies: []
        });
      }
      
      const branchData = branchMap.get(branch);
      branchData.total_students += students;
      branchData.placed_students += placed;
      branchData.highest_package = Math.max(branchData.highest_package, highestPackage);
      branchData.companies = [...new Set([...branchData.companies, ...companies])];
    });

    // Calculate averages
    branchMap.forEach(branchData => {
      const relevantRows = rawData.filter(row => (row.Branch || row.branch) === branchData.branch);
      const totalPackageSum = relevantRows.reduce((sum, row) => {
        const placed = parseInt(row['Placed Students'] || row.placed) || 0;
        const avgPackage = parseFloat(row['Average Package'] || row.avg_package) || 0;
        return sum + (placed * avgPackage);
      }, 0);
      
      branchData.average_package = branchData.placed_students > 0 
        ? totalPackageSum / branchData.placed_students 
        : 0;
    });

    const branch_data = Array.from(branchMap.values());
    
    // Calculate overall stats
    const total_students = branch_data.reduce((sum, branch) => sum + branch.total_students, 0);
    const total_placed = branch_data.reduce((sum, branch) => sum + branch.placed_students, 0);
    const highest_package = Math.max(...branch_data.map(branch => branch.highest_package));
    
    const totalPackageSum = branch_data.reduce((sum, branch) => 
      sum + (branch.placed_students * branch.average_package), 0
    );
    const average_package = total_placed > 0 ? totalPackageSum / total_placed : 0;

    const processedData: ProcessedData = {
      year: new Date().getFullYear(),
      branch_data,
      overall_stats: {
        total_students,
        total_placed,
        placement_percentage: total_students > 0 ? (total_placed / total_students) * 100 : 0,
        total_companies: companiesSet.size,
        highest_package,
        average_package
      }
    };

    return processedData;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setUploadedData(results.data);
        const processed = processCSVData(results.data);
        setProcessedData(processed);
        setIsUploading(false);
        toast({
          title: 'File processed successfully',
          description: `${results.data.length} records loaded and processed`,
        });
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsUploading(false);
        toast({
          title: 'Upload failed',
          description: 'Error parsing the CSV file',
          variant: 'destructive',
        });
      }
    });
  };

  const saveToDatabase = async () => {
    if (!processedData || !selectedCollege) {
      toast({
        title: 'Error',
        description: 'Please select a college and process data first',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('placement_data')
        .insert({
          college_id: selectedCollege,
          file_name: fileName,
          data: processedData,
          schema_info: {
            columns: Object.keys(uploadedData[0] || {}),
            total_rows: uploadedData.length
          },
          uploaded_by: user?.id
        });

      if (error) throw error;

      toast({
        title: 'Data saved successfully',
        description: `Placement data has been saved to the database`,
      });
      
      // Clear form
      setUploadedData([]);
      setProcessedData(null);
      setFileName('');
      setSelectedCollege('');
      
      // Reload stats
      loadStats();
      
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast({
        title: 'Save failed',
        description: error.message || 'Failed to save data to database',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const exportCurrentData = async () => {
    try {
      const { data: placementData } = await supabase
        .from('placement_data')
        .select(`
          *,
          colleges (name, location)
        `);

      if (!placementData || placementData.length === 0) {
        toast({
          title: 'No data to export',
          description: 'There is no placement data in the database',
          variant: 'destructive',
        });
        return;
      }

      const csvRows = ['College,Branch,Year,Total Students,Placed Students,Placement %,Avg Package,Highest Package,Companies'];
      
      placementData.forEach(item => {
        const collegeName = (item.colleges as any)?.name || 'Unknown College';
        item.data.branch_data.forEach((branch: any) => {
          csvRows.push([
            collegeName,
            branch.branch,
            item.data.year,
            branch.total_students,
            branch.placed_students,
            ((branch.placed_students / branch.total_students) * 100).toFixed(2),
            branch.average_package.toFixed(2),
            branch.highest_package,
            branch.companies.join('; ')
          ].join(','));
        });
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `placement-data-export-${Date.now()}.csv`);
      
      toast({
        title: 'Export successful',
        description: 'Placement data exported successfully',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export failed',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  const clearUpload = () => {
    setUploadedData([]);
    setProcessedData(null);
    setFileName('');
    setSelectedCollege('');
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage placement data for your institution</p>
          {userProfile?.college_name && (
            <div className="flex items-center mt-2 text-sm text-primary">
              <Building className="h-4 w-4 mr-2" />
              {userProfile.college_name}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalRecords}</p>
                </div>
                <Database className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Colleges</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalColleges}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Branches</p>
                  <p className="text-2xl font-bold text-foreground">{stats.totalBranches}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover bg-gradient-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm font-bold text-foreground">{stats.lastUpdated}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-gradient-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <span>Upload Placement Data</span>
              </CardTitle>
              <CardDescription>Upload placement data in CSV format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="college-select">Select College</Label>
                <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                  <SelectTrigger className="glass-effect border-white/20">
                    <SelectValue placeholder="Choose a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name} {college.location && `- ${college.location}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvFile">Select CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="glass-effect border-white/20"
                  disabled={isUploading}
                />
              </div>
              
              {fileName && (
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <FileText className="h-4 w-4" />
                  <span>Loaded: {fileName}</span>
                </div>
              )}

              {isUploading && (
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing file...</span>
                </div>
              )}

              {processedData && (
                <div className="space-y-3">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm text-green-400 font-medium">Data Processed Successfully</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {processedData.overall_stats.total_students} students, {processedData.overall_stats.total_placed} placed ({processedData.overall_stats.placement_percentage.toFixed(1)}% placement rate)
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={saveToDatabase}
                      disabled={isSaving || !selectedCollege}
                      className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Save to Database
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={clearUpload}
                      variant="outline"
                      className="glass-effect border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-primary" />
                <span>Export Data</span>
              </CardTitle>
              <CardDescription>Download placement data from database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={exportCurrentData}
                className="w-full btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Data as CSV
              </Button>
              
              <div className="text-sm text-muted-foreground">
                <p>This will export all placement records from the database.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Preview */}
        {uploadedData.length > 0 && (
          <Card className="bg-gradient-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <span>Raw Data Preview</span>
              </CardTitle>
              <CardDescription>
                Preview of uploaded CSV data ({uploadedData.length} records)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(uploadedData[0] || {}).map(key => (
                        <TableHead key={key} className="text-foreground font-semibold">
                          {key}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index} className="hover:bg-white/5">
                        {Object.values(row).map((value: any, cellIndex) => (
                          <TableCell key={cellIndex} className="text-muted-foreground">
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {uploadedData.length > 10 && (
                <p className="text-sm text-muted-foreground mt-4">
                  Showing first 10 rows of {uploadedData.length} total records
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;