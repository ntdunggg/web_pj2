import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TicketCard } from '../components/TicketCard';
import { Alert } from '../components/ui/Alert';
import { Spinner } from '../components/ui/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { serviceProvider } from '../services';

export const MyTicketsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [shows, setShows] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const bookingsData = await serviceProvider.getMyBookings();
      setBookings(bookingsData);

      // Load show details for each booking
      const showPromises = bookingsData.map(booking =>
        serviceProvider.getShowById(booking.showId)
      );
      const showsData = await Promise.all(showPromises);
      
      const showsMap = {};
      showsData.forEach(show => {
        showsMap[show.id] = show;
      });
      setShows(showsMap);
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
      <div className="space-y-6 px-4 md:px-0">
        <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>

        {error && (
          <Alert variant="error">
            <p className="font-semibold">Error loading tickets</p>
            <p className="text-sm">{error}</p>
          </Alert>
        )}

        {bookings.length === 0 ? (
          <Alert variant="info">
            <p>You haven't booked any tickets yet.</p>
            <a href="/" className="text-primary hover:underline text-sm font-medium">
              Browse shows and book your first ticket!
            </a>
          </Alert>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Booking #{booking.id}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking.tickets?.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={{
                        ...ticket,
                        status: booking.status,
                        price: booking.totalAmount / booking.tickets.length,
                      }}
                      showDetails={shows[booking.showId]}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
