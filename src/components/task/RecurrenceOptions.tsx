
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import RecurrenceEditor from '../recurrence/RecurrenceEditor';
import { RecurrenceRule } from '@/types/models';

interface RecurrenceOptionsProps {
  recurrenceRule: RecurrenceRule;
  setRecurrenceRule: (rule: RecurrenceRule) => void;
  dueDate: Date | undefined;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({
  recurrenceRule,
  setRecurrenceRule,
  dueDate
}) => {
  // Set up initial day selections based on dueDate when frequency changes
  useEffect(() => {
    if (dueDate && recurrenceRule.frequency) {
      const updatedRule = { ...recurrenceRule };
      
      // For weekly frequency, automatically select the day of the first occurrence
      if (recurrenceRule.frequency === 'weekly') {
        const dayOfWeek = dueDate.getDay(); // 0-6, Sunday-Saturday
        if (!updatedRule.daysOfWeek?.includes(dayOfWeek)) {
          updatedRule.daysOfWeek = [...(updatedRule.daysOfWeek || []), dayOfWeek];
          setRecurrenceRule(updatedRule);
        }
      }
      
      // For yearly frequency, automatically select the month of the first occurrence
      if (recurrenceRule.frequency === 'yearly') {
        const monthOfYear = dueDate.getMonth() + 1; // 1-12, January-December
        if (!updatedRule.monthsOfYear?.includes(monthOfYear)) {
          updatedRule.monthsOfYear = [...(updatedRule.monthsOfYear || []), monthOfYear];
          setRecurrenceRule(updatedRule);
        }
      }
    }
  }, [dueDate, recurrenceRule.frequency]);

  return (
    <motion.div
      key="recurrence-options"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <Label>Recurrence Options</Label>
        </div>

        <RecurrenceEditor
          value={recurrenceRule}
          onChange={setRecurrenceRule}
          showAdvanced={true}
          dueDate={dueDate}
        />
      </div>
    </motion.div>
  );
};

export default RecurrenceOptions;
