// Sample placement data for the application
export const colleges = [
  { id: 1, name: 'IIT Delhi', location: 'Delhi' },
  { id: 2, name: 'IIT Bombay', location: 'Mumbai' },
  { id: 3, name: 'IIT Madras', location: 'Chennai' },
  { id: 4, name: 'IIT Kanpur', location: 'Kanpur' },
  { id: 5, name: 'NIT Trichy', location: 'Trichy' },
  { id: 6, name: 'BITS Pilani', location: 'Pilani' },
  { id: 7, name: 'DTU', location: 'Delhi' },
  { id: 8, name: 'NSIT', location: 'Delhi' }
];

export const branches = [
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Information Technology',
  'Aerospace Engineering'
];

export const placementData = [
  // IIT Delhi
  { collegeId: 1, college: 'IIT Delhi', branch: 'Computer Science', year: 2024, offers: 45, avgPackage: 2800000, highestPackage: 5500000, minCGPA: 8.5, totalStudents: 50 },
  { collegeId: 1, college: 'IIT Delhi', branch: 'Electronics & Communication', year: 2024, offers: 38, avgPackage: 2200000, highestPackage: 4200000, minCGPA: 8.0, totalStudents: 42 },
  { collegeId: 1, college: 'IIT Delhi', branch: 'Mechanical Engineering', year: 2024, offers: 35, avgPackage: 1800000, highestPackage: 3500000, minCGPA: 7.5, totalStudents: 40 },
  
  // IIT Bombay
  { collegeId: 2, college: 'IIT Bombay', branch: 'Computer Science', year: 2024, offers: 48, avgPackage: 3000000, highestPackage: 6000000, minCGPA: 8.8, totalStudents: 52 },
  { collegeId: 2, college: 'IIT Bombay', branch: 'Electronics & Communication', year: 2024, offers: 40, avgPackage: 2400000, highestPackage: 4500000, minCGPA: 8.2, totalStudents: 45 },
  { collegeId: 2, college: 'IIT Bombay', branch: 'Mechanical Engineering', year: 2024, offers: 37, avgPackage: 2000000, highestPackage: 3800000, minCGPA: 7.8, totalStudents: 42 },
  
  // IIT Madras
  { collegeId: 3, college: 'IIT Madras', branch: 'Computer Science', year: 2024, offers: 46, avgPackage: 2900000, highestPackage: 5800000, minCGPA: 8.6, totalStudents: 50 },
  { collegeId: 3, college: 'IIT Madras', branch: 'Electronics & Communication', year: 2024, offers: 39, avgPackage: 2300000, highestPackage: 4300000, minCGPA: 8.1, totalStudents: 44 },
  { collegeId: 3, college: 'IIT Madras', branch: 'Aerospace Engineering', year: 2024, offers: 25, avgPackage: 2100000, highestPackage: 4000000, minCGPA: 8.0, totalStudents: 30 },
  
  // NIT Trichy
  { collegeId: 5, college: 'NIT Trichy', branch: 'Computer Science', year: 2024, offers: 42, avgPackage: 1800000, highestPackage: 3500000, minCGPA: 8.0, totalStudents: 48 },
  { collegeId: 5, college: 'NIT Trichy', branch: 'Electronics & Communication', year: 2024, offers: 35, avgPackage: 1400000, highestPackage: 2800000, minCGPA: 7.5, totalStudents: 40 },
  { collegeId: 5, college: 'NIT Trichy', branch: 'Mechanical Engineering', year: 2024, offers: 30, avgPackage: 1200000, highestPackage: 2500000, minCGPA: 7.0, totalStudents: 38 },
  
  // BITS Pilani
  { collegeId: 6, college: 'BITS Pilani', branch: 'Computer Science', year: 2024, offers: 40, avgPackage: 1600000, highestPackage: 3200000, minCGPA: 7.8, totalStudents: 45 },
  { collegeId: 6, college: 'BITS Pilani', branch: 'Electronics & Communication', year: 2024, offers: 33, avgPackage: 1300000, highestPackage: 2600000, minCGPA: 7.3, totalStudents: 38 },
  { collegeId: 6, college: 'BITS Pilani', branch: 'Information Technology', year: 2024, offers: 36, avgPackage: 1500000, highestPackage: 3000000, minCGPA: 7.6, totalStudents: 40 },

  // Historical data for trend analysis
  // 2023 data
  { collegeId: 1, college: 'IIT Delhi', branch: 'Computer Science', year: 2023, offers: 42, avgPackage: 2600000, highestPackage: 5200000, minCGPA: 8.3, totalStudents: 48 },
  { collegeId: 2, college: 'IIT Bombay', branch: 'Computer Science', year: 2023, offers: 45, avgPackage: 2800000, highestPackage: 5700000, minCGPA: 8.5, totalStudents: 50 },
  { collegeId: 3, college: 'IIT Madras', branch: 'Computer Science', year: 2023, offers: 44, avgPackage: 2700000, highestPackage: 5500000, minCGPA: 8.4, totalStudents: 48 },
  
  // 2022 data
  { collegeId: 1, college: 'IIT Delhi', branch: 'Computer Science', year: 2022, offers: 40, avgPackage: 2400000, highestPackage: 4800000, minCGPA: 8.0, totalStudents: 45 },
  { collegeId: 2, college: 'IIT Bombay', branch: 'Computer Science', year: 2022, offers: 43, avgPackage: 2600000, highestPackage: 5300000, minCGPA: 8.2, totalStudents: 48 },
  { collegeId: 3, college: 'IIT Madras', branch: 'Computer Science', year: 2022, offers: 41, avgPackage: 2500000, highestPackage: 5100000, minCGPA: 8.1, totalStudents: 46 },
];

export const companies = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Adobe', 'Salesforce',
  'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'Barclays', 'Deutsche Bank',
  'Flipkart', 'Zomato', 'Paytm', 'Ola', 'Swiggy', 'BYJU\'S', 'Unacademy',
  'TCS', 'Infosys', 'Wipro', 'HCL', 'Cognizant', 'Accenture', 'IBM'
];

export const getPlacementStats = () => {
  const currentYearData = placementData.filter(item => item.year === 2024);
  const totalOffers = currentYearData.reduce((sum, item) => sum + item.offers, 0);
  const totalStudents = currentYearData.reduce((sum, item) => sum + item.totalStudents, 0);
  const avgPackage = Math.round(currentYearData.reduce((sum, item) => sum + item.avgPackage, 0) / currentYearData.length / 100000);
  
  return {
    totalOffers,
    placementRate: Math.round((totalOffers / totalStudents) * 100),
    avgPackage: `${avgPackage} LPA`,
    totalCompanies: companies.length
  };
};

export const getBranchWiseData = () => {
  const branchStats = {};
  placementData.filter(item => item.year === 2024).forEach(item => {
    if (!branchStats[item.branch]) {
      branchStats[item.branch] = { offers: 0, students: 0, totalPackage: 0, count: 0 };
    }
    branchStats[item.branch].offers += item.offers;
    branchStats[item.branch].students += item.totalStudents;
    branchStats[item.branch].totalPackage += item.avgPackage;
    branchStats[item.branch].count += 1;
  });

  return Object.entries(branchStats).map(([branch, stats]) => ({
    branch,
    offers: stats.offers,
    students: stats.students,
    placementRate: Math.round((stats.offers / stats.students) * 100),
    avgPackage: Math.round(stats.totalPackage / stats.count / 100000)
  }));
};

export const getCollegeWiseData = () => {
  const collegeStats = {};
  placementData.filter(item => item.year === 2024).forEach(item => {
    if (!collegeStats[item.college]) {
      collegeStats[item.college] = { offers: 0, students: 0, totalPackage: 0, count: 0 };
    }
    collegeStats[item.college].offers += item.offers;
    collegeStats[item.college].students += item.totalStudents;
    collegeStats[item.college].totalPackage += item.avgPackage;
    collegeStats[item.college].count += 1;
  });

  return Object.entries(collegeStats).map(([college, stats]) => ({
    college,
    offers: stats.offers,
    students: stats.students,
    placementRate: Math.round((stats.offers / stats.students) * 100),
    avgPackage: Math.round(stats.totalPackage / stats.count / 100000)
  }));
};

export const getTrendData = () => {
  const yearStats = {};
  placementData.forEach(item => {
    if (!yearStats[item.year]) {
      yearStats[item.year] = { offers: 0, students: 0, totalPackage: 0, count: 0 };
    }
    yearStats[item.year].offers += item.offers;
    yearStats[item.year].students += item.totalStudents;
    yearStats[item.year].totalPackage += item.avgPackage;
    yearStats[item.year].count += 1;
  });

  return Object.entries(yearStats).map(([year, stats]) => ({
    year: parseInt(year),
    offers: stats.offers,
    students: stats.students,
    placementRate: Math.round((stats.offers / stats.students) * 100),
    avgPackage: Math.round(stats.totalPackage / stats.count / 100000)
  })).sort((a, b) => a.year - b.year);
};