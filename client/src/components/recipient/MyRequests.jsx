import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import requestService from '../../services/requestService';
import { formatDateTime, getStatusColor } from '../../utils/helpers';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(req => req.status === filter);

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No requests found
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(request.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Request to {request.donorId?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Patient: {request.patientName}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-600">Blood Type:</span>
                  <span className="font-semibold ml-2">{request.bloodType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Units:</span>
                  <span className="font-semibold ml-2">{request.unitsNeeded}</span>
                </div>
                <div>
                  <span className="text-gray-600">Urgency:</span>
                  <span className="font-semibold ml-2 capitalize">{request.urgency}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold ml-2">{formatDateTime(request.createdAt)}</span>
                </div>
              </div>

              {request.status === 'accepted' && request.donorId && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Contact Information:</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <p><strong>Phone:</strong> {request.donorId.phone}</p>
                    {request.donorId.address && (
                      <p><strong>Address:</strong> {request.donorId.address}, {request.donorId.city}</p>
                    )}
                  </div>
                </div>
              )}

              {request.message && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
