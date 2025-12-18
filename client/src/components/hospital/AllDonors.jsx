import { useState, useEffect } from 'react';
import { Search, Droplet, MapPin, User, Phone, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../../services/api';
import { BLOOD_TYPES } from '../../utils/constants';

const AllDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodType: '',
    city: '',
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.bloodType) params.append('bloodType', filters.bloodType);
      if (filters.city) params.append('city', filters.city);

      const response = await API.get(`/users/hospital/donors?${params.toString()}`);
      setDonors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDonors();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Donors (Full Access)</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type
            </label>
            <div className="relative">
              <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="bloodType"
                value={filters.bloodType}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Blood Types</option>
                {BLOOD_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Enter city"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Search className="w-5 h-5" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Loading donors...</div>
      ) : donors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No donors found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blood Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donors.map((donor) => (
                <tr key={donor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                        <div className="text-sm text-gray-500">{donor.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{donor.bloodType}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donor.city || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{donor.address || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{donor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        donor.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {donor.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllDonors;
