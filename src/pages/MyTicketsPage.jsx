import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { serviceProvider } from '../services';
import { formatDateTime } from '../utils/dateUtils';

export const MyTicketsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    loadTickets();
  }, [user?.id, location.key]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const bookingsData = await serviceProvider.getMyBookings();

      // Load show details for each booking, handling missing shows gracefully
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

      // Enrich bookings with show data to match quickshow's pattern
      const enrichedBookings = bookingsData.map(booking => ({
        ...booking,
        show: showsMap[booking.showId] || { id: booking.showId, name: 'Deleted/Unknown Show', date: '' }
      }));

      setBookings(enrichedBookings);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tickets</h1>

        {error && (
          <Alert variant="error" className="mb-6">
            <p className="font-semibold">Error loading tickets</p>
            <p className="text-sm">{error}</p>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Alert variant="info">
            <p>You haven't booked any tickets yet.</p>
            <a href="/" className="text-primary-600 hover:underline text-sm font-medium">
              Browse shows and book your first ticket!
            </a>
          </Alert>
        ) : (
          <div className="space-y-6">
            {bookings.map((item, index) => {
              const isPaid = item.status === 'success';
              const seatNumbers = item.tickets?.map(t => t.seatNumber).join(', ') || '';

              return (
                <div key={index} className="mt-4 max-w-3xl rounded-3xl border border-primary/20 bg-primary/8 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
                  <div className="flex flex-col justify-between md:flex-row">
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={item.show?.image}
                        alt={item.show?.name}
                        className="aspect-video h-auto rounded-2xl object-cover object-center md:max-w-45"
                      />
                      <div className="flex flex-col p-4">
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-semibold text-gray-900">{item.show?.name}</p>
                          <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] font-semibold ${isPaid
                            ? 'bg-emerald-500/15 text-emerald-600'
                            : item.paymentMethod === 'cash'
                              ? 'bg-amber-500/15 text-amber-600'
                              : 'bg-rose-500/15 text-rose-600'
                            }`}>
                            {isPaid ? 'Paid' : item.paymentMethod === 'cash' ? 'Pending Cash Pay' : 'Unpaid'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">Duration: 2-3 hours</p>
                        <p className="mt-auto text-sm text-gray-500">{formatDateTime(item.show?.date)}</p>
                        {item.show?.isWednesday && (
                          <p className="mt-2 text-sm text-emerald-600 font-medium">
                            Wednesday deal applied: 30% off
                          </p>
                        )}
                        {item.paymentMethod && (
                          <p className="mt-2 text-sm text-gray-500">
                            Payment method: <span className="font-medium text-gray-750 text-gray-700 capitalize">{item.paymentMethod}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between p-4 md:items-end md:text-right">
                      <div className="flex items-center gap-4">
                        <p className="mb-3 text-2xl font-bold text-primary-600">
                          ${item.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p><span className="text-gray-400">Total Tickets:</span> {item.tickets?.length || 0}</p>
                        <p><span className="text-gray-400">Seat Number:</span> {seatNumbers}</p>
                        <p><span className="text-gray-400">Status:</span> <span className="font-medium capitalize">{item.status}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};
