import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Star, Eye, Users, TrendingUp, DollarSign, Building2,
  Search, Filter, ArrowUpDown, GraduationCap, BarChart3, Loader2
} from "lucide-react";
import { getCollegeWiseData } from "@/services/database";

const AllColleges = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [sortBy, setSortBy] = useState("placementRate");
  const [collegeType, setCollegeType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch colleges from database
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const collegeData = await getCollegeWiseData();
        setColleges(collegeData);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Get search parameter from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  const filteredColleges = useMemo(() => {
    if (loading) return [];
    
    let data = [...colleges];
    
    // Filter by college type
    if (collegeType !== "all") {
      data = data.filter(college => 
        college.type.toLowerCase() === collegeType.toLowerCase()
      );
    }

    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      data = data.filter(college => (
        college.name.toLowerCase().includes(searchLower) ||
        college.location.toLowerCase().includes(searchLower) ||
        college.type.toLowerCase().includes(searchLower)
      ));
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
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return data;
  }, [colleges, loading, collegeType, searchTerm, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
          >
            Explore All Colleges
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Discover comprehensive placement insights across India's top engineering colleges.
          </motion.p>
        </div>

        {/* Filters */}
        <Card className="glass-effect border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search Colleges</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 glass-effect border-white/20 focus:border-primary/50"
                  />
                </div>
              </div>

              {/* College Type */}
              <div className="space-y-2">
                <Label>College Type</Label>
                <Select value={collegeType} onValueChange={setCollegeType}>
                  <SelectTrigger className="glass-effect border-white/20 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="glass-effect border-white/20 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">College Name</SelectItem>
                    <SelectItem value="placementRate">Placement Rate</SelectItem>
                    <SelectItem value="avgPackage">Average Package</SelectItem>
                    <SelectItem value="totalStudents">Total Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label>Academic Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="glass-effect border-white/20 focus:border-primary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2023-24</SelectItem>
                    <SelectItem value="2023">2022-23</SelectItem>
                    <SelectItem value="2022">2021-22</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredColleges.length} colleges
              {collegeType !== "all" && ` (${collegeType} only)`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading colleges...</span>
          </div>
        )}

        {/* College Cards Grid */}
        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredColleges.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No colleges found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setCollegeType("all");
                  }}
                  variant="outline"
                  className="glass-effect border-primary/30 hover:border-primary/50"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              filteredColleges.map((college, index) => (
                <motion.div key={college.id} variants={cardVariants}>
                  <Card className="glass-effect border-white/10 card-hover group h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                            {college.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {college.location}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={college.type === 'Government' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {college.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="text-2xl font-bold text-primary">
                            {college.placementRate.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Placement Rate</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                          <div className="text-2xl font-bold text-green-400">
                            ₹{(college.avgPackage / 100000).toFixed(1)}L
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Package</div>
                        </div>
                      </div>

                      {/* Additional Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{college.totalStudents} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{college.totalCompanies} companies</span>
                        </div>
                      </div>

                      {/* View Dashboard Button */}
                      <Button 
                        onClick={() => navigate(`/college/${college.id}`)}
                        className="w-full glass-effect border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Dashboard
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Overall Analytics CTA */}
        {!loading && filteredColleges.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Card className="glass-effect border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="py-8">
                <h3 className="text-xl font-semibold mb-2">Want to see overall trends?</h3>
                <p className="text-muted-foreground mb-4">
                  Explore comprehensive analytics across all colleges and compare placement trends.
                </p>
                <Button 
                  onClick={() => navigate('/overview')}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overall Analytics
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllColleges;