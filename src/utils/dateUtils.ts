
/**
 * Format a date to time format (HH:MM)
 */
export const formatTime = (date: Date): string => {
  return new Date(date).toLocaleTimeString([], { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

/**
 * Format a date to standard date format
 */
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString();
};
