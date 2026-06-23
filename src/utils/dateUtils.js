import { format, isWednesday, parseISO } from 'date-fns';

/**
 * Check if a date is Wednesday
 * @param {Date|string} date - Date object or ISO string
 * @returns {boolean}
 */
export const isDateWednesday = (date) => {
  if (!date) return false;
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isWednesday(dateObj);
  } catch (err) {
    return false;
  }
};

/**
 * Format date for display
 * @param {Date|string} date
 * @param {string} formatStr
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return 'N/A';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (err) {
    return 'Invalid Date';
  }
};

/**
 * Format date and time for display
 * @param {Date|string} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return formatDate(date, 'PPP p');
};
