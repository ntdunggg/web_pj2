import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Layout } from '../components/Layout';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { serviceProvider } from '../services';
import { formatDateTime, isDateWednesday } from '../utils/dateUtils';

export const HomePage = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      setLoading(true);
      const data = await serviceProvider.getShows();
      setShows(data);
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

  if (error) {
    return (
      <Layout>
        <Alert variant="error">
          <p className="font-semibold">Error loading shows</p>
          <p className="text-sm">{error}</p>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600/60 to-primary-800/60 rounded-3xl p-8 md:p-12 text-white shadow-lg backdrop-blur-sm">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Welcome to NTDFilm
          </h1>
          <p className="text-xl opacity-90 max-w-2xl text-white">
            Book your seats for the most amazing performances. Enjoy exclusive Wednesday discounts!
          </p>
        </div>

        {/* Shows Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upcoming Shows
          </h2>

          {shows.length === 0 ? (
            <Alert variant="info">
              No shows available at the moment. Check back soon!
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const ShowCard = ({ show }) => {
  const isWednesday = isDateWednesday(show.date);

  return (
    <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-3 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/12">
      <div>
        {/* Show Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={show.image}
            alt={show.name}
            className="w-full h-full object-cover"
          />
          {isWednesday && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning">
                <Tag className="h-3 w-3 mr-1" />
                30% OFF
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {show.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2">
            {show.description}
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-primary-600" />
              <span>{formatDateTime(show.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-primary-600" />
              <span>Duration: 2-3 hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 mt-auto">
        {/* Pricing */}
        <div className="border-t border-gray-200 pt-3 mb-3">
          <p className="text-xs text-gray-500 mb-1 font-medium">Starting from</p>
          <div className="flex items-baseline gap-2">
            {isWednesday && (
              <span className="text-sm text-gray-400 line-through">
                ${show.pricing.level_2}
              </span>
            )}
            <span className="text-2xl font-bold text-primary-600">
              ${isWednesday ? (show.pricing.level_2 * 0.7).toFixed(2) : show.pricing.level_2}
            </span>
          </div>
        </div>

        <Link to={`/show/${show.id}`}>
          <Button className="w-full mt-4 cursor-pointer">
            Book Tickets
          </Button>
        </Link>
      </div>
    </div>
  );
};
