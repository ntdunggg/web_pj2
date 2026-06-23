import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatDateTime } from '../utils/dateUtils';
import { cn } from '../utils/cn';

export const BookingSummary = ({
  show,
  selectedSeats,
  basePrice,
  isWednesday,
  wednesdayDiscountAmount,
  priceAfterWednesday,
  totalAmount,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isCustomStyle = !!className;

  return (
    <div className={cn("sticky top-4", className || "flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12")}>
      <div
        className={isCustomStyle ? "flex justify-between items-center cursor-pointer lg:cursor-default pb-4 border-b border-primary/20" : "px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer lg:cursor-default"}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col text-left">
          <h3 className="text-xl font-semibold text-gray-900">Booking Summary</h3>
          {!isOpen && (
            <p className="lg:hidden text-sm text-gray-500 mt-1">
              {selectedSeats.length} seats • Total: <span className="font-bold text-primary-600">${totalAmount.toFixed(2)}</span>
            </p>
          )}
        </div>
        <span className="lg:hidden text-sm text-primary-600 font-semibold">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </div>

      <div className={cn("lg:block", isOpen ? "block" : "hidden")}>
        <div className={isCustomStyle ? "space-y-4 pt-4" : "px-6 py-4 space-y-4"}>
          {/* Show Details */}
          {show && (
            <div>
              <h4 className="font-semibold text-gray-900">{show.name}</h4>
              <p className="text-sm text-gray-500">{formatDateTime(show.date)}</p>
            </div>
          )}

          {/* Selected Seats */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Selected Seats ({selectedSeats.length})
            </p>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedSeats.map((seat, idx) => (
                  <Badge key={idx} variant="primary">
                    {seat.seatNumber}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No seats selected</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Base Price</span>
              <span className="font-medium text-gray-900">${basePrice.toFixed(2)}</span>
            </div>

            {isWednesday && wednesdayDiscountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Wednesday Discount (30%)
                </span>
                <span className="font-medium">-${wednesdayDiscountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-primary-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Discount Info */}
          {isWednesday && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-800">
                🎉 You're getting 30% off because this show is on a Wednesday!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
