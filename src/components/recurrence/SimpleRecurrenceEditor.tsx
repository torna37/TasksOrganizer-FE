
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecurrenceRule } from '@/types/models';

interface SimpleRecurrenceEditorProps {
  value: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
}

const SimpleRecurrenceEditor: React.FC<SimpleRecurrenceEditorProps> = ({ 
  value, 
  onChange 
}) => {
  const handleFrequencyChange = (val: 'daily' | 'weekly' | 'monthly' | 'yearly') => {
    onChange({...value, frequency: val});
  };

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value, 
      interval: parseInt(e.target.value) || 1
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Tabs 
          defaultValue={value.frequency} 
          onValueChange={handleFrequencyChange}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div>
        <Label htmlFor="interval">Every</Label>
        <div className="flex items-center mt-2">
          <Input
            id="interval"
            type="number"
            min={1}
            value={value.interval}
            onChange={handleIntervalChange}
            className="w-20 rounded-lg"
          />
          <span className="ml-2 text-muted-foreground">
            {value.interval === 1 
              ? value.frequency.slice(0, -2) 
              : value.frequency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleRecurrenceEditor;
