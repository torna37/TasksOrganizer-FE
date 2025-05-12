
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DaysOfWeekSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

const DaysOfWeekSelector: React.FC<DaysOfWeekSelectorProps> = ({ 
  selectedDays, 
  onChange 
}) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const handleDayChange = (index: number, checked: boolean | "indeterminate") => {
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
              checked={selectedDays.includes(index)}
              onCheckedChange={(checked) => handleDayChange(index, checked)}
            />
            <Label htmlFor={`day-${index}`} className="text-sm">
              {day.slice(0, 3)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysOfWeekSelector;
