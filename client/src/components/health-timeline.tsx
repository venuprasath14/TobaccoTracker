import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Check, Clock, Hourglass } from "lucide-react";
import { getHealthBenefits } from "@/lib/health-benefits";

interface HealthTimelineProps {
  daysTobaccoFree: number;
}

export function HealthTimeline({ daysTobaccoFree }: HealthTimelineProps) {
  const healthBenefits = getHealthBenefits(daysTobaccoFree);

  const getIcon = (benefit: typeof healthBenefits[0]) => {
    if (benefit.achieved) {
      return <Check className="w-4 h-4 text-white" />;
    } else if (benefit.days <= daysTobaccoFree + 7) {
      return <Clock className="w-4 h-4 text-white" />;
    } else {
      return <Hourglass className="w-4 h-4 text-gray-500" />;
    }
  };

  const getBgColor = (benefit: typeof healthBenefits[0]) => {
    if (benefit.achieved) {
      return "bg-success";
    } else if (benefit.days <= daysTobaccoFree + 7) {
      return "bg-primary";
    } else {
      return "bg-gray-200";
    }
  };

  const getStatusText = (benefit: typeof healthBenefits[0]) => {
    if (benefit.achieved) {
      return "✓ Done";
    } else if (benefit.days <= daysTobaccoFree + 7) {
      return "In Progress";
    } else {
      const daysLeft = benefit.days - daysTobaccoFree;
      return `${daysLeft} days to go`;
    }
  };

  const getStatusColor = (benefit: typeof healthBenefits[0]) => {
    if (benefit.achieved) {
      return "text-success";
    } else if (benefit.days <= daysTobaccoFree + 7) {
      return "text-primary";
    } else {
      return "text-muted-foreground";
    }
  };

  return (
    <Card className="shadow-lg border-gray-100 slide-up">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Health Recovery Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthBenefits.slice(0, 6).map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`w-8 h-8 ${getBgColor(benefit)} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                {getIcon(benefit)}
              </div>
              <div className="flex-1">
                <div className={`font-medium mb-1 ${benefit.achieved ? 'text-success' : benefit.days <= daysTobaccoFree + 7 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {benefit.timeframe} - {benefit.title}
                </div>
                <div className="text-sm text-muted-foreground">
                  {benefit.description}
                </div>
              </div>
              <div className={`text-xs font-medium ${getStatusColor(benefit)}`}>
                {getStatusText(benefit)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
