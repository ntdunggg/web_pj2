import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { serviceProvider } from '../../services';
import { formatDateTime } from '../../utils/dateUtils';

export const EventManagement = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

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

  const handleCreateShow = () => {
    setEditingShow(null);
    setShowForm(true);
  };

  const handleEditShow = (show) => {
    setEditingShow(show);
    setShowForm(true);
  };

  const handleDeleteShow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this show?')) {
      return;
    }

    try {
      await serviceProvider.deleteShow(id);
      setShows(shows.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormClose = (updatedShow) => {
    setShowForm(false);
    setEditingShow(null);
    
    if (updatedShow) {
      if (editingShow) {
        setShows(shows.map(s => s.id === updatedShow.id ? updatedShow : s));
      } else {
        setShows([...shows, updatedShow]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-500 mt-1">Create and manage shows</p>
        </div>
        <Button onClick={handleCreateShow} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add New Show
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {showForm ? (
        <ShowForm 
          show={editingShow} 
          onClose={handleFormClose}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shows.map((show) => (
            <Card key={show.id}>
              <div className="relative aspect-video overflow-hidden border-b border-gray-200">
                <img
                  src={show.image}
                  alt={show.name}
                  className="w-full h-full object-cover"
                />
                <Badge variant={show.status === 'active' ? 'success' : 'default'} 
                  className="absolute top-2 right-2">
                  {show.status}
                </Badge>
              </div>
              <CardContent className="p-4 space-y-3 bg-white">
                <h3 className="text-lg font-bold text-gray-900">
                  {show.name}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {show.description}
                </p>
                <div className="text-sm text-gray-650 text-gray-600">
                  <strong className="text-primary-600 font-medium mr-1 font-semibold">Date:</strong> {formatDateTime(show.date)}
                </div>
                <div className="text-sm text-gray-655 text-gray-650 text-gray-600">
                  <strong className="text-primary-600 font-medium mr-1 font-semibold">Pricing:</strong> Zone A: ${show.pricing.zone_a}, 
                  Zone B: ${show.pricing.zone_b}, 2nd Floor: ${show.pricing.level_2}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => handleEditShow(show)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDeleteShow(show.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const ShowForm = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    name: show?.name || '',
    description: show?.description || '',
    date: show?.date ? new Date(show.date).toISOString().slice(0, 16) : '',
    image: show?.image || '',
    pricing: {
      zone_a: show?.pricing?.zone_a || 100,
      zone_b: show?.pricing?.zone_b || 75,
      level_2: show?.pricing?.level_2 || 50,
    },
  });
  const [imagePreview, setImagePreview] = useState(show?.image || '');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);

      let imageUrl = formData.image;
      if (imageFile) {
        const uploadResult = await serviceProvider.uploadShowImage(imageFile);
        imageUrl = uploadResult.url;
      }

      const showData = {
        ...formData,
        image: imageUrl,
        date: new Date(formData.date).toISOString(),
      };

      const result = show
        ? await serviceProvider.updateShow(show.id, showData)
        : await serviceProvider.createShow(showData);

      onClose(result);
    } catch (err) {
      setError(err.message || 'Failed to save show');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {show ? 'Edit Show' : 'Create New Show'}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => onClose()} className="cursor-pointer">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Show Name"
            placeholder="The Phantom of the Opera"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              rows="4"
              placeholder="A spectacular musical phenomenon..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <Input
            label="Date & Time"
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Show Image
            </label>
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex-shrink-0">
                  <Button type="button" variant="outline" as="span" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </label>
                <Input
                  placeholder="Or paste image URL"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Zone Pricing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Zone Pricing ($)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Zone A"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.zone_a}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, zone_a: parseFloat(e.target.value) }
                })}
                required
              />
              <Input
                label="Zone B"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.zone_b}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, zone_b: parseFloat(e.target.value) }
                })}
                required
              />
              <Input
                label="2nd Floor"
                type="number"
                min="0"
                step="0.01"
                value={formData.pricing.level_2}
                onChange={(e) => setFormData({
                  ...formData,
                  pricing: { ...formData.pricing, level_2: parseFloat(e.target.value) }
                })}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 cursor-pointer" disabled={loading}>
              {loading ? 'Saving...' : show ? 'Update Show' : 'Create Show'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onClose()} className="cursor-pointer">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
