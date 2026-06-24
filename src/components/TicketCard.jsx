import { QRCodeSVG } from 'qrcode.react';
import { Calendar, MapPin, Ticket as TicketIcon } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { formatDateTime } from '../utils/dateUtils';
import { BOOKING_STATUS } from '../utils/constants';

export const TicketCard = ({ ticket, showDetails }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case BOOKING_STATUS.SUCCESS:
        return 'success';
      case BOOKING_STATUS.PENDING:
        return 'warning';
      case BOOKING_STATUS.REJECTED:
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">{showDetails?.name || 'Unknown Show'}</h3>
            <p className="text-sm opacity-90 mt-1 text-blue-100">
              {formatDateTime(showDetails?.date)}
            </p>
          </div>
          <Badge variant={getStatusVariant(ticket.status)}>
            {ticket.status?.toUpperCase() || 'UNKNOWN'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TicketIcon className="h-4 w-4 text-primary-600" />
              <span className="text-gray-500">Seat:</span>
              <span className="font-semibold text-gray-900">{ticket.seatNumber}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary-600" />
              <span className="text-gray-500">Zone:</span>
              <span className="font-semibold text-gray-900 capitalize">{ticket.zone ? ticket.zone.replace('_', ' ') : 'N/A'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary-600" />
              <span className="text-gray-500">Booking ID:</span>
              <span className="font-mono text-xs text-gray-650 text-gray-600">{ticket.id}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-500 font-medium">Amount Paid</div>
              <div className="flex justify-between items-end">
                <div className="text-2xl font-bold text-primary-600">
                  ${ticket.price?.toFixed(2) || '0.00'}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => window.print()}
                  className="cursor-pointer"
                >
                  Print Ticket
                </Button>
              </div>
            </div>
          </div>
          
          {/* Only show QR code for SUCCESS status */}
          {ticket.status === BOOKING_STATUS.SUCCESS ? (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <QRCodeSVG 
                  value={JSON.stringify({
                    ticketId: ticket.id,
                    showId: showDetails?.id || '',
                    seatNumber: ticket.seatNumber,
                    date: showDetails?.date || '',
                  })}
                  size={150}
                  level="H"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Scan at venue entrance
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 flex items-center justify-center w-full">
                <div className="text-center">
                  <TicketIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-700 font-medium">
                    {ticket.status === BOOKING_STATUS.PENDING 
                      ? 'Awaiting Payment' 
                      : 'Ticket Not Available'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 max-w-[200px] mx-auto">
                    {ticket.status === BOOKING_STATUS.PENDING 
                      ? 'QR code will be generated after payment confirmation' 
                      : 'This booking has been rejected'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
