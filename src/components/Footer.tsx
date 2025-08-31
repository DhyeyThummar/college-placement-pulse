import React from 'react';
import { GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-gradient-glass">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="p-1.5 rounded-lg bg-gradient-primary">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold gradient-text">
              College Placement Insights
            </span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              © 2024 College Placement Insights. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Empowering students with data-driven placement insights
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;