import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from "recharts";
import { 
  Activity, Users, TrendingUp, AlertCircle, CheckCircle, 
  Clock, Zap, RefreshCw, Bell, Target
} from 'lucide-react';

const RealTimeMonitor = () => {
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', message: 'Google hired 15 students from IIT Delhi', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New company Microsoft registered', time: '5 min ago' },
    { id: 3, type: 'warning', message: 'Low placement rate alert for NIT Kurukshetra', time: '10 min ago' },
  ]);

  // Mock real-time data
  const [liveData, setLiveData] = useState({
    activeOffers: 1247,
    studentsPlaced: 892,
    companiesActive: 156,
    averagePackage: 12.5,
    placementRate: 71.6
  });

  // Mock time series data
  const [timeSeriesData, setTimeSeriesData] = useState([
    { time: '10:00', offers: 120, placements: 85, companies: 25 },
    { time: '11:00', offers: 145, placements: 102, companies: 28 },
    { time: '12:00', offers: 170, placements: 118, companies: 32 },
    { time: '13:00', offers: 195, placements: 135, companies: 35 },
    { time: '14:00', offers: 220, placements: 152, companies: 38 },
    { time: '15:00', offers: 240, placements: 168, companies: 41 },
  ]);

  // Top performing colleges live data
  const [topColleges, setTopColleges] = useState([
    { name: 'IIT Delhi', placements: 145, rate: 94.2, trend: 'up' },
    { name: 'IIT Bombay', placements: 138, rate: 92.8, trend: 'up' },
    { name: 'IIT Madras', placements: 132, rate: 91.5, trend: 'stable' },
    { name: 'NIT Trichy', placements: 98, rate: 86.4, trend: 'up' },
    { name: 'BITS Pilani', placements: 87, rate: 84.1, trend: 'down' },
  ]);

  // Recent activities
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, company: 'Google', students: 5, college: 'IIT Delhi', time: '2 min ago', package: '45 LPA' },
    { id: 2, company: 'Microsoft', students: 3, college: 'IIT Bombay', time: '8 min ago', package: '42 LPA' },
    { id: 3, company: 'Amazon', students: 7, college: 'IIT Madras', time: '15 min ago', package: '38 LPA' },
    { id: 4, company: 'Netflix', students: 2, college: 'IIIT Hyderabad', time: '23 min ago', package: '50 LPA' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Update live stats
      setLiveData(prev => ({
        activeOffers: prev.activeOffers + Math.floor(Math.random() * 5),
        studentsPlaced: prev.studentsPlaced + Math.floor(Math.random() * 3),
        companiesActive: prev.companiesActive + (Math.random() > 0.8 ? 1 : 0),
        averagePackage: Math.max(0, prev.averagePackage + (Math.random() - 0.5) * 0.1),
        placementRate: Math.min(100, Math.max(0, prev.placementRate + (Math.random() - 0.5) * 0.5))
      }));

      // Update time series with proper validation
      const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTimeSeriesData(prev => {
        // Ensure prev is not empty and has valid data
        if (!prev || prev.length === 0) {
          return [{
            time: newTime,
            offers: 120,
            placements: 85,
            companies: 25
          }];
        }
        
        const lastData = prev[prev.length - 1];
        if (!lastData) {
          return prev;
        }
        
        const newData = [...prev.slice(-5), {
          time: newTime,
          offers: Math.max(0, (lastData.offers || 0) + Math.floor(Math.random() * 20) + 10),
          placements: Math.max(0, (lastData.placements || 0) + Math.floor(Math.random() * 15) + 8),
          companies: Math.max(0, (lastData.companies || 0) + (Math.random() > 0.7 ? 1 : 0))
        }];
        return newData;
      });

      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-background p-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" variants={itemVariants}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-primary">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">
                Live Placement Monitor
              </h1>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">
              Real-time placement tracking and live updates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isLive ? 'Pause Live' : 'Start Live'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Live Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Offers</p>
                    <p className="text-2xl font-bold">{liveData.activeOffers.toLocaleString()}</p>
                  </div>
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5 in last hour
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Students Placed</p>
                    <p className="text-2xl font-bold">{liveData.studentsPlaced.toLocaleString()}</p>
                  </div>
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  +12 today
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Companies Active</p>
                    <p className="text-2xl font-bold">{liveData.companiesActive}</p>
                  </div>
                  <Activity className="h-6 w-6 text-blue-500" />
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  3 new today
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Package</p>
                    <p className="text-2xl font-bold">₹{liveData.averagePackage.toFixed(1)} LPA</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +0.3 LPA
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced chart-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Placement Rate</p>
                    <p className="text-2xl font-bold">{liveData.placementRate.toFixed(1)}%</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  <Activity className="h-3 w-3 mr-1" />
                  Real-time
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Live Activity Chart */}
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Live Activity Feed
                </CardTitle>
                <CardDescription>
                  Real-time placement activity throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  {timeSeriesData && timeSeriesData.length > 0 ? (
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="offersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="placementsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--primary) / 0.2)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-elegant)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="offers"
                        stroke="hsl(var(--primary))"
                        fill="url(#offersGrad)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="placements"
                        stroke="hsl(var(--accent))"
                        fill="url(#placementsGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Loading chart data...</p>
                    </div>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Performing Colleges */}
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Performing Colleges
                </CardTitle>
                <CardDescription>
                  Live leaderboard of college placement performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topColleges} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--primary) / 0.2)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-elegant)',
                      }}
                      formatter={(value) => [`${value} students`, 'Placements']}
                    />
                    <Bar 
                      dataKey="placements" 
                      fill="hsl(var(--primary))" 
                      radius={[0, 8, 8, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activities & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Placement Activities */}
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Placements
                </CardTitle>
                <CardDescription>
                  Latest placement activities happening right now
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    className="p-4 rounded-lg bg-gradient-card border border-white/10 hover:border-primary/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="font-semibold text-primary">{activity.company}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {activity.package}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Hired {activity.students} students from {activity.college}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Notifications */}
          <motion.div variants={itemVariants}>
            <Card className="glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Live Notifications
                </CardTitle>
                <CardDescription>
                  System alerts and important updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className="p-4 rounded-lg border border-white/10 hover:border-primary/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    style={{
                      backgroundColor: notification.type === 'success' ? 'hsl(var(--chart-5) / 0.1)' :
                        notification.type === 'warning' ? 'hsl(var(--chart-4) / 0.1)' :
                        'hsl(var(--chart-3) / 0.1)'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'success' ? 'bg-green-500' :
                        notification.type === 'warning' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm mb-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Last Update Info */}
        <motion.div variants={itemVariants} className="mt-6">
          <Card className="glass-enhanced">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                <span className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  {isLive ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default RealTimeMonitor;