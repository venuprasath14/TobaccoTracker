import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Heart, DollarSign } from "lucide-react";
import { type Achievement } from "@/lib/localStorage";

interface AchievementBadgesProps {
  achievements: Achievement[];
}

export function AchievementBadges({ achievements }: AchievementBadgesProps) {
  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "streak_milestone":
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case "money_milestone":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "health_milestone":
        return <Heart className="w-5 h-5 text-red-500" />;
      default:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "streak_milestone":
        return "bg-yellow-500/10";
      case "money_milestone":
        return "bg-green-500/10";
      case "health_milestone":
        return "bg-red-500/10";
      default:
        return "bg-yellow-500/10";
    }
  };

  const recentAchievements = achievements.slice(0, 3);

  if (achievements.length === 0) {
    return (
      <Card className="shadow-lg border-gray-100 slide-up">
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-semibold">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-muted-foreground">
              Keep going! Your first achievement is just around the corner.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-gray-100 slide-up">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          Recent Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-4">
              <div className={`w-12 h-12 ${getAchievementColor(achievement.type)} rounded-full flex items-center justify-center`}>
                {getAchievementIcon(achievement.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium">{achievement.title}</div>
                <div className="text-sm text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                  New
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        {achievements.length > 3 && (
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              +{achievements.length - 3} more achievements
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
