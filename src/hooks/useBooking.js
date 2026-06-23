import { useState, useCallback, useMemo } from 'react';
import { useWednesdayDiscount } from './useWednesdayDiscount';

/**
 * Custom hook for booking logic
 * @param {object} show - Show details
 * @returns {object} - Booking state and methods
 */
export const useBooking = (show) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promotionCode, setPromotionCode] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState(null);

  // Calculate base price for selected seats
  const basePrice = useMemo(() => {
    if (!show || !selectedSeats.length) return 0;
    
    return selectedSeats.reduce((total, seat) => {
      const zonePrice = show.pricing[seat.zone] || 0;
      return total + zonePrice;
    }, 0);
  }, [show, selectedSeats]);

  // Apply Wednesday discount
  const {
    isWednesday,
    discountRate: wednesdayDiscountRate,
    discountAmount: wednesdayDiscountAmount,
    finalPrice: priceAfterWednesday,
  } = useWednesdayDiscount(show?.date, basePrice);

  // Apply promotion discount
  const promotionDiscount = useMemo(() => {
    if (!appliedPromotion) return 0;
    
    if (appliedPromotion.type === 'percentage') {
      return priceAfterWednesday * (appliedPromotion.value / 100);
    } else {
      return appliedPromotion.value;
    }
  }, [appliedPromotion, priceAfterWednesday]);

  // Calculate final total
  const totalAmount = useMemo(() => {
    return Math.max(0, priceAfterWednesday - promotionDiscount);
  }, [priceAfterWednesday, promotionDiscount]);

  // Toggle seat selection
  const toggleSeat = useCallback((seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find(
        (s) => s.zone === seat.zone && s.row === seat.row && s.col === seat.col
      );
      
      if (exists) {
        return prev.filter(
          (s) => !(s.zone === seat.zone && s.row === seat.row && s.col === seat.col)
        );
      } else {
        return [...prev, seat];
      }
    });
  }, []);

  // Check if seat is selected
  const isSeatSelected = useCallback((seat) => {
    return selectedSeats.some(
      (s) => s.zone === seat.zone && s.row === seat.row && s.col === seat.col
    );
  }, [selectedSeats]);

  // Clear selected seats
  const clearSeats = useCallback(() => {
    setSelectedSeats([]);
  }, []);

  // Apply promotion
  const applyPromotion = useCallback((promotion) => {
    setAppliedPromotion(promotion);
  }, []);

  // Clear promotion
  const clearPromotion = useCallback(() => {
    setAppliedPromotion(null);
    setPromotionCode('');
  }, []);

  // Reset booking
  const resetBooking = useCallback(() => {
    setSelectedSeats([]);
    setPaymentMethod('card');
    setPromotionCode('');
    setAppliedPromotion(null);
  }, []);

  return {
    // State
    selectedSeats,
    paymentMethod,
    promotionCode,
    appliedPromotion,
    
    // Pricing
    basePrice,
    isWednesday,
    wednesdayDiscountRate,
    wednesdayDiscountAmount,
    priceAfterWednesday,
    promotionDiscount,
    totalAmount,
    
    // Methods
    toggleSeat,
    isSeatSelected,
    clearSeats,
    setPaymentMethod,
    setPromotionCode,
    applyPromotion,
    clearPromotion,
    resetBooking,
  };
};
