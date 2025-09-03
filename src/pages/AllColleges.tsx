import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Calendar, Star, Eye, Users, TrendingUp, DollarSign, Building2,
  Search, Filter, ArrowUpDown, GraduationCap, BarChart3
} from "lucide-react";
import { 
  colleges, getCollegeWiseData
} from "@/data/enhancedPlacementData";

const AllColleges = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [sortBy, setSortBy] = useState("placementRate");
  const [collegeType, setCollegeType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get search parameter from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const collegeData = useMemo(() => {
    let data = getCollegeWiseData(parseInt(selectedYear));
    
    // Filter by college type
    if (collegeType !== "all") {
      data = data.filter(d => {
        const college = colleges.find(c => c.id === d.collegeId);
        return college?.type === collegeType;
      });
    }

    // Enhanced search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      data = data.filter(d => {
        const college = colleges.find(c => c.id === d.collegeId);
        return (
          // Search by college name
          d.collegeName.toLowerCase().includes(searchLower) ||
          // Search by location
          college?.location?.toLowerCase().includes(searchLower) ||
          // Search by college type
          college?.type?.toLowerCase().includes(searchLower) ||
          // Search by placement officer (if available)
          college?.placementOfficer?.toLowerCase().includes(searchLower)
        );
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
  }, [selectedYear, sortBy, collegeType, searchTerm]);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            All Colleges
          </h1>
          <p className="text-muted-foreground">
            Browse and explore detailed dashboards for each participating college
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8 glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Colleges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Colleges</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
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
              
              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  onClick={() => navigate('/overview')}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overall Analytics
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {collegeData.length} colleges for {selectedYear}
            {collegeType !== "all" && ` (${collegeType} only)`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* College Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collegeData.map((college, index) => {
            const collegeInfo = colleges.find(c => c.id === college.collegeId);
            return (
              <Card key={college.collegeId} className="glass-effect border-white/10 card-hover group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {college.collegeName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {collegeInfo?.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant={collegeInfo?.type === "Government" ? "default" : "secondary"}>
                        {collegeInfo?.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rank #{collegeInfo?.ranking}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-primary">{college.placementRate}%</div>
                        <div className="text-xs text-muted-foreground">Placement Rate</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-2xl font-bold text-primary">₹{college.avgPackage}</div>
                        <div className="text-xs text-muted-foreground">Avg Package</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
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
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Top Recruiter</span>
                        <span className="font-semibold text-primary">{college.topRecruiter}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex gap-2">
                    <Button 
                      onClick={() => navigate(`/college/${college.collegeId}`)}
                      className="flex-1 bg-gradient-primary hover:opacity-90"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {collegeData.length === 0 && (
          <Card className="glass-effect border-white/10 text-center py-12">
            <CardContent>
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No colleges found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setCollegeType("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AllColleges;