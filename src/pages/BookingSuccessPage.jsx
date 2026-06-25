import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';

export const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    navigate('/');
    return null;
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Successful!
          </h1>
          <p className="text-gray-500">
            Your tickets have been booked successfully.
          </p>
        </div>

        <Alert variant="success" className="mb-6">
          <p className="font-semibold">Booking ID: {booking.id}</p>
          <p className="text-sm mt-1">
            {booking.status === 'success' 
              ? 'Your payment has been confirmed. You will receive a confirmation email shortly.'
              : 'Your booking has been received. You will receive a confirmation email shortly.'}
          </p>
        </Alert>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Number of Tickets:</span>
                <span className="font-semibold text-gray-900">{booking.tickets?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-semibold text-primary-600">
                  ${booking.totalAmount?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-semibold text-gray-900 capitalize">{booking.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`font-semibold capitalize ${
                  booking.status === 'success' ? 'text-green-600' : 
                  booking.status === 'pending' ? 'text-yellow-600' : 'text-gray-550 text-gray-500'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {booking.paymentMethod === 'cash' && booking.status === 'pending' && (
          <Alert variant="warning" className="mb-6">
            <p className="font-semibold">Cash Payment Pending</p>
            <p className="text-sm mt-1">
              Please complete payment at the venue box office before the show. Your booking will be held for 24 hours. 
              After payment confirmation, your QR code tickets will be generated.
            </p>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            className="flex-1"
            onClick={() => navigate('/my-tickets')}
          >
            View My Tickets
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};
