import { useMemo } from 'react';
import { isDateWednesday } from '../utils/dateUtils';
import { WEDNESDAY_DISCOUNT } from '../utils/constants';

/**
 * Custom hook for Wednesday discount logic
 * @param {Date|string} showDate - Show date
 * @param {number} basePrice - Base price
 * @returns {object} - { isWednesday, discountRate, finalPrice }
 */
export const useWednesdayDiscount = (showDate, basePrice) => {
  const isWednesday = useMemo(() => {
    if (!showDate) return false;
    return isDateWednesday(showDate);
  }, [showDate]);

  const discountRate = isWednesday ? WEDNESDAY_DISCOUNT : 0;
  
  const finalPrice = useMemo(() => {
    if (!basePrice) return 0;
    return isWednesday ? basePrice * (1 - WEDNESDAY_DISCOUNT) : basePrice;
  }, [basePrice, isWednesday]);

  return {
    isWednesday,
    discountRate,
    discountAmount: basePrice - finalPrice,
    finalPrice,
  };
};
