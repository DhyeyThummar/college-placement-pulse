import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, Brain, TrendingUp, Award, AlertCircle, CheckCircle,
  GraduationCap, Building2, DollarSign, Users
} from 'lucide-react';
import { colleges, branches, placementData } from '@/data/placementData';

const PlacementPredictor = () => {
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    cgpa: '',
    skills: '',
    projects: '',
    internships: '0',
    certifications: '0'
  });

  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const calculatePrediction = () => {
    if (!formData.college || !formData.branch || !formData.cgpa) {
      return;
    }

    const collegeData = placementData.filter(
      p => p.collegeId === parseInt(formData.college) && 
          p.branch === formData.branch &&
          p.year >= 2022
    );

    if (collegeData.length === 0) return;

    const avgPlacementRate = collegeData.reduce((sum, p) => 
      sum + ((p.offers / p.totalStudents) * 100), 0) / collegeData.length;
    
    const avgPackage = collegeData.reduce((sum, p) => sum + p.avgPackage, 0) / collegeData.length;
    
    const minCGPA = Math.min(...collegeData.map(p => p.minCGPA));
    
    // Prediction algorithm
    let probabilityScore = 50; // Base score
    const cgpa = parseFloat(formData.cgpa);
    
    // CGPA factor
    if (cgpa >= minCGPA + 1) probabilityScore += 25;
    else if (cgpa >= minCGPA) probabilityScore += 15;
    else if (cgpa >= minCGPA - 0.5) probabilityScore += 5;
    else probabilityScore -= 20;
    
    // Additional factors
    if (parseInt(formData.projects) >= 3) probabilityScore += 15;
    else if (parseInt(formData.projects) >= 1) probabilityScore += 8;
    
    if (parseInt(formData.internships) >= 2) probabilityScore += 12;
    else if (parseInt(formData.internships) >= 1) probabilityScore += 6;
    
    if (parseInt(formData.certifications) >= 3) probabilityScore += 10;
    else if (parseInt(formData.certifications) >= 1) probabilityScore += 5;
    
    // Skills factor (basic keyword matching)
    const skillKeywords = ['python', 'java', 'react', 'javascript', 'machine learning', 'data science'];
    const userSkills = formData.skills.toLowerCase();
    const matchedSkills = skillKeywords.filter(skill => userSkills.includes(skill));
    probabilityScore += matchedSkills.length * 3;
    
    // Cap at 95%
    probabilityScore = Math.min(95, Math.max(5, probabilityScore));
    
    const expectedPackage = avgPackage * (probabilityScore / 100);
    
    setPrediction({
      probability: Math.round(probabilityScore),
      expectedPackage: Math.round(expectedPackage / 100000),
      avgCollegePlacement: Math.round(avgPlacementRate),
      recommendations: generateRecommendations(cgpa, formData),
      collegeName: colleges.find(c => c.id === parseInt(formData.college))?.name || '',
      branchName: formData.branch
    });
  };

  const generateRecommendations = (cgpa: number, data: any) => {
    const recommendations = [];
    
    if (cgpa < 7.5) {
      recommendations.push({
        type: 'warning',
        text: 'Focus on improving academic performance. Many companies have CGPA cutoffs around 7.5-8.0'
      });
    }
    
    if (parseInt(data.projects) < 2) {
      recommendations.push({
        type: 'info',
        text: 'Build more projects showcasing your technical skills. Aim for at least 2-3 substantial projects'
      });
    }
    
    if (parseInt(data.internships) === 0) {
      recommendations.push({
        type: 'info',
        text: 'Try to get internship experience. It significantly boosts placement chances'
      });
    }
    
    if (!data.skills || data.skills.length < 10) {
      recommendations.push({
        type: 'info',
        text: 'Develop in-demand technical skills like programming languages, frameworks, and tools'
      });
    }
    
    recommendations.push({
      type: 'success',
      text: 'Practice coding problems regularly and participate in competitive programming'
    });
    
    return recommendations;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Placement Probability Predictor
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered insights into your placement chances based on your academic profile and skills
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Form */}
          <motion.div variants={itemVariants}>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  Fill in your details to get personalized placement predictions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="college">College</Label>
                    <Select value={formData.college} onValueChange={(value) => handleInputChange('college', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map(college => (
                          <SelectItem key={college.id} value={college.id.toString()}>
                            {college.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select value={formData.branch} onValueChange={(value) => handleInputChange('branch', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cgpa">Current CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      max="10"
                      min="0"
                      placeholder="8.5"
                      value={formData.cgpa}
                      onChange={(e) => handleInputChange('cgpa', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="projects">Projects</Label>
                    <Select value={formData.projects} onValueChange={(value) => handleInputChange('projects', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="internships">Internships</Label>
                    <Select value={formData.internships} onValueChange={(value) => handleInputChange('internships', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="skills">Technical Skills</Label>
                  <Input
                    id="skills"
                    placeholder="e.g., Python, Java, React, Machine Learning, Data Science"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Select value={formData.certifications} onValueChange={(value) => handleInputChange('certifications', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Number of certifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1-2</SelectItem>
                      <SelectItem value="3">3-5</SelectItem>
                      <SelectItem value="6">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={calculatePrediction} 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Predict My Chances
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prediction Results */}
          <motion.div variants={itemVariants}>
            {prediction ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <Card className="glass-effect">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Prediction Results
                    </CardTitle>
                    <CardDescription>
                      Based on historical data and your profile
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Main Prediction */}
                    <div className="text-center p-6 rounded-2xl bg-gradient-card border border-white/10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="text-6xl font-bold mb-2"
                        style={{ 
                          background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {prediction.probability}%
                      </motion.div>
                      <p className="text-lg text-muted-foreground mb-4">
                        Placement Probability
                      </p>
                      <Badge 
                        variant={prediction.probability >= 70 ? 'default' : prediction.probability >= 50 ? 'secondary' : 'destructive'}
                        className="text-sm px-4 py-1"
                      >
                        {prediction.probability >= 70 ? 'High Chances' : 
                         prediction.probability >= 50 ? 'Moderate Chances' : 'Needs Improvement'}
                      </Badge>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-card border">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Expected Package</span>
                        </div>
                        <p className="text-2xl font-bold">₹{prediction.expectedPackage} LPA</p>
                      </div>

                      <div className="p-4 rounded-lg bg-card border">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">College Avg</span>
                        </div>
                        <p className="text-2xl font-bold">{prediction.avgCollegePlacement}%</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Recommendations
                      </h4>
                      <div className="space-y-2">
                        {prediction.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-start gap-2 p-3 rounded-lg bg-card/50"
                          >
                            {rec.type === 'warning' && <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />}
                            {rec.type === 'info' && <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />}
                            {rec.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                            <p className="text-sm">{rec.text}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="glass-effect h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Fill in your details to see your placement probability prediction
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PlacementPredictor;