import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Calendar, Star, Medal, Heart, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Goals() {
  const userId = 1;

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/dashboard`],
  });

  const { data: allAchievements } = useQuery({
    queryKey: [`/api/user/${userId}/achievements`],
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="gradient-primary text-white p-6">
          <h1 className="text-2xl font-bold">Goals & Achievements</h1>
          <p className="text-white/90 text-sm">Track your milestones</p>
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
  const currentStreak = stats?.currentStreak || 0;
  const totalTobaccoFreeDays = stats?.totalTobaccoFreeDays || 0;
  const moneySaved = parseFloat(stats?.moneySaved || "0");
  const achievements = allAchievements || [];

  // Define goal milestones
  const streakGoals = [
    { days: 1, title: "First Day", description: "Complete your first tobacco-free day" },
    { days: 3, title: "3 Days Strong", description: "Nicotine is leaving your system" },
    { days: 7, title: "One Week", description: "Your taste and smell are improving" },
    { days: 14, title: "Two Weeks", description: "Your circulation is improving" },
    { days: 30, title: "One Month", description: "Your lung function is increasing" },
    { days: 60, title: "Two Months", description: "Your cough is decreasing" },
    { days: 90, title: "Three Months", description: "Your risk of heart attack is decreasing" },
    { days: 365, title: "One Year", description: "Your heart disease risk is cut in half" }
  ];

  const moneyGoals = [
    { amount: 50, title: "First $50", description: "Saved your first $50" },
    { amount: 100, title: "$100 Saved", description: "You could buy something nice!" },
    { amount: 250, title: "$250 Milestone", description: "That's a weekend getaway" },
    { amount: 500, title: "$500 Achievement", description: "Half way to $1000!" },
    { amount: 1000, title: "$1000 Club", description: "You've saved $1000!" }
  ];

  const getProgressPercentage = (target: number, current: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const hasAchievement = (type: string, value: number) => {
    return achievements.some((achievement: any) => 
      achievement.type === type && achievement.value === value
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="gradient-primary text-white p-6">
        <h1 className="text-2xl font-bold">Goals & Achievements</h1>
        <p className="text-white/90 text-sm">Track your milestones</p>
      </header>
      
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Current Progress */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Current Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-2">{currentStreak}</div>
              <div className="text-muted-foreground">Days Tobacco-Free</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Next milestone: 30 days</span>
                <span>{Math.max(0, 30 - currentStreak)} days to go</span>
              </div>
              <Progress value={getProgressPercentage(30, currentStreak)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Streak Goals */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Streak Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {streakGoals.map((goal) => {
              const achieved = hasAchievement("streak_milestone", goal.days);
              const isNext = !achieved && goal.days > currentStreak;
              const progress = getProgressPercentage(goal.days, currentStreak);
              
              return (
                <div key={goal.days} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achieved ? 'bg-success' : isNext ? 'bg-blue-500' : 'bg-gray-200'
                      }`}>
                        {achieved ? (
                          <Medal className="w-4 h-4 text-white" />
                        ) : (
                          <Star className={`w-4 h-4 ${isNext ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{goal.title}</div>
                        <div className="text-sm text-muted-foreground">{goal.description}</div>
                      </div>
                    </div>
                    <div>
                      {achieved ? (
                        <Badge className="bg-success hover:bg-success">Achieved</Badge>
                      ) : isNext ? (
                        <Badge variant="outline" className="border-blue-500 text-blue-500">Next</Badge>
                      ) : (
                        <Badge variant="outline">{goal.days} days</Badge>
                      )}
                    </div>
                  </div>
                  {!achieved && (
                    <Progress value={progress} className="h-1" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Money Goals */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Money Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {moneyGoals.map((goal) => {
              const achieved = hasAchievement("money_milestone", goal.amount);
              const isNext = !achieved && goal.amount > moneySaved;
              const progress = getProgressPercentage(goal.amount, moneySaved);
              
              return (
                <div key={goal.amount} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achieved ? 'bg-green-500' : isNext ? 'bg-yellow-500' : 'bg-gray-200'
                      }`}>
                        {achieved ? (
                          <DollarSign className="w-4 h-4 text-white" />
                        ) : (
                          <DollarSign className={`w-4 h-4 ${isNext ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{goal.title}</div>
                        <div className="text-sm text-muted-foreground">{goal.description}</div>
                      </div>
                    </div>
                    <div>
                      {achieved ? (
                        <Badge className="bg-green-500 hover:bg-green-500">Achieved</Badge>
                      ) : isNext ? (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          ${(goal.amount - moneySaved).toFixed(0)} to go
                        </Badge>
                      ) : (
                        <Badge variant="outline">${goal.amount}</Badge>
                      )}
                    </div>
                  </div>
                  {!achieved && (
                    <Progress value={progress} className="h-1" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Health Goals */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Health Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <Heart className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h3 className="font-semibold mb-2">Your Health is Improving!</h3>
              <p className="text-sm text-muted-foreground">
                Every tobacco-free day brings significant health benefits. Check the Health Timeline on your home screen to see your progress.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-500">{Math.round(totalTobaccoFreeDays * 0.25)}</div>
                <div className="text-sm text-muted-foreground">Hours of Life Regained</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{totalTobaccoFreeDays * 20}</div>
                <div className="text-sm text-muted-foreground">Cigarettes Avoided</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievement Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Achievement Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-500 mb-2">
                {achievements.length}
              </div>
              <div className="text-lg font-semibold mb-2">
                {achievements.length === 1 ? 'Achievement Unlocked' : 'Achievements Unlocked'}
              </div>
              <div className="text-muted-foreground">
                {achievements.length === 0 
                  ? "Start your journey to unlock your first achievement!"
                  : "Keep going to unlock more achievements!"
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
