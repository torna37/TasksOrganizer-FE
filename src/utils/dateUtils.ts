
import { RecurrenceRule } from "../types/models";

export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateShort = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: 'short',
    day: 'numeric'
  });
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const isPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isFuture = (date: Date): boolean => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date > today;
};

export const groupTasksByDate = (tasks: any[]): Record<string, any[]> => {
  const result: Record<string, any[]> = {
    'Overdue': [],
    'Today': [],
    'Upcoming': []
  };

  tasks.forEach(task => {
    const dueDate = new Date(task.dueDate);
    
    if (isPast(dueDate)) {
      result['Overdue'].push(task);
    } else if (isToday(dueDate)) {
      result['Today'].push(task);
    } else {
      result['Upcoming'].push(task);
    }
  });

  return result;
};

export const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayNumber];
};

export const getMonthName = (monthNumber: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[monthNumber - 1];
};

export const getOrdinal = (n: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export const getHumanReadableRecurrence = (rule: RecurrenceRule): string => {
  if (!rule) return '';
  
  let result = 'Every ';
  
  if (rule.interval > 1) {
    result += `${rule.interval} `;
  }
  
  switch (rule.frequency) {
    case 'daily':
      result += rule.interval > 1 ? 'days' : 'day';
      break;
      
    case 'weekly':
      result += rule.interval > 1 ? 'weeks' : 'week';
      
      if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
        if (rule.daysOfWeek.length === 7) {
          result = 'Every day';
        } else {
          result += ' on ';
          result += rule.daysOfWeek
            .map(day => getDayName(day))
            .join(', ')
            .replace(/,([^,]*)$/, ' and$1');
        }
      }
      break;
      
    case 'monthly':
      result += rule.interval > 1 ? 'months' : 'month';
      
      if (rule.daysOfMonth && rule.daysOfMonth.length > 0) {
        result += ' on the ';
        result += rule.daysOfMonth
          .map(day => getOrdinal(day))
          .join(', ')
          .replace(/,([^,]*)$/, ' and$1');
      }
      
      if (rule.ordinalWeekdays && rule.ordinalWeekdays.length > 0) {
        result += ' on the ';
        result += rule.ordinalWeekdays
          .map(ow => `${getOrdinal(ow.ordinal)} ${getDayName(ow.weekday)}`)
          .join(', ')
          .replace(/,([^,]*)$/, ' and$1');
      }
      break;
      
    case 'yearly':
      result += rule.interval > 1 ? 'years' : 'year';
      
      if (rule.monthsOfYear && rule.monthsOfYear.length > 0) {
        result += ' in ';
        result += rule.monthsOfYear
          .map(month => getMonthName(month))
          .join(', ')
          .replace(/,([^,]*)$/, ' and$1');
          
        if (rule.daysOfMonth && rule.daysOfMonth.length > 0) {
          result += ' on the ';
          result += rule.daysOfMonth
            .map(day => getOrdinal(day))
            .join(', ')
            .replace(/,([^,]*)$/, ' and$1');
        }
      }
      break;
  }
  
  return result;
};
