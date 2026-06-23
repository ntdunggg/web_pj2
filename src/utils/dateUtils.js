import { format, isWednesday, parseISO } from 'date-fns';

/**
 * Check if a date is Wednesday
 * @param {Date|string} date - Date object or ISO string
 * @returns {boolean}
 */
export const isDateWednesday = (date) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isWednesday(dateObj);
};

/**
 * Format date for display
 * @param {Date|string} date
 * @param {string} formatStr
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'PPP') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format date and time for display
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'PPP p');
};
