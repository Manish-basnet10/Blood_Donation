import { useState, useEffect } from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import requestService from '../../services/requestService';
import { formatDateTime, getStatusColor, getUrgencyColor } from '../../utils/helpers';

const DonorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      let data;
      if (filter === 'pending') {
        data = await requestService.getPendingRequests();
      } else {
        const allRequests = await requestService.getMyRequests();
        data = allRequests.filter(req => req.status === filter);
      }
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await requestService.acceptRequest(requestId);
      toast.success('Request accepted');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) {
      return;
    }
    try {
      await requestService.rejectRequest(requestId);
      toast.success('Request rejected');
      fetchRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Donation Requests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {filter} requests found
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request from {request.recipientId?.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Patient: {request.patientName}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                </div>
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
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-semibold ml-2">{request.contactPhone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold ml-2">{formatDateTime(request.createdAt)}</span>
                </div>
              </div>

              {request.message && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {request.status === 'accepted' && (
                <div className="mt-4 p-3 bg-blue-50 rounded flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Request accepted. Please contact the recipient.
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorRequests;
