import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import SearchDonors from './SearchDonors';
import MyRequests from './MyRequests';

const RecipientDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');

  const tabs = [
    { id: 'search', label: 'Search Donors', icon: Search },
    { id: 'requests', label: 'My Requests', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Recipient Dashboard</h1>
          <p className="text-gray-600 mt-2">Search for available donors and manage your requests</p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'search' && <SearchDonors />}
            {activeTab === 'requests' && <MyRequests />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipientDashboard;
