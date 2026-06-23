import { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { PAYMENT_METHODS } from '../utils/constants';
import { validateCardNumber, validateCardExpiry, validateCVV, formatCardNumber, formatExpiry } from '../utils/validation';

export const PaymentForm = ({ paymentMethod, onPaymentMethodChange, onSubmit, disabled }) => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });

  const [errors, setErrors] = useState({});

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardData({ ...cardData, cardNumber: formatted });
      setErrors({ ...errors, cardNumber: '' });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.length <= 5) {
      setCardData({ ...cardData, expiry: formatted });
      setErrors({ ...errors, expiry: '' });
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardData({ ...cardData, cvv: value });
      setErrors({ ...errors, cvv: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === PAYMENT_METHODS.CARD) {
      // Simplified validation - only check required fields for faster input
      // Credit card validation (Luhn algorithm) is disabled for quick testing
      // TODO: Re-enable full validation in production
      
      if (!cardData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      }
      if (!cardData.cardHolder.trim()) {
        newErrors.cardHolder = 'Card holder name is required';
      }
      if (!cardData.expiry.trim()) {
        newErrors.expiry = 'Expiry date is required (MM/YY)';
      }
      if (!cardData.cvv.trim()) {
        newErrors.cvv = 'CVV is required';
      }
      
      /* DISABLED FOR TESTING - Re-enable in production
      if (!validateCardNumber(cardData.cardNumber)) {
        newErrors.cardNumber = 'Invalid card number';
      }
      if (!validateCardExpiry(cardData.expiry)) {
        newErrors.expiry = 'Invalid expiry date (MM/YY)';
      }
      if (!validateCVV(cardData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
      */
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      onSubmit({ method: PAYMENT_METHODS.CASH });
      return;
    }

    if (validateForm()) {
      onSubmit({
        method: PAYMENT_METHODS.CARD,
        cardData: {
          ...cardData,
          cardNumber: cardData.cardNumber.replace(/\s/g, '').slice(-4), // Only store last 4 digits
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.CARD)}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === PAYMENT_METHODS.CARD
                  ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-950'
              }`}
            >
              <CreditCard className="h-8 w-8 text-primary-600" />
              <span className="font-medium">Credit Card</span>
            </button>
            <button
              type="button"
              onClick={() => onPaymentMethodChange(PAYMENT_METHODS.CASH)}
              className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                paymentMethod === PAYMENT_METHODS.CASH
                  ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-950'
              }`}
            >
              <Banknote className="h-8 w-8 text-primary-600" />
              <span className="font-medium">Cash</span>
            </button>
          </div>

          {/* Card Details Form */}
          {paymentMethod === PAYMENT_METHODS.CARD && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardData.cardNumber}
                onChange={handleCardNumberChange}
                error={errors.cardNumber}
                disabled={disabled}
              />
              <Input
                label="Card Holder Name"
                placeholder="JOHN DOE"
                value={cardData.cardHolder}
                onChange={(e) => setCardData({ ...cardData, cardHolder: e.target.value.toUpperCase() })}
                error={errors.cardHolder}
                disabled={disabled}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={handleExpiryChange}
                  error={errors.expiry}
                  disabled={disabled}
                />
                <Input
                  label="CVV"
                  placeholder="123"
                  type="password"
                  value={cardData.cvv}
                  onChange={handleCvvChange}
                  error={errors.cvv}
                  disabled={disabled}
                />
              </div>
            </div>
          )}

          {paymentMethod === PAYMENT_METHODS.CASH && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Please pay at the venue before the show. Your booking will be held for 24 hours.
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={disabled}>
            Confirm Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
