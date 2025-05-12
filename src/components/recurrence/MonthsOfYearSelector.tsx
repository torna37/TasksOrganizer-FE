
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MonthsOfYearSelectorProps {
  selectedMonths: number[];
  onChange: (months: number[]) => void;
  fixedMonth?: number; // Month that should be checked and disabled (1-12)
}

const MonthsOfYearSelector: React.FC<MonthsOfYearSelectorProps> = ({ 
  selectedMonths, 
  onChange,
  fixedMonth = -1
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleMonthChange = (index: number, checked: boolean | "indeterminate") => {
    // Don't allow changes to fixed month
    if ((index + 1) === fixedMonth) return;
    
    const monthsOfYear = [...selectedMonths];
    if (checked === true) {
      if (!monthsOfYear.includes(index + 1)) {
        monthsOfYear.push(index + 1);
      }
    } else {
      const idx = monthsOfYear.indexOf(index + 1);
      if (idx !== -1) {
        monthsOfYear.splice(idx, 1);
      }
    }
    onChange(monthsOfYear);
  };
  
  return (
    <div>
      <Label className="mb-2 block">Months</Label>
      <div className="flex flex-wrap gap-2">
        {months.map((month, index) => (
          <div key={`month-${index}`} className="flex items-center space-x-2">
            <Checkbox
              id={`month-${index}`}
              checked={selectedMonths.includes(index + 1) || (index + 1) === fixedMonth}
              onCheckedChange={(checked) => handleMonthChange(index, checked)}
              disabled={(index + 1) === fixedMonth}
            />
            <Label 
              htmlFor={`month-${index}`} 
              className={`text-sm ${(index + 1) === fixedMonth ? 'opacity-70' : ''}`}
            >
              {month.slice(0, 3)}
            </Label>
          </div>
        ))}
      </div>
      {fixedMonth > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {months[fixedMonth - 1]} is the month of the first occurrence and cannot be changed.
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Tasks will repeat on the same day of each selected month.
      </p>
    </div>
  );
};

export default MonthsOfYearSelector;
