
import React, { useState, useEffect } from 'react';
import { RecurrenceRule } from '@/types/models';
import FrequencySelector from './FrequencySelector';
import DaysOfWeekSelector from './DaysOfWeekSelector';
import DaysOfMonthSelector from './DaysOfMonthSelector';
import MonthsOfYearSelector from './MonthsOfYearSelector';
import RecurrenceSummary from './RecurrenceSummary';

interface RecurrenceEditorProps {
  value?: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
  showAdvanced?: boolean;
}

const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({ 
  value, 
  onChange, 
  showAdvanced = false 
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
        />
      )}
      
      {/* Days of month selector (for monthly) */}
      {rule.frequency === 'monthly' && (
        <DaysOfMonthSelector
          selectedDays={rule.daysOfMonth || []}
          onChange={(daysOfMonth) => handleChange({ daysOfMonth })}
        />
      )}
      
      {/* Months selector (for yearly) */}
      {rule.frequency === 'yearly' && (
        <>
          <MonthsOfYearSelector
            selectedMonths={rule.monthsOfYear || []}
            onChange={(monthsOfYear) => handleChange({ monthsOfYear })}
          />
          
          <DaysOfMonthSelector
            selectedDays={rule.daysOfMonth || []}
            onChange={(daysOfMonth) => handleChange({ daysOfMonth })}
            daysToShow={[1, 15, 30]}
            label="Days"
            idPrefix="ydom"
          />
        </>
      )}
      
      {/* Human readable summary */}
      <RecurrenceSummary rule={rule} />
    </div>
  );
};

export default RecurrenceEditor;
