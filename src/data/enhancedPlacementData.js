// Enhanced placement data with more comprehensive information

export const colleges = [
  { 
    id: 1, 
    name: "IIT Delhi", 
    location: "New Delhi",
    established: 1961,
    type: "Government",
    ranking: 1,
    totalStudents: 8000,
    placementOfficer: "Dr. Rajesh Kumar"
  },
  { 
    id: 2, 
    name: "NIT Trichy", 
    location: "Tiruchirappalli",
    established: 1964,
    type: "Government", 
    ranking: 8,
    totalStudents: 6500,
    placementOfficer: "Prof. Meera Sharma"
  },
  { 
    id: 3, 
    name: "BITS Pilani", 
    location: "Pilani",
    established: 1964,
    type: "Private",
    ranking: 15,
    totalStudents: 4200,
    placementOfficer: "Dr. Anil Verma"
  },
  { 
    id: 4, 
    name: "VIT Vellore", 
    location: "Vellore",
    established: 1984,
    type: "Private",
    ranking: 25,
    totalStudents: 12000,
    placementOfficer: "Ms. Priya Nair"
  },
  { 
    id: 5, 
    name: "IIIT Hyderabad", 
    location: "Hyderabad",
    established: 1998,
    type: "Government",
    ranking: 12,
    totalStudents: 3500,
    placementOfficer: "Dr. Suresh Reddy"
  }
];

export const branches = [
  "Computer Science Engineering",
  "Electronics and Communication Engineering", 
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Information Technology",
  "Data Science"
];

export const companies = [
  { name: "Google", tier: "Tier 1", sector: "Technology", packageRange: [80, 200] },
  { name: "Microsoft", tier: "Tier 1", sector: "Technology", packageRange: [75, 180] },
  { name: "Amazon", tier: "Tier 1", sector: "Technology", packageRange: [70, 150] },
  { name: "Apple", tier: "Tier 1", sector: "Technology", packageRange: [85, 220] },
  { name: "Meta", tier: "Tier 1", sector: "Technology", packageRange: [90, 210] },
  { name: "Netflix", tier: "Tier 1", sector: "Technology", packageRange: [95, 250] },
  { name: "Adobe", tier: "Tier 1", sector: "Technology", packageRange: [65, 140] },
  { name: "Salesforce", tier: "Tier 1", sector: "Technology", packageRange: [70, 160] },
  { name: "Goldman Sachs", tier: "Tier 1", sector: "Finance", packageRange: [85, 190] },
  { name: "JPMorgan Chase", tier: "Tier 1", sector: "Finance", packageRange: [80, 170] },
  { name: "Morgan Stanley", tier: "Tier 1", sector: "Finance", packageRange: [75, 165] },
  { name: "Deloitte", tier: "Tier 2", sector: "Consulting", packageRange: [35, 80] },
  { name: "TCS", tier: "Tier 2", sector: "Technology", packageRange: [8, 25] },
  { name: "Infosys", tier: "Tier 2", sector: "Technology", packageRange: [10, 30] },
  { name: "Wipro", tier: "Tier 2", sector: "Technology", packageRange: [8, 28] },
  { name: "Accenture", tier: "Tier 2", sector: "Consulting", packageRange: [15, 45] },
  { name: "IBM", tier: "Tier 2", sector: "Technology", packageRange: [20, 50] },
  { name: "Capgemini", tier: "Tier 2", sector: "Technology", packageRange: [12, 35] },
  { name: "L&T", tier: "Tier 3", sector: "Construction", packageRange: [6, 18] },
  { name: "Mahindra", tier: "Tier 3", sector: "Automotive", packageRange: [8, 22] },
  { name: "Bajaj", tier: "Tier 3", sector: "Finance", packageRange: [10, 25] }
];

// Generate comprehensive placement data
const generatePlacementData = () => {
  const data = [];
  const years = [2020, 2021, 2022, 2023, 2024];
  
  colleges.forEach(college => {
    branches.forEach(branch => {
      years.forEach(year => {
        const baseStudents = Math.floor(Math.random() * 100) + 50;
        const placementRate = 0.6 + (Math.random() * 0.35); // 60-95%
        const placedStudents = Math.floor(baseStudents * placementRate);
        
        // Generate company-wise placements
        const companyPlacements = [];
        let remainingPlacements = placedStudents;
        
        // Shuffle companies and assign placements
        const shuffledCompanies = [...companies].sort(() => Math.random() - 0.5);
        const numCompanies = Math.min(8 + Math.floor(Math.random() * 5), shuffledCompanies.length);
        
        for (let i = 0; i < numCompanies && remainingPlacements > 0; i++) {
          const company = shuffledCompanies[i];
          const placements = Math.min(
            Math.floor(Math.random() * Math.min(remainingPlacements, 15)) + 1,
            remainingPlacements
          );
          
          const [minPkg, maxPkg] = company.packageRange;
          const avgPackage = minPkg + (Math.random() * (maxPkg - minPkg));
          
          companyPlacements.push({
            company: company.name,
            tier: company.tier,
            sector: company.sector,
            placements,
            avgPackage: Math.round(avgPackage * 100) / 100,
            minPackage: Math.round((avgPackage * 0.8) * 100) / 100,
            maxPackage: Math.round((avgPackage * 1.4) * 100) / 100
          });
          
          remainingPlacements -= placements;
        }
        
        // Calculate statistics
        const packages = companyPlacements.map(cp => cp.avgPackage);
        const avgPackage = packages.length > 0 ? packages.reduce((a, b) => a + b, 0) / packages.length : 0;
        const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;
        const lowestPackage = packages.length > 0 ? Math.min(...packages) : 0;
        
        data.push({
          id: `${college.id}-${branch}-${year}`,
          collegeId: college.id,
          collegeName: college.name,
          branch,
          year,
          totalStudents: baseStudents,
          placedStudents,
          placementRate: Math.round(placementRate * 100),
          avgPackage: Math.round(avgPackage * 100) / 100,
          highestPackage: Math.round(highestPackage * 100) / 100,
          lowestPackage: Math.round(lowestPackage * 100) / 100,
          medianPackage: Math.round(avgPackage * 0.9 * 100) / 100,
          avgCGPA: 7.5 + (Math.random() * 1.5), // 7.5-9.0
          companyPlacements,
          internshipOffers: Math.floor(baseStudents * 0.8),
          ppoRate: Math.round((Math.random() * 0.4 + 0.3) * 100), // 30-70%
          higherStudies: Math.floor(baseStudents * (Math.random() * 0.2 + 0.05)), // 5-25%
          unplaced: baseStudents - placedStudents
        });
      });
    });
  });
  
  return data;
};

export const placementData = generatePlacementData();

// Utility functions
export const getPlacementStats = () => {
  const currentYearData = placementData.filter(d => d.year === 2024);
  const totalOffers = currentYearData.reduce((sum, d) => sum + d.placedStudents, 0);
  const totalStudents = currentYearData.reduce((sum, d) => sum + d.totalStudents, 0);
  const avgPackage = currentYearData.reduce((sum, d) => sum + d.avgPackage, 0) / currentYearData.length;
  const uniqueCompanies = new Set();
  
  currentYearData.forEach(d => {
    d.companyPlacements.forEach(cp => uniqueCompanies.add(cp.company));
  });
  
  return {
    totalOffers,
    placementRate: Math.round((totalOffers / totalStudents) * 100),
    avgPackage: Math.round(avgPackage * 100) / 100,
    totalCompanies: uniqueCompanies.size,
    totalStudents
  };
};

export const getCollegePlacementData = (collegeId, filters = {}) => {
  let data = placementData.filter(d => d.collegeId === collegeId);
  
  // Apply filters
  if (filters.year) {
    data = data.filter(d => d.year === parseInt(filters.year));
  }
  if (filters.branch) {
    data = data.filter(d => d.branch === filters.branch);
  }
  if (filters.minCGPA) {
    data = data.filter(d => d.avgCGPA >= parseFloat(filters.minCGPA));
  }
  if (filters.minPackage) {
    data = data.filter(d => d.avgPackage >= parseFloat(filters.minPackage));
  }
  if (filters.maxPackage) {
    data = data.filter(d => d.avgPackage <= parseFloat(filters.maxPackage));
  }
  
  return data;
};

export const getBranchWiseData = (collegeId = null, year = 2024) => {
  let data = placementData.filter(d => d.year === year);
  if (collegeId) {
    data = data.filter(d => d.collegeId === collegeId);
  }
  
  const branchStats = {};
  data.forEach(d => {
    if (!branchStats[d.branch]) {
      branchStats[d.branch] = {
        branch: d.branch,
        totalStudents: 0,
        placedStudents: 0,
        totalPackage: 0,
        count: 0,
        highestPackage: 0
      };
    }
    
    branchStats[d.branch].totalStudents += d.totalStudents;
    branchStats[d.branch].placedStudents += d.placedStudents;
    branchStats[d.branch].totalPackage += d.avgPackage;
    branchStats[d.branch].count += 1;
    branchStats[d.branch].highestPackage = Math.max(branchStats[d.branch].highestPackage, d.highestPackage);
  });
  
  return Object.values(branchStats).map(stat => ({
    ...stat,
    placementRate: Math.round((stat.placedStudents / stat.totalStudents) * 100),
    avgPackage: Math.round((stat.totalPackage / stat.count) * 100) / 100
  }));
};

export const getCollegeWiseData = (year = 2024) => {
  const data = placementData.filter(d => d.year === year);
  const collegeStats = {};
  
  data.forEach(d => {
    if (!collegeStats[d.collegeId]) {
      collegeStats[d.collegeId] = {
        collegeId: d.collegeId,
        collegeName: d.collegeName,
        totalStudents: 0,
        placedStudents: 0,
        totalPackage: 0,
        count: 0,
        highestPackage: 0,
        companies: new Set()
      };
    }
    
    collegeStats[d.collegeId].totalStudents += d.totalStudents;
    collegeStats[d.collegeId].placedStudents += d.placedStudents;
    collegeStats[d.collegeId].totalPackage += d.avgPackage;
    collegeStats[d.collegeId].count += 1;
    collegeStats[d.collegeId].highestPackage = Math.max(collegeStats[d.collegeId].highestPackage, d.highestPackage);
    
    d.companyPlacements.forEach(cp => {
      collegeStats[d.collegeId].companies.add(cp.company);
    });
  });
  
  return Object.values(collegeStats).map(stat => ({
    ...stat,
    placementRate: Math.round((stat.placedStudents / stat.totalStudents) * 100),
    avgPackage: Math.round((stat.totalPackage / stat.count) * 100) / 100,
    totalCompanies: stat.companies.size
  }));
};

export const getTrendData = (collegeId = null) => {
  const years = [2020, 2021, 2022, 2023, 2024];
  
  return years.map(year => {
    let data = placementData.filter(d => d.year === year);
    if (collegeId) {
      data = data.filter(d => d.collegeId === collegeId);
    }
    
    const totalStudents = data.reduce((sum, d) => sum + d.totalStudents, 0);
    const placedStudents = data.reduce((sum, d) => sum + d.placedStudents, 0);
    const avgPackage = data.length > 0 ? data.reduce((sum, d) => sum + d.avgPackage, 0) / data.length : 0;
    const highestPackage = data.length > 0 ? Math.max(...data.map(d => d.highestPackage)) : 0;
    
    return {
      year,
      totalStudents,
      placedStudents,
      placementRate: totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0,
      avgPackage: Math.round(avgPackage * 100) / 100,
      highestPackage: Math.round(highestPackage * 100) / 100
    };
  });
};

export const getTopRecruiters = (collegeId = null, year = 2024, limit = 10) => {
  let data = placementData.filter(d => d.year === year);
  if (collegeId) {
    data = data.filter(d => d.collegeId === collegeId);
  }
  
  const recruiterStats = {};
  
  data.forEach(d => {
    d.companyPlacements.forEach(cp => {
      if (!recruiterStats[cp.company]) {
        recruiterStats[cp.company] = {
          company: cp.company,
          tier: cp.tier,
          sector: cp.sector,
          totalPlacements: 0,
          totalPackage: 0,
          count: 0,
          highestPackage: 0
        };
      }
      
      recruiterStats[cp.company].totalPlacements += cp.placements;
      recruiterStats[cp.company].totalPackage += cp.avgPackage * cp.placements;
      recruiterStats[cp.company].count += cp.placements;
      recruiterStats[cp.company].highestPackage = Math.max(recruiterStats[cp.company].highestPackage, cp.maxPackage);
    });
  });
  
  return Object.values(recruiterStats)
    .map(stat => ({
      ...stat,
      avgPackage: Math.round((stat.totalPackage / stat.count) * 100) / 100
    }))
    .sort((a, b) => b.totalPlacements - a.totalPlacements)
    .slice(0, limit);
};

export const getSectorWiseData = (collegeId = null, year = 2024) => {
  let data = placementData.filter(d => d.year === year);
  if (collegeId) {
    data = data.filter(d => d.collegeId === collegeId);
  }
  
  const sectorStats = {};
  
  data.forEach(d => {
    d.companyPlacements.forEach(cp => {
      if (!sectorStats[cp.sector]) {
        sectorStats[cp.sector] = {
          sector: cp.sector,
          placements: 0,
          companies: new Set(),
          totalPackage: 0,
          count: 0
        };
      }
      
      sectorStats[cp.sector].placements += cp.placements;
      sectorStats[cp.sector].companies.add(cp.company);
      sectorStats[cp.sector].totalPackage += cp.avgPackage * cp.placements;
      sectorStats[cp.sector].count += cp.placements;
    });
  });
  
  return Object.values(sectorStats)
    .map(stat => ({
      sector: stat.sector,
      placements: stat.placements,
      companies: stat.companies.size,
      avgPackage: stat.count > 0 ? Math.round((stat.totalPackage / stat.count) * 100) / 100 : 0
    }))
    .sort((a, b) => b.placements - a.placements);
};