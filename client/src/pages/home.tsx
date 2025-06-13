import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { DailyCheckIn } from "@/components/daily-checkin";
import { ProgressCalendar } from "@/components/progress-calendar";
import { HealthTimeline } from "@/components/health-timeline";
import { AchievementBadges } from "@/components/achievement-badges";
import { getDailyQuote, getHealthScore } from "@/lib/motivational-quotes";
import { Quote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // For demo purposes, using userId = 1
  const userId = 1;
  const dailyQuote = getDailyQuote();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/dashboard`],
  });

  const { data: entries } = useQuery({
    queryKey: [`/api/user/${userId}/entries`],
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="gradient-primary text-white p-6 pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">TobaccoFree</h1>
          </div>
          <p className="text-white/90 text-sm">Your journey to freedom starts here</p>
        </header>
        
        <main className="px-6 -mt-4 pb-24 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const achievements = dashboardData?.achievements || [];
  const todayEntry = entries?.find((entry: any) => 
    entry.date === new Date().toISOString().split('T')[0]
  );

  const currentStreak = stats?.currentStreak || 0;
  const moneySaved = parseFloat(stats?.moneySaved || "0");
  const healthScore = getHealthScore(currentStreak);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="gradient-primary text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">TobaccoFree</h1>
        </div>
        <p className="text-white/90 text-sm">Your journey to freedom starts here</p>
      </header>
      
      <main className="px-6 -mt-4 pb-24 space-y-6">
        <DailyCheckIn 
          userId={userId}
          currentStreak={currentStreak}
          todayEntry={todayEntry}
        />

        {/* Motivational Quote */}
        <Card className="gradient-secondary text-white shadow-lg slide-up">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Quote className="w-6 h-6 opacity-70 mt-1 flex-shrink-0" />
              <div>
                <p className="text-lg font-medium mb-2">
                  "{dailyQuote.text}"
                </p>
                <p className="text-white/80 text-sm">— {dailyQuote.author}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 slide-up">
          <Card className="shadow-lg border-gray-100">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500 mb-1">
                  ${moneySaved.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Money Saved</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-gray-100">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">
                  {healthScore}%
                </div>
                <div className="text-sm text-muted-foreground">Health Score</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AchievementBadges achievements={achievements} />

        {entries && <ProgressCalendar entries={entries} />}

        <HealthTimeline daysTobaccoFree={currentStreak} />
      </main>
    </div>
  );
}
