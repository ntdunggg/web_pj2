import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '../components/Layout';
import { SeatingChart } from '../components/SeatingChart';
import { BookingSummary } from '../components/BookingSummary';
import { PaymentForm } from '../components/PaymentForm';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Spinner, LoadingOverlay } from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../hooks/useBooking';
import { serviceProvider } from '../services';

export const ShowDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [show, setShow] = useState(null);
  const [seatData, setSeatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Select seats, 2: Payment

  const booking = useBooking(show);

  useEffect(() => {
    loadShowDetails();
  }, [id]);

  const loadShowDetails = async () => {
    try {
      setLoading(true);
      const [showData, seats] = await Promise.all([
        serviceProvider.getShowById(id),
        serviceProvider.getSeatAvailability(id),
      ]);
      setShow(showData);
      setSeatData(seats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const handlePayment = async (paymentData) => {
    if (!user) {
      navigate('/login', { state: { from: `/show/${id}` } });
      return;
    }

    try {
      setSubmitting(true);
      
      console.log('Creating booking for user:', user);
      
      const bookingData = {
        userId: user.id,
        showId: show.id,
        seats: booking.selectedSeats,
        paymentMethod: paymentData.method,
        totalAmount: booking.totalAmount,
        baseAmount: booking.basePrice,
        discounts: {
          wednesday: booking.wednesdayDiscountAmount,
        },
        contactPhone: paymentData.phone || null,
        deliveryAddress: paymentData.address || null,
      };

      console.log('Booking data:', bookingData);
      const result = await serviceProvider.createBooking(bookingData);
      console.log('Booking result:', result);
      
      // Navigate to success page with booking details
      navigate('/booking-success', { state: { booking: result } });
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error && !show) {
    return (
      <Layout>
        <Alert variant="error">
          <p className="font-semibold">Error loading show details</p>
          <p className="text-sm">{error}</p>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      {submitting && <LoadingOverlay message="Processing your booking..." />}
      
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shows
        </Button>

        {/* Show Header */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={show.image}
              alt={show.name}
              className="w-full md:w-64 h-48 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {show.name}
              </h1>
              <p className="text-gray-600 mb-4">{show.description}</p>
              
              {booking.isWednesday && (
                <Alert variant="success" className="mb-4">
                  <p className="font-semibold">🎉 Wednesday Special!</p>
                  <p className="text-sm">Get 30% off on all tickets for this show.</p>
                </Alert>
              )}
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        {/* Main Content */}
        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Seating Chart */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Select Your Seats
                </h2>
                <SeatingChart
                  seatData={seatData}
                  onSeatSelect={booking.toggleSeat}
                  selectedSeats={booking.selectedSeats}
                />
              </div>
            </div>

            {/* Booking Summary */}
            <div>
              <BookingSummary
                show={show}
                selectedSeats={booking.selectedSeats}
                basePrice={booking.basePrice}
                isWednesday={booking.isWednesday}
                wednesdayDiscountAmount={booking.wednesdayDiscountAmount}
                priceAfterWednesday={booking.priceAfterWednesday}
                totalAmount={booking.totalAmount}
              />

              <Button
                className="w-full mt-4"
                size="lg"
                onClick={() => setStep(2)}
                disabled={booking.selectedSeats.length === 0}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <PaymentForm
                paymentMethod={booking.paymentMethod}
                onPaymentMethodChange={booking.setPaymentMethod}
                onSubmit={handlePayment}
                disabled={submitting}
                amount={booking.totalAmount}
                className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12"
              />
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => setStep(1)}
                disabled={submitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Seat Selection
              </Button>
            </div>

            {/* Booking Summary */}
            <div>
              <BookingSummary
                show={show}
                selectedSeats={booking.selectedSeats}
                basePrice={booking.basePrice}
                isWednesday={booking.isWednesday}
                wednesdayDiscountAmount={booking.wednesdayDiscountAmount}
                priceAfterWednesday={booking.priceAfterWednesday}
                totalAmount={booking.totalAmount}
                className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12"
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
