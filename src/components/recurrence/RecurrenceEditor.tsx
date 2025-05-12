
import React, { useState, useEffect } from 'react';
import { RecurrenceRule } from '@/types/models';
import FrequencySelector from './FrequencySelector';
import DaysOfWeekSelector from './DaysOfWeekSelector';
import MonthsOfYearSelector from './MonthsOfYearSelector';
import RecurrenceSummary from './RecurrenceSummary';

interface RecurrenceEditorProps {
  value?: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
  showAdvanced?: boolean;
  dueDate?: Date;
}

const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({ 
  value, 
  onChange, 
  showAdvanced = false,
  dueDate
}) => {
  const [rule, setRule] = useState<RecurrenceRule>({
    id: '',
    taskId: '',
    frequency: 'daily',
    interval: 1
  });
  
  useEffect(() => {
    if (value) {
      setRule(value);
    }
  }, [value]);
  
  const handleChange = (updates: Partial<RecurrenceRule>) => {
    const updatedRule = { ...rule, ...updates };
    setRule(updatedRule);
    onChange(updatedRule);
  };

  // Determine which day of the week should be disabled based on dueDate
  const getFixedDayOfWeek = () => {
    if (!dueDate) return -1;
    return dueDate.getDay(); // 0-6, Sunday-Saturday
  };

  // Determine which month should be disabled based on dueDate
  const getFixedMonthOfYear = () => {
    if (!dueDate) return -1;
    return dueDate.getMonth() + 1; // 1-12, January-December
  };
  
  return (
    <div className="space-y-4">
      {showAdvanced && (
        <FrequencySelector
          frequency={rule.frequency}
          interval={rule.interval}
          onChange={handleChange}
        />
      )}
      
      {/* Days of the week selector (for weekly) */}
      {rule.frequency === 'weekly' && (
        <DaysOfWeekSelector
          selectedDays={rule.daysOfWeek || []}
          onChange={(daysOfWeek) => handleChange({ daysOfWeek })}
          fixedDay={getFixedDayOfWeek()}
        />
      )}
      
      {/* Simplified monthly selector - no days of month needed */}
      {rule.frequency === 'monthly' && (
        <div className="text-sm text-muted-foreground">
          This task will repeat every {rule.interval} month(s) on the {dueDate ? dueDate.getDate() : "same"} day.
        </div>
      )}
      
      {/* Months selector (for yearly) - without days */}
      {rule.frequency === 'yearly' && (
        <MonthsOfYearSelector
          selectedMonths={rule.monthsOfYear || []}
          onChange={(monthsOfYear) => handleChange({ monthsOfYear })}
          fixedMonth={getFixedMonthOfYear()}
        />
      )}
      
      {/* Human readable summary */}
      <RecurrenceSummary rule={rule} />
    </div>
  );
};

export default RecurrenceEditor;
