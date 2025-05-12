
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DaysOfWeekSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  fixedDay?: number; // Day that should be checked and disabled
}

const DaysOfWeekSelector: React.FC<DaysOfWeekSelectorProps> = ({ 
  selectedDays, 
  onChange,
  fixedDay = -1
}) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const handleDayChange = (index: number, checked: boolean | "indeterminate") => {
    // Don't allow changes to fixed day
    if (index === fixedDay) return;
    
    const daysOfWeek = [...selectedDays];
    if (checked === true) {
      if (!daysOfWeek.includes(index)) {
        daysOfWeek.push(index);
      }
    } else {
      const idx = daysOfWeek.indexOf(index);
      if (idx !== -1) {
        daysOfWeek.splice(idx, 1);
      }
    }
    onChange(daysOfWeek);
  };
  
  return (
    <div>
      <Label className="mb-2 block">Repeat on</Label>
      <div className="flex flex-wrap gap-2">
        {days.map((day, index) => (
          <div key={day} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${index}`}
              checked={selectedDays.includes(index) || index === fixedDay}
              onCheckedChange={(checked) => handleDayChange(index, checked)}
              disabled={index === fixedDay}
            />
            <Label 
              htmlFor={`day-${index}`} 
              className={`text-sm ${index === fixedDay ? 'opacity-70' : ''}`}
            >
              {day.slice(0, 3)}
            </Label>
          </div>
        ))}
      </div>
      {fixedDay > -1 && (
        <p className="text-xs text-muted-foreground mt-2">
          {days[fixedDay]} is the day of the first occurrence and cannot be changed.
        </p>
      )}
    </div>
  );
};

export default DaysOfWeekSelector;
