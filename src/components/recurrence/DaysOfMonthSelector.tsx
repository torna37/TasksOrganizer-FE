
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DaysOfMonthSelectorProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
  daysToShow?: number[];
  label?: string;
  idPrefix?: string;
}

const DaysOfMonthSelector: React.FC<DaysOfMonthSelectorProps> = ({ 
  selectedDays, 
  onChange,
  daysToShow = [1, 5, 10, 15, 20, 25, 30],
  label = "Day of month",
  idPrefix = "dom"
}) => {
  
  const handleDayChange = (day: number, checked: boolean | "indeterminate") => {
    const daysOfMonth = [...selectedDays];
    if (checked === true) {
      if (!daysOfMonth.includes(day)) {
        daysOfMonth.push(day);
      }
    } else {
      const idx = daysOfMonth.indexOf(day);
      if (idx !== -1) {
        daysOfMonth.splice(idx, 1);
      }
    }
    onChange(daysOfMonth);
  };
  
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-2">
        {daysToShow.map(day => (
          <div key={`${idPrefix}-${day}`} className="flex items-center space-x-2">
            <Checkbox
              id={`${idPrefix}-${day}`}
              checked={selectedDays.includes(day)}
              onCheckedChange={(checked) => handleDayChange(day, checked)}
            />
            <Label htmlFor={`${idPrefix}-${day}`} className="text-sm">
              {day}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaysOfMonthSelector;
