-- First, let's make uploaded_by nullable temporarily to insert sample data
ALTER TABLE public.placement_data ALTER COLUMN uploaded_by DROP NOT NULL;

-- Insert sample colleges
INSERT INTO public.colleges (name, location, code) VALUES
('Indian Institute of Technology Delhi', 'New Delhi', 'IITD'),
('Indian Institute of Technology Bombay', 'Mumbai', 'IITB'),
('Indian Institute of Technology Kanpur', 'Kanpur', 'IITK'),
('Indian Institute of Technology Madras', 'Chennai', 'IITM'),
('Indian Institute of Technology Kharagpur', 'Kharagpur', 'IITKGP'),
('National Institute of Technology Karnataka', 'Surathkal', 'NITK'),
('National Institute of Technology Trichy', 'Tiruchirappalli', 'NITT'),
('Birla Institute of Technology and Science', 'Pilani', 'BITS'),
('Delhi Technological University', 'New Delhi', 'DTU'),
('Netaji Subhas University of Technology', 'New Delhi', 'NSUT')
ON CONFLICT (code) DO NOTHING;

-- Insert sample placement data for top IITs
INSERT INTO public.placement_data (college_id, file_name, data, schema_info) 
SELECT 
  c.id,
  'placement_data_' || c.code || '_2024.json',
  jsonb_build_object(
    'year', 2024,
    'branch_data', jsonb_build_array(
      jsonb_build_object(
        'branch', 'Computer Science Engineering',
        'total_students', 120,
        'placed_students', 115,
        'highest_package', 55000000,
        'average_package', 18500000,
        'median_package', 16000000,
        'companies', jsonb_build_array('Google', 'Microsoft', 'Amazon', 'Adobe', 'Goldman Sachs')
      ),
      jsonb_build_object(
        'branch', 'Electronics and Communication Engineering', 
        'total_students', 90,
        'placed_students', 82,
        'highest_package', 32000000,
        'average_package', 14200000,
        'median_package', 12500000,
        'companies', jsonb_build_array('Intel', 'Qualcomm', 'Broadcom', 'Texas Instruments', 'Samsung')
      ),
      jsonb_build_object(
        'branch', 'Mechanical Engineering',
        'total_students', 110,
        'placed_students', 95,
        'highest_package', 28000000,
        'average_package', 12800000,
        'median_package', 11000000,
        'companies', jsonb_build_array('Tata Motors', 'Mahindra', 'L&T', 'Siemens', 'General Electric')
      ),
      jsonb_build_object(
        'branch', 'Electrical Engineering',
        'total_students', 85,
        'placed_students', 78,
        'highest_package', 30000000,
        'average_package', 13500000,
        'median_package', 12000000,
        'companies', jsonb_build_array('ABB', 'Schneider Electric', 'Siemens', 'General Electric', 'Honeywell')
      )
    ),
    'overall_stats', jsonb_build_object(
      'total_students', 405,
      'total_placed', 370,
      'placement_percentage', 91.4,
      'total_companies', 85,
      'highest_package', 55000000,
      'average_package', 15200000
    )
  ),
  jsonb_build_object(
    'columns', jsonb_build_array('branch', 'total_students', 'placed_students', 'highest_package', 'average_package', 'median_package', 'companies'),
    'data_types', jsonb_build_object(
      'branch', 'string',
      'total_students', 'number',
      'placed_students', 'number', 
      'highest_package', 'number',
      'average_package', 'number',
      'median_package', 'number',
      'companies', 'array'
    )
  )
FROM public.colleges c
WHERE c.code IN ('IITD', 'IITB', 'IITK', 'IITM', 'IITKGP')
ON CONFLICT DO NOTHING;