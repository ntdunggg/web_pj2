import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { serviceProvider } from '../services';
import { formatDateTime } from '../utils/dateUtils';
import { BOOKING_STATUS } from '../utils/constants';

export const StaffDashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [shows, setShows] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await serviceProvider.getAllBookings();
      setBookings(bookingsData);

      // Load show details, handling missing shows gracefully
      const uniqueShowIds = [...new Set(bookingsData.map(b => b.showId))];
      const showsMap = {};
      
      await Promise.all(
        uniqueShowIds.map(async (showId) => {
          try {
            const show = await serviceProvider.getShowById(showId);
            showsMap[showId] = show;
          } catch (err) {
            console.warn(`Could not load details for show ${showId}:`, err);
            showsMap[showId] = { id: showId, name: 'Deleted/Unknown Show', date: '' };
          }
        })
      );
      
      setShows(showsMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      setUpdating(bookingId);
      await serviceProvider.updateBookingStatus(bookingId, status);

      // Update local state
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, status } : b
      ));

      setError(null);
    } catch (err) {
      setError(`Failed to update booking status: ${err.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BOOKING_STATUS.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case BOOKING_STATUS.REJECTED:
        return <XCircle className="h-5 w-5 text-rose-400" />;
      default:
        return <Clock className="h-5 w-5 text-amber-400" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case BOOKING_STATUS.SUCCESS:
        return 'success';
      case BOOKING_STATUS.REJECTED:
        return 'danger';
      default:
        return 'warning';
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

  return (
    <Layout>
      <div className="space-y-6 px-4 md:px-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-500 mt-2">View and manage all bookings</p>
        </div>

        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {bookings.filter(b => b.status === BOOKING_STATUS.SUCCESS).length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {bookings.filter(b => b.status === BOOKING_STATUS.REJECTED).length}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
          <div className="pb-4 mb-4 border-b border-primary/10">
            <h2 className="text-xl font-semibold text-gray-900">All Bookings</h2>
          </div>
          <div>
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No bookings found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left text-gray-800 border-b border-gray-200">
                      <th className="p-3 font-semibold pl-5">
                        Booking ID
                      </th>
                      <th className="p-3 font-semibold">
                        Show
                      </th>
                      <th className="p-3 font-semibold">
                        Date
                      </th>
                      <th className="p-3 font-semibold">
                        Seats
                      </th>
                      <th className="p-3 font-semibold">
                        Amount
                      </th>
                      <th className="p-3 font-semibold">
                        Payment
                      </th>
                      <th className="p-3 font-semibold">
                        Status
                      </th>
                      <th className="p-3 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-normal text-gray-700">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                        <td className="p-3 min-w-45 pl-5 font-mono text-xs">
                          {booking.id}
                        </td>
                        <td className="p-3 font-medium text-gray-900">
                          {shows[booking.showId]?.name || 'Unknown'}
                        </td>
                        <td className="p-3">
                          {formatDateTime(shows[booking.showId]?.date || '')}
                        </td>
                        <td className="p-3">
                          {booking.tickets?.length || 0}
                        </td>
                        <td className="p-3 font-semibold text-gray-900">
                          ${booking.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="p-3">
                          <Badge variant={booking.paymentMethod === 'card' ? 'primary' : 'default'}>
                            {booking.paymentMethod}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-3">
                          {booking.status === BOOKING_STATUS.PENDING && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleUpdateStatus(booking.id, BOOKING_STATUS.SUCCESS)}
                                disabled={updating === booking.id}
                                className="cursor-pointer"
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleUpdateStatus(booking.id, BOOKING_STATUS.REJECTED)}
                                disabled={updating === booking.id}
                                className="cursor-pointer"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
