import { supabase } from '@/integrations/supabase/client';

export interface College {
  id: string;
  name: string;
  location?: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface PlacementData {
  id: string;
  college_id: string;
  file_name: string;
  data: {
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
  };
  upload_date: string;
}

export interface CollegeWithPlacement extends College {
  placement_data?: PlacementData[];
}

// Get all colleges
export const getColleges = async (): Promise<College[]> => {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching colleges:', error);
    return [];
  }
  
  return data || [];
};

// Get college by ID
export const getCollegeById = async (id: string): Promise<CollegeWithPlacement | null> => {
  const { data: college, error: collegeError } = await supabase
    .from('colleges')
    .select('*')
    .eq('id', id)
    .single();
  
  if (collegeError) {
    console.error('Error fetching college:', collegeError);
    return null;
  }
  
  const { data: placementData, error: placementError } = await supabase
    .from('placement_data')
    .select('*')
    .eq('college_id', id);
  
  if (placementError) {
    console.error('Error fetching placement data:', placementError);
  }
  
  return {
    ...college,
    placement_data: placementData || []
  };
};

// Get colleges with their placement data
export const getCollegesWithPlacement = async (): Promise<CollegeWithPlacement[]> => {
  const { data: colleges, error: collegesError } = await supabase
    .from('colleges')
    .select('*')
    .order('name');
  
  if (collegesError) {
    console.error('Error fetching colleges:', collegesError);
    return [];
  }
  
  const { data: placementData, error: placementError } = await supabase
    .from('placement_data')
    .select('*');
  
  if (placementError) {
    console.error('Error fetching placement data:', placementError);
    return colleges || [];
  }
  
  // Map placement data to colleges
  const collegesWithPlacement = (colleges || []).map(college => ({
    ...college,
    placement_data: (placementData || []).filter(pd => pd.college_id === college.id)
  }));
  
  return collegesWithPlacement;
};

// Get overall placement statistics
export const getPlacementStats = async () => {
  const { data: placementData, error } = await supabase
    .from('placement_data')
    .select('data');
  
  if (error) {
    console.error('Error fetching placement stats:', error);
    return {
      totalOffers: 0,
      placementRate: 0,
      avgPackage: 0,
      totalCompanies: 0
    };
  }
  
  if (!placementData || placementData.length === 0) {
    return {
      totalOffers: 0,
      placementRate: 0,
      avgPackage: 0,
      totalCompanies: 0
    };
  }
  
  let totalStudents = 0;
  let totalPlaced = 0;
  let totalPackageSum = 0;
  let companiesSet = new Set<string>();
  
  placementData.forEach(pd => {
    const stats = pd.data.overall_stats;
    totalStudents += stats.total_students;
    totalPlaced += stats.total_placed;
    totalPackageSum += stats.average_package * stats.total_placed;
    
    pd.data.branch_data.forEach(branch => {
      branch.companies.forEach(company => companiesSet.add(company));
    });
  });
  
  return {
    totalOffers: totalPlaced,
    placementRate: totalStudents > 0 ? (totalPlaced / totalStudents) * 100 : 0,
    avgPackage: totalPlaced > 0 ? totalPackageSum / totalPlaced : 0,
    totalCompanies: companiesSet.size
  };
};

// Get branch-wise data across all colleges
export const getBranchWiseData = async () => {
  const { data: placementData, error } = await supabase
    .from('placement_data')
    .select('data');
  
  if (error) {
    console.error('Error fetching branch-wise data:', error);
    return [];
  }
  
  const branchMap = new Map();
  
  placementData?.forEach(pd => {
    pd.data.branch_data.forEach(branch => {
      if (!branchMap.has(branch.branch)) {
        branchMap.set(branch.branch, {
          branch: branch.branch,
          totalStudents: 0,
          placedStudents: 0,
          totalPackageSum: 0,
          highestPackage: 0,
          companies: new Set<string>()
        });
      }
      
      const existing = branchMap.get(branch.branch);
      existing.totalStudents += branch.total_students;
      existing.placedStudents += branch.placed_students;
      existing.totalPackageSum += branch.average_package * branch.placed_students;
      existing.highestPackage = Math.max(existing.highestPackage, branch.highest_package);
      branch.companies.forEach(company => existing.companies.add(company));
    });
  });
  
  return Array.from(branchMap.values()).map(branch => ({
    branch: branch.branch,
    totalStudents: branch.totalStudents,
    placedStudents: branch.placedStudents,
    placementRate: branch.totalStudents > 0 ? (branch.placedStudents / branch.totalStudents) * 100 : 0,
    avgPackage: branch.placedStudents > 0 ? branch.totalPackageSum / branch.placedStudents : 0,
    highestPackage: branch.highestPackage,
    companies: Array.from(branch.companies)
  }));
};

// Get college-wise placement data
export const getCollegeWiseData = async () => {
  const colleges = await getCollegesWithPlacement();
  
  return colleges.map(college => {
    if (!college.placement_data || college.placement_data.length === 0) {
      return {
        id: college.id,
        name: college.name,
        location: college.location || '',
        code: college.code || '',
        totalStudents: 0,
        placedStudents: 0,
        placementRate: 0,
        avgPackage: 0,
        highestPackage: 0,
        totalCompanies: 0,
        type: 'Government' // Default type
      };
    }
    
    const latestData = college.placement_data[0].data.overall_stats;
    return {
      id: college.id,
      name: college.name,
      location: college.location || '',
      code: college.code || '',
      totalStudents: latestData.total_students,
      placedStudents: latestData.total_placed,
      placementRate: latestData.placement_percentage,
      avgPackage: latestData.average_package,
      highestPackage: latestData.highest_package,
      totalCompanies: latestData.total_companies,
      type: college.name.includes('IIT') || college.name.includes('NIT') ? 'Government' : 'Private'
    };
  });
};