
import React from 'react';
import { motion } from 'framer-motion';
import { Label } from "@/components/ui/label";
import { Switch } from '@/components/ui/switch';
import RecurrenceEditor from '../recurrence/RecurrenceEditor';
import SimpleRecurrenceEditor from '../recurrence/SimpleRecurrenceEditor';
import { RecurrenceRule } from '@/types/models';

interface RecurrenceOptionsProps {
  multipleSelection: boolean;
  setMultipleSelection: (value: boolean) => void;
  recurrenceRule: RecurrenceRule;
  setRecurrenceRule: (rule: RecurrenceRule) => void;
}

const RecurrenceOptions: React.FC<RecurrenceOptionsProps> = ({
  multipleSelection,
  setMultipleSelection,
  recurrenceRule,
  setRecurrenceRule
}) => {
  return (
    <motion.div
      key="recurrence-options"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Recurrence Options</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="multiple"
              checked={multipleSelection}
              onCheckedChange={setMultipleSelection}
            />
            <Label htmlFor="multiple">Multiple selections</Label>
          </div>
        </div>

        {multipleSelection ? (
          <RecurrenceEditor
            value={recurrenceRule}
            onChange={setRecurrenceRule}
            showAdvanced={true}
          />
        ) : (
          <SimpleRecurrenceEditor
            value={recurrenceRule}
            onChange={setRecurrenceRule}
          />
        )}
      </div>
    </motion.div>
  );
};

export default RecurrenceOptions;
