import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { Spinner } from '../ui/Spinner';
import { serviceProvider } from '../../services';

const COLORS = ['#f84565', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'];

export const ReportsAndCharts = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [revenue, occupancy] = await Promise.all([
        serviceProvider.getRevenueReport(),
        serviceProvider.getSeatOccupancy(),
      ]);
      setRevenueData(revenue);
      setOccupancyData(occupancy);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <p className="font-semibold text-white">Error loading reports</p>
        <p className="text-sm">{error}</p>
      </Alert>
    );
  }

  const paymentMethodData = [
    { name: 'VNPay / VietQR', value: revenueData.paymentMethods.vnpay || 0, color: '#3b82f6' },
    { name: 'Cash', value: revenueData.paymentMethods.cash, color: '#10b981' },
  ];

  const totalBookings = revenueData.revenueByShow.reduce((sum, show) => sum + show.bookings, 0);
  const totalSeats = occupancyData.reduce((sum, show) => sum + show.soldSeats, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <p className="text-gray-500 mt-1">Revenue insights and performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${revenueData.totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalBookings}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets Sold</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalSeats}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Ticket className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Occupancy</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {(occupancyData.reduce((sum, show) => sum + parseFloat(show.occupancyRate), 0) / occupancyData.length).toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Show */}
      <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
        <div className="pb-4 mb-4 border-b border-primary/10">
          <h3 className="text-xl font-semibold text-gray-900">Revenue by Show</h3>
        </div>
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData.revenueByShow}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.5} />
              <XAxis dataKey="showName" stroke="#4b5563" tick={{ fill: '#4b5563' }} />
              <YAxis stroke="#4b5563" tick={{ fill: '#4b5563' }} />
              <Tooltip 
                formatter={(value) => `$${value.toFixed(2)}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
              />
              <Legend wrapperStyle={{ color: '#111827' }} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
          <div className="pb-4 mb-4 border-b border-primary/10">
            <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {paymentMethodData.map((method) => (
                <div key={method.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: method.color }}></div>
                    <span className="text-sm text-gray-650 text-gray-600">{method.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">${method.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seat Occupancy */}
        <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
          <div className="pb-4 mb-4 border-b border-primary/10">
            <h3 className="text-xl font-semibold text-gray-900">Seat Occupancy</h3>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={occupancyData} layout="horizontal">
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" opacity={0.5} />
                <XAxis type="number" stroke="#4b5563" tick={{ fill: '#4b5563' }} />
                <YAxis dataKey="showName" type="category" width={100} stroke="#4b5563" tick={{ fill: '#4b5563' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#111827' }}
                />
                <Legend wrapperStyle={{ color: '#111827' }} />
                <Bar dataKey="soldSeats" fill="#10b981" name="Sold Seats" />
                <Bar dataKey="availableSeats" fill="#e5e7eb" name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Seat Occupancy Table */}
      <div className="flex w-full flex-col justify-between rounded-3xl border border-primary/20 bg-primary/15 p-6 backdrop-blur-sm transition duration-300 hover:bg-primary/20">
        <div className="pb-4 mb-4 border-b border-primary/10">
          <h3 className="text-xl font-semibold text-gray-900">Detailed Seat Occupancy</h3>
        </div>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-800 border-b border-gray-200">
                  <th className="p-3 font-semibold pl-5">
                    Show
                  </th>
                  <th className="p-3 font-semibold text-right">
                    Total Seats
                  </th>
                  <th className="p-3 font-semibold text-right">
                    Sold
                  </th>
                  <th className="p-3 font-semibold text-right">
                    Available
                  </th>
                  <th className="p-3 font-semibold text-right">
                    Occupancy
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm font-normal text-gray-700">
                {occupancyData.map((show, idx) => (
                  <tr key={idx} className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                    <td className="p-3 min-w-45 pl-5 font-semibold text-gray-900">
                      {show.showName}
                    </td>
                    <td className="p-3 text-right">
                      {show.totalSeats}
                    </td>
                    <td className="p-3 text-right">
                      {show.soldSeats}
                    </td>
                    <td className="p-3 text-right">
                      {show.availableSeats}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`font-bold ${
                        parseFloat(show.occupancyRate) >= 80 ? 'text-green-600' :
                        parseFloat(show.occupancyRate) >= 50 ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {show.occupancyRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
