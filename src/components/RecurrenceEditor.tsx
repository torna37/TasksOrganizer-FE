
import React, { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getHumanReadableRecurrence } from '@/utils/dateUtils';
import { RecurrenceRule } from '@/types/models';

interface RecurrenceEditorProps {
  value?: RecurrenceRule;
  onChange: (rule: RecurrenceRule) => void;
  showAdvanced?: boolean;
}

const RecurrenceEditor: React.FC<RecurrenceEditorProps> = ({ value, onChange, showAdvanced = false }) => {
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
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return (
    <div className="space-y-4">
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={rule.frequency}
              onValueChange={(val: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
                handleChange({ frequency: val })
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
                value={rule.interval}
                onChange={e => handleChange({ interval: parseInt(e.target.value) || 1 })}
                className="w-20"
              />
              <span className="ml-2 text-muted-foreground">
                {rule.interval === 1 
                  ? rule.frequency.slice(0, -2) 
                  : rule.frequency}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Days of the week selector (for weekly) */}
      {rule.frequency === 'weekly' && (
        <div>
          <Label className="mb-2 block">Repeat on</Label>
          <div className="flex flex-wrap gap-2">
            {days.map((day, index) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${index}`}
                  checked={(rule.daysOfWeek || []).includes(index)}
                  onCheckedChange={(checked) => {
                    const daysOfWeek = [...(rule.daysOfWeek || [])];
                    if (checked) {
                      if (!daysOfWeek.includes(index)) {
                        daysOfWeek.push(index);
                      }
                    } else {
                      const idx = daysOfWeek.indexOf(index);
                      if (idx !== -1) {
                        daysOfWeek.splice(idx, 1);
                      }
                    }
                    handleChange({ daysOfWeek });
                  }}
                />
                <Label htmlFor={`day-${index}`} className="text-sm">
                  {day.slice(0, 3)}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Days of month selector (for monthly) */}
      {rule.frequency === 'monthly' && (
        <div>
          <Label className="mb-2 block">Day of month</Label>
          <div className="flex flex-wrap gap-2">
            {[1, 5, 10, 15, 20, 25, 30].map(day => (
              <div key={`day-${day}`} className="flex items-center space-x-2">
                <Checkbox
                  id={`dom-${day}`}
                  checked={(rule.daysOfMonth || []).includes(day)}
                  onCheckedChange={(checked) => {
                    const daysOfMonth = [...(rule.daysOfMonth || [])];
                    if (checked) {
                      if (!daysOfMonth.includes(day)) {
                        daysOfMonth.push(day);
                      }
                    } else {
                      const idx = daysOfMonth.indexOf(day);
                      if (idx !== -1) {
                        daysOfMonth.splice(idx, 1);
                      }
                    }
                    handleChange({ daysOfMonth });
                  }}
                />
                <Label htmlFor={`dom-${day}`} className="text-sm">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Months selector (for yearly) */}
      {rule.frequency === 'yearly' && (
        <>
          <div>
            <Label className="mb-2 block">Months</Label>
            <div className="flex flex-wrap gap-2">
              {months.map((month, index) => (
                <div key={`month-${index}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${index}`}
                    checked={(rule.monthsOfYear || []).includes(index + 1)}
                    onCheckedChange={(checked) => {
                      const monthsOfYear = [...(rule.monthsOfYear || [])];
                      if (checked) {
                        if (!monthsOfYear.includes(index + 1)) {
                          monthsOfYear.push(index + 1);
                        }
                      } else {
                        const idx = monthsOfYear.indexOf(index + 1);
                        if (idx !== -1) {
                          monthsOfYear.splice(idx, 1);
                        }
                      }
                      handleChange({ monthsOfYear });
                    }}
                  />
                  <Label htmlFor={`month-${index}`} className="text-sm">
                    {month.slice(0, 3)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="mb-2 block">Days</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 15, 30].map(day => (
                <div key={`yearly-day-${day}`} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ydom-${day}`}
                    checked={(rule.daysOfMonth || []).includes(day)}
                    onCheckedChange={(checked) => {
                      const daysOfMonth = [...(rule.daysOfMonth || [])];
                      if (checked) {
                        if (!daysOfMonth.includes(day)) {
                          daysOfMonth.push(day);
                        }
                      } else {
                        const idx = daysOfMonth.indexOf(day);
                        if (idx !== -1) {
                          daysOfMonth.splice(idx, 1);
                        }
                      }
                      handleChange({ daysOfMonth });
                    }}
                  />
                  <Label htmlFor={`ydom-${day}`} className="text-sm">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {/* Human readable summary */}
      <div className="mt-6 p-3 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium mb-1">Summary</h4>
        <p className="text-sm text-muted-foreground">
          {getHumanReadableRecurrence(rule)}
        </p>
      </div>
    </div>
  );
};

export default RecurrenceEditor;
