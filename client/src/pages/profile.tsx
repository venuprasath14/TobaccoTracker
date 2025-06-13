import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, Heart, Calendar, Trophy, TrendingUp, Share, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { storage, type UserStats, type DailyEntry, type Achievement } from "@/lib/localStorage";

interface ProfileProps {
  currentUserId: string;
  onLogout: () => void;
}

export default function Profile({ currentUserId, onLogout }: ProfileProps) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [currentUserId]);

  const loadData = () => {
    setIsLoading(true);
    const stats = storage.getUserStats(currentUserId);
    const userEntries = storage.getDailyEntries(currentUserId);
    const achievements = storage.getUserAchievements(currentUserId);
    
    setUserStats(stats || null);
    setEntries(userEntries);
    setUserAchievements(achievements);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <header className="gradient-primary text-white p-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-white/90 text-sm">Your tobacco-free journey</p>
        </header>
        
        <main className="px-6 py-6 pb-24 space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  const currentStreak = userStats?.currentStreak || 0;
  const longestStreak = userStats?.longestStreak || 0;
  const totalTobaccoFreeDays = userStats?.totalTobaccoFreeDays || 0;
  const moneySaved = parseFloat(userStats?.moneySaved || "0");
  const startDate = userStats?.startDate || new Date().toISOString().split('T')[0];
  
  // Calculate journey duration
  const journeyStart = new Date(startDate);
  const today = new Date();
  const journeyDays = Math.floor((today.getTime() - journeyStart.getTime()) / (1000 * 60 * 60 * 24));
  
  const handleShare = async () => {
    const shareText = `I've been tobacco-free for ${currentStreak} days and saved $${moneySaved.toFixed(2)}! #TobaccoFree #HealthyLiving`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TobaccoFree Journey',
          text: shareText,
        });
      } catch (error) {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Share your progress with friends and family.",
        });
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your progress with friends and family.",
      });
    }
  };

  const handleLogout = () => {
    storage.logout();
    onLogout();
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <header className="gradient-primary text-white p-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-white/90 text-sm">Your tobacco-free journey</p>
      </header>
      
      <main className="px-6 py-6 pb-24 space-y-6">
        {/* Profile Overview */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-success rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">TobaccoFree User</h2>
                <p className="text-muted-foreground">
                  Journey started {new Date(startDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{currentStreak}</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{journeyDays}</div>
                <div className="text-sm text-muted-foreground">Days on Journey</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Summary */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              Journey Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Total Tobacco-Free Days</span>
              </div>
              <span className="font-semibold text-success">{totalTobaccoFreeDays}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Best Streak</span>
              </div>
              <span className="font-semibold text-primary">{longestStreak} days</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Life Regained</span>
              </div>
              <span className="font-semibold text-red-500">
                {Math.round(totalTobaccoFreeDays * 0.25)} hours
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">$</span>
                <span className="text-muted-foreground">Money Saved</span>
              </div>
              <span className="font-semibold text-green-600">${moneySaved.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Success Rate</span>
              <span className="font-semibold text-success">
                {journeyDays > 0 ? Math.round((totalTobaccoFreeDays / journeyDays) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Achievements ({userAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userAchievements.length > 0 ? (
              <div className="space-y-3">
                {userAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                  </div>
                ))}
                {userAchievements.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{userAchievements.length - 3} more achievements
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-muted-foreground">No achievements yet</p>
                <p className="text-sm text-muted-foreground">Keep going to unlock your first achievement!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Impact */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Health Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-500">{totalTobaccoFreeDays * 20}</div>
                <div className="text-sm text-muted-foreground">Cigarettes Not Smoked</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-500">
                  {Math.round(totalTobaccoFreeDays * 0.5)}kg
                </div>
                <div className="text-sm text-muted-foreground">CO₂ Avoided</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button 
            onClick={handleShare}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <Share className="w-4 h-4 mr-2" />
            Share My Progress
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Motivational Message */}
        <Card className="gradient-secondary text-white shadow-lg">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 mx-auto mb-4 text-white" />
            <h3 className="font-semibold mb-2">You're doing amazing!</h3>
            <p className="text-white/90 text-sm">
              Every day tobacco-free is a victory. Keep up the incredible work – you're not just changing your life, you're inspiring others too.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}