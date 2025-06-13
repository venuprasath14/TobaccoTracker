import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DailyCheckInProps {
  userId: number;
  currentStreak: number;
  todayEntry?: {
    tobaccoFree: boolean;
    date: string;
  };
}

export function DailyCheckIn({ userId, currentStreak, todayEntry }: DailyCheckInProps) {
  const [celebrating, setCelebrating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (tobaccoFree: boolean) => {
      const today = new Date().toISOString().split('T')[0];
      return apiRequest("POST", "/api/daily-entry", {
        userId,
        date: today,
        tobaccoFree
      });
    },
    onSuccess: (_, tobaccoFree) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/dashboard`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/entries`] });
      
      if (tobaccoFree) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 600);
        toast({
          title: "Amazing! 🎉",
          description: "You've marked today as tobacco-free! Keep up the great work!",
        });
      } else {
        toast({
          title: "That's okay 💪",
          description: "Tomorrow is a new day. You've got this!",
          variant: "destructive"
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive"
      });
    }
  });

  const progressPercentage = Math.min((currentStreak / 30) * 100, 100);
  const circumference = 283;
  const strokeDasharray = `${(progressPercentage / 100) * circumference} ${circumference}`;

  return (
    <Card className="shadow-lg border-gray-100 slide-up">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50" cy="50" r="45"
                stroke="hsl(151, 83%, 39%)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                className="progress-ring"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-success">{currentStreak}</div>
                <div className="text-sm text-muted-foreground">Days Free</div>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-2">
            {todayEntry ? "Today's Status" : "How are you today?"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {todayEntry 
              ? `You've marked today as ${todayEntry.tobaccoFree ? 'tobacco-free' : 'used tobacco'}`
              : "Mark today as tobacco-free to continue your streak!"
            }
          </p>
          
          <div className="flex gap-3">
            <Button 
              className={`flex-1 bg-success hover:bg-success/90 text-white font-medium transition-all transform hover:scale-105 active:scale-95 ${celebrating ? 'celebrate' : ''}`}
              onClick={() => checkInMutation.mutate(true)}
              disabled={checkInMutation.isPending || (todayEntry?.tobaccoFree === true)}
            >
              <Check className="w-4 h-4 mr-2" />
              Tobacco Free!
            </Button>
            <Button 
              variant="outline"
              className="flex-1 hover:bg-gray-100 font-medium transition-all"
              onClick={() => checkInMutation.mutate(false)}
              disabled={checkInMutation.isPending || (todayEntry?.tobaccoFree === false)}
            >
              <X className="w-4 h-4 mr-2" />
              Used Today
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
