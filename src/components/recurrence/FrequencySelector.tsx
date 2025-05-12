
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RecurrenceRule } from '@/types/models';

interface FrequencySelectorProps {
  frequency: RecurrenceRule['frequency'];
  interval: number;
  onChange: (updates: Partial<RecurrenceRule>) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({ 
  frequency, 
  interval, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select
          value={frequency}
          onValueChange={(val: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
            onChange({ frequency: val })
          }
        >
          <SelectTrigger id="frequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="interval">Every</Label>
        <div className="flex items-center">
          <Input
            id="interval"
            type="number"
            min={1}
            value={interval}
            onChange={e => onChange({ interval: parseInt(e.target.value) || 1 })}
            className="w-20"
          />
          <span className="ml-2 text-muted-foreground">
            {interval === 1 
              ? frequency.slice(0, -2) 
              : frequency}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FrequencySelector;
