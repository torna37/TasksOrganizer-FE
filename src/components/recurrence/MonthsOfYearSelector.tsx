
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MonthsOfYearSelectorProps {
  selectedMonths: number[];
  onChange: (months: number[]) => void;
}

const MonthsOfYearSelector: React.FC<MonthsOfYearSelectorProps> = ({ 
  selectedMonths, 
  onChange 
}) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleMonthChange = (index: number, checked: boolean | "indeterminate") => {
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
              checked={selectedMonths.includes(index + 1)}
              onCheckedChange={(checked) => handleMonthChange(index, checked)}
            />
            <Label htmlFor={`month-${index}`} className="text-sm">
              {month.slice(0, 3)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthsOfYearSelector;
