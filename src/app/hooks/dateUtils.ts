export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getNextDays = (days: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(formatDate(date));
  }
  
  return dates;
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (formatDate(date) === formatDate(today)) {
    return 'Hôm nay';
  } else if (formatDate(date) === formatDate(tomorrow)) {
    return 'Ngày mai';
  } else {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit' 
    });
  }
};

export const isDateAvailable = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date >= today;
};

export const getSessionTimeRange = (session: string): { start: string; end: string } | null => {
  switch (session) {
    case 'morning':
      return { start: '06:00', end: '11:59' };
    case 'afternoon':
      return { start: '12:00', end: '17:59' };
    case 'evening':
      return { start: '18:00', end: '20:59' };
    case 'night':
      return { start: '21:00', end: '23:59' };
    default:
      return null;
  }
};

export const isTimeInSession = (time: string, session: string): boolean => {
  if (!session) return true;
  
  const timeRange = getSessionTimeRange(session);
  if (!timeRange) return true;
  
  return time >= timeRange.start && time <= timeRange.end;
};