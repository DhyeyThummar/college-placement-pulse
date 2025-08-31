import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  FileText, 
  Database,
  Users,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { placementData } from '../data/placementData';

const AdminDashboard = () => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setUploadedData(results.data);
        setIsUploading(false);
        toast({
          title: 'File uploaded successfully',
          description: `${results.data.length} records loaded from ${file.name}`,
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

  const confirmImport = () => {
    // In a real application, this would save to a database
    localStorage.setItem('uploadedPlacementData', JSON.stringify(uploadedData));
    
    toast({
      title: 'Data imported successfully',
      description: `${uploadedData.length} records have been imported to the system`,
    });
    
    setUploadedData([]);
    setFileName('');
  };

  const exportCurrentData = () => {
    const csvContent = [
      ['College', 'Branch', 'Year', 'Offers', 'Avg Package', 'Highest Package', 'Min CGPA', 'Total Students'],
      ...placementData.map(item => [
        item.college,
        item.branch,
        item.year,
        item.offers,
        item.avgPackage,
        item.highestPackage,
        item.minCGPA,
        item.totalStudents
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `placement-data-export-${Date.now()}.csv`);
  };

  const clearUpload = () => {
    setUploadedData([]);
    setFileName('');
  };

  const stats = {
    totalRecords: placementData.length,
    totalColleges: new Set(placementData.map(item => item.college)).size,
    totalBranches: new Set(placementData.map(item => item.branch)).size,
    lastUpdated: new Date().toLocaleDateString()
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage placement data and system configuration</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Branches</p>
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
                <span>Upload CSV Data</span>
              </CardTitle>
              <CardDescription>Upload placement data in CSV format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvFile">Select CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
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
                  <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <span>Processing file...</span>
                </div>
              )}

              {uploadedData.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    onClick={confirmImport}
                    className="btn-hover bg-gradient-primary hover:opacity-90 text-white border-0"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Import ({uploadedData.length} records)
                  </Button>
                  <Button
                    onClick={clearUpload}
                    variant="outline"
                    className="glass-effect border-destructive/30 hover:border-destructive/50 hover:bg-destructive/10"
                  >
                    Clear
                  </Button>
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
              <CardDescription>Download current placement data</CardDescription>
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
                <p>This will export all placement records currently in the system.</p>
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
                <span>Data Preview</span>
              </CardTitle>
              <CardDescription>
                Preview of uploaded data ({uploadedData.length} records)
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