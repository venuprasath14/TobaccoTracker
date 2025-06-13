import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, X } from "lucide-react";
import { type DailyEntry } from "@/lib/localStorage";

interface ProgressCalendarProps {
  entries: DailyEntry[];
}

export function ProgressCalendar({ entries }: ProgressCalendarProps) {
  // Create a map of entries by date for quick lookup
  const entryMap = new Map(entries.map(entry => [entry.date, entry]));
  
  // Generate last 30 days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const entry = entryMap.get(dateString);
      
      days.push({
        date: dateString,
        day: date.getDate(),
        isToday: i === 0,
        isFuture: i < 0,
        entry
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const tobaccoFreeDays = entries.filter(entry => entry.tobaccoFree).length;
  const usedTobaccoDays = entries.filter(entry => !entry.tobaccoFree).length;

  return (
    <Card className="shadow-lg border-gray-100 slide-up">
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-semibold">
          <Calendar className="w-5 h-5 mr-2 text-primary" />
          30-Day Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-xs text-muted-foreground text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {calendarDays.map((day, index) => {
            let bgColor = 'bg-gray-100';
            let icon = null;
            let textColor = 'text-muted-foreground';
            
            if (day.entry) {
              if (day.entry.tobaccoFree) {
                bgColor = 'bg-success';
                icon = <Check className="w-3 h-3 text-white" />;
                textColor = 'text-white';
              } else {
                bgColor = 'bg-destructive/20';
                icon = <X className="w-3 h-3 text-destructive" />;
                textColor = 'text-destructive';
              }
            }
            
            if (day.isToday && day.entry?.tobaccoFree) {
              bgColor = 'bg-primary ring-2 ring-primary/50';
            } else if (day.isToday) {
              bgColor = day.entry ? bgColor : 'bg-primary ring-2 ring-primary/50';
              textColor = day.entry?.tobaccoFree === false ? textColor : 'text-white';
            }

            return (
              <div 
                key={index} 
                className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center transition-colors`}
              >
                {icon || (
                  <span className={`text-xs font-bold ${textColor}`}>
                    {day.day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded"></div>
            <span className="text-muted-foreground">Tobacco Free ({tobaccoFreeDays})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive/20 rounded"></div>
            <span className="text-muted-foreground">Used Tobacco ({usedTobaccoDays})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
