import { useState, useCallback, useMemo } from 'react';
import { useWednesdayDiscount } from './useWednesdayDiscount';

/**
 * Custom hook for booking logic
 * @param {object} show - Show details
 * @returns {object} - Booking state and methods
 */
export const useBooking = (show) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

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

  // Calculate final total
  const totalAmount = useMemo(() => {
    return priceAfterWednesday;
  }, [priceAfterWednesday]);

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

  // Reset booking
  const resetBooking = useCallback(() => {
    setSelectedSeats([]);
    setPaymentMethod('vnpay');
  }, []);

  return {
    // State
    selectedSeats,
    paymentMethod,
    
    // Pricing
    basePrice,
    isWednesday,
    wednesdayDiscountRate,
    wednesdayDiscountAmount,
    priceAfterWednesday,
    totalAmount,
    
    // Methods
    toggleSeat,
    isSeatSelected,
    clearSeats,
    setPaymentMethod,
    resetBooking,
  };
};
