import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, Award, DollarSign, Clock, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stats() {
  const userId = 1;

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/dashboard`],
  });

  const { data: entries } = useQuery({
    queryKey: [`/api/user/${userId}/entries`, { days: 90 }],
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="gradient-primary text-white p-6">
          <h1 className="text-2xl font-bold">Statistics</h1>
          <p className="text-white/90 text-sm">Track your progress</p>
        </header>
        
        <main className="px-6 py-6 pb-24 space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const achievements = dashboardData?.achievements || [];
  const allEntries = entries || [];
  
  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;
  const totalTobaccoFreeDays = stats?.totalTobaccoFreeDays || 0;
  const moneySaved = parseFloat(stats?.moneySaved || "0");
  
  // Calculate weekly averages
  const last7Days = allEntries.slice(0, 7);
  const tobaccoFreeLast7Days = last7Days.filter((entry: any) => entry.tobaccoFree).length;
  const weeklySuccessRate = last7Days.length > 0 ? (tobaccoFreeLast7Days / last7Days.length) * 100 : 0;
  
  // Calculate monthly stats
  const last30Days = allEntries.slice(0, 30);
  const tobaccoFreeLast30Days = last30Days.filter((entry: any) => entry.tobaccoFree).length;
  const monthlySuccessRate = last30Days.length > 0 ? (tobaccoFreeLast30Days / last30Days.length) * 100 : 0;

  // Calculate time since quit (days since first entry)
  const daysSinceStart = allEntries.length > 0 ? allEntries.length : 0;

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="gradient-primary text-white p-6">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-white/90 text-sm">Track your progress</p>
      </header>
      
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-success" />
              <div className="text-2xl font-bold text-success">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{longestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Tobacco-Free Days</span>
              <span className="font-semibold text-success">{totalTobaccoFreeDays}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Days Since Start</span>
              <span className="font-semibold">{daysSinceStart}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Overall Success Rate</span>
              <span className="font-semibold text-success">
                {daysSinceStart > 0 ? Math.round((totalTobaccoFreeDays / daysSinceStart) * 100) : 0}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Money Saved</span>
              <span className="font-semibold text-green-600">${moneySaved.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              Recent Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last 7 Days</span>
                <span className="text-sm font-medium">{tobaccoFreeLast7Days}/7 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${weeklySuccessRate}%` }}
                />
              </div>
              <div className="text-right text-sm text-success font-medium">
                {Math.round(weeklySuccessRate)}%
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last 30 Days</span>
                <span className="text-sm font-medium">{tobaccoFreeLast30Days}/30 days</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${monthlySuccessRate}%` }}
                />
              </div>
              <div className="text-right text-sm text-success font-medium">
                {Math.round(monthlySuccessRate)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Award className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                {achievements.length}
              </div>
              <div className="text-muted-foreground">
                {achievements.length === 1 ? 'Achievement Unlocked' : 'Achievements Unlocked'}
              </div>
              {achievements.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Keep going! Your first achievement is coming soon.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Health Impact */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Clock className="w-5 h-5 mr-2 text-red-500" />
              Health Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estimated Life Regained</span>
              <span className="font-semibold text-green-600">
                {Math.round(totalTobaccoFreeDays * 0.25)} hours
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cigarettes Not Smoked</span>
              <span className="font-semibold text-success">
                {totalTobaccoFreeDays * 20}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">CO₂ Avoided</span>
              <span className="font-semibold text-blue-600">
                {Math.round(totalTobaccoFreeDays * 0.5)} kg
              </span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
