
import React from 'react';
import { RecurrenceRule } from '@/types/models';
import { getHumanReadableRecurrence } from '@/utils/dateUtils';

interface RecurrenceSummaryProps {
  rule: RecurrenceRule;
}

const RecurrenceSummary: React.FC<RecurrenceSummaryProps> = ({ rule }) => {
  return (
    <div className="mt-6 p-3 bg-gray-50 rounded-md dark:bg-gray-800">
      <h4 className="text-sm font-medium mb-1">Summary</h4>
      <p className="text-sm text-muted-foreground">
        {getHumanReadableRecurrence(rule)}
      </p>
    </div>
  );
};

export default RecurrenceSummary;
