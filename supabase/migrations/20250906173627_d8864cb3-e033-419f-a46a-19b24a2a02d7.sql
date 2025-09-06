-- Add unique constraint to colleges code column 
ALTER TABLE public.colleges ADD CONSTRAINT colleges_code_unique UNIQUE (code);

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