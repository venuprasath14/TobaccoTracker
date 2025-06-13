export interface HealthBenefit {
  timeframe: string;
  title: string;
  description: string;
  days: number;
  achieved: boolean;
}

export function getHealthBenefits(daysTobaccoFree: number): HealthBenefit[] {
  return [
    {
      timeframe: "20 minutes",
      title: "Heart rate normalizes",
      description: "Your heart rate and blood pressure drop back to normal.",
      days: 0,
      achieved: daysTobaccoFree >= 0
    },
    {
      timeframe: "12 hours",
      title: "Carbon monoxide clears",
      description: "Carbon monoxide level drops to normal.",
      days: 0,
      achieved: daysTobaccoFree >= 0
    },
    {
      timeframe: "2 weeks",
      title: "Circulation improves",
      description: "Your circulation improves and lung function increases.",
      days: 14,
      achieved: daysTobaccoFree >= 14
    },
    {
      timeframe: "1 month",
      title: "Lung function improves",
      description: "Cilia regrow in lungs, increasing ability to handle mucus.",
      days: 30,
      achieved: daysTobaccoFree >= 30
    },
    {
      timeframe: "3 months",
      title: "Lung capacity increases",
      description: "Lung capacity increases by up to 30%.",
      days: 90,
      achieved: daysTobaccoFree >= 90
    },
    {
      timeframe: "6 months",
      title: "Reduced infection risk",
      description: "Reduced risk of respiratory infections.",
      days: 180,
      achieved: daysTobaccoFree >= 180
    },
    {
      timeframe: "1 year",
      title: "Heart disease risk halved",
      description: "Risk of heart disease is cut in half.",
      days: 365,
      achieved: daysTobaccoFree >= 365
    },
    {
      timeframe: "5 years",
      title: "Stroke risk normalized",
      description: "Stroke risk is reduced to that of a non-smoker.",
      days: 1825,
      achieved: daysTobaccoFree >= 1825
    }
  ];
}

export function getNextHealthMilestone(daysTobaccoFree: number): HealthBenefit | null {
  const benefits = getHealthBenefits(daysTobaccoFree);
  return benefits.find(benefit => !benefit.achieved) || null;
}

export function getHealthScore(daysTobaccoFree: number): number {
  // Calculate health score based on days tobacco-free
  // Max score of 100 after 365 days
  const maxDays = 365;
  const score = Math.min(Math.floor((daysTobaccoFree / maxDays) * 100), 100);
  return Math.max(score, 10); // Minimum score of 10%
}
