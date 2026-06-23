import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Percent, DollarSign, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { serviceProvider } from '../../services';

export const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const data = await serviceProvider.getPromotions();
      setPromotions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromo = () => {
    setEditingPromo(null);
    setShowForm(true);
  };

  const handleEditPromo = (promo) => {
    setEditingPromo(promo);
    setShowForm(true);
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) {
      return;
    }

    try {
      await serviceProvider.deletePromotion(id);
      setPromotions(promotions.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFormClose = (updatedPromo) => {
    setShowForm(false);
    setEditingPromo(null);
    
    if (updatedPromo) {
      if (editingPromo) {
        setPromotions(promotions.map(p => p.id === updatedPromo.id ? updatedPromo : p));
      } else {
        setPromotions([...promotions, updatedPromo]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Promotion Management</h2>
          <p className="text-gray-500 mt-1">Create and manage discount codes and promotions</p>
        </div>
        <Button onClick={handleCreatePromo} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Promotion
        </Button>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Wednesday Discount Info */}
      <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
        <div className="flex items-start gap-3">
          <Tag className="h-6 w-6 text-primary-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-primary-900">Wednesday 30% Discount</h3>
            <p className="text-sm text-primary-800 mt-1">
              Automatically applied to all shows scheduled on Wednesdays. This is a system-wide discount and cannot be disabled.
            </p>
          </div>
        </div>
      </div>

      {showForm ? (
        <PromoForm 
          promotion={editingPromo} 
          onClose={handleFormClose}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/20">
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {promo.type === 'percentage' ? (
                        <Percent className="h-5 w-5 text-primary-600" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-primary-600" />
                      )}
                      <Badge variant="primary" className="text-lg font-mono">
                        {promo.code}
                      </Badge>
                    </div>
                    <Badge variant={promo.active ? 'success' : 'default'}>
                      {promo.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {promo.description}
                  </p>

                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-primary-600">
                      {promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}
                      <span className="text-sm text-gray-500 font-normal ml-2">off</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 mt-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => handleEditPromo(promo)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDeletePromo(promo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PromoForm = ({ promotion, onClose }) => {
  const [formData, setFormData] = useState({
    code: promotion?.code || '',
    description: promotion?.description || '',
    type: promotion?.type || 'percentage',
    value: promotion?.value || 10,
    active: promotion?.active !== false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.value <= 0) {
      setError('Value must be greater than 0');
      return;
    }

    if (formData.type === 'percentage' && formData.value > 100) {
      setError('Percentage cannot exceed 100%');
      return;
    }

    try {
      setLoading(true);
      const promoData = {
        ...formData,
        code: formData.code.toUpperCase(),
      };

      const result = promotion
        ? await serviceProvider.updatePromotion(promotion.id, promoData)
        : await serviceProvider.createPromotion(promoData);

      onClose(result);
    } catch (err) {
      setError(err.message || 'Failed to save promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
      <div className="flex justify-between items-center pb-4 mb-4 border-b border-primary/10">
        <h3 className="text-xl font-semibold text-gray-900">
          {promotion ? 'Edit Promotion' : 'Create New Promotion'}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => onClose()} className="cursor-pointer">
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div>
        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Promotion Code"
            placeholder="SAVE20"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              rows="3"
              placeholder="10% off any booking"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'percentage' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  formData.type === 'percentage'
                    ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Percent className="h-6 w-6 text-primary-600" />
                <span className="font-medium">Percentage</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'fixed' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  formData.type === 'fixed'
                    ? 'border-primary-600 bg-primary-50 text-primary-900 font-semibold'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-600 hover:text-gray-900'
                }`}
              >
                <DollarSign className="h-6 w-6 text-primary-600" />
                <span className="font-medium">Fixed Amount</span>
              </button>
            </div>
          </div>

          <Input
            label={formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount ($)'}
            type="number"
            min="0"
            max={formData.type === 'percentage' ? '100' : undefined}
            step={formData.type === 'percentage' ? '1' : '0.01'}
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
            required
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 text-primary bg-white border border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <label htmlFor="active" className="text-sm text-gray-700 cursor-pointer">
              Active (customers can use this promotion)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 cursor-pointer" disabled={loading}>
              {loading ? 'Saving...' : promotion ? 'Update Promotion' : 'Create Promotion'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onClose()} className="cursor-pointer">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
