import React, { useState, useEffect } from 'react';
import { UserPreferences, CropDiscoveryListing } from '../../types';
import { getDiscoveryListings } from '../../services/marketService';
import { Search, MapPin, Filter, ArrowUpRight, Clock, Truck, Zap, IndianRupee, Loader2 } from 'lucide-react';

interface CropDiscoveryViewProps {
  preferences: UserPreferences | null;
}

export const CropDiscoveryView: React.FC<CropDiscoveryViewProps> = ({ preferences }) => {
  const [selectedCrop, setSelectedCrop] = useState(preferences?.primaryCrop || 'Onion');
  const [listings, setListings] = useState<CropDiscoveryListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDistance, setFilterDistance] = useState<'all' | 'nearby' | 'state'>('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDiscoveryListings(selectedCrop);
      setListings(data);
      setLoading(false);
    };
    fetchData();
  }, [selectedCrop]);

  const filteredListings = listings.filter(item => {
    if (filterDistance === 'nearby') return item.distanceKm < 100;
    if (filterDistance === 'state') return item.distanceKm < 500;
    return true;
  });

  const getBadgeStyle = (tag: string) => {
    switch(tag) {
      case 'Cheapest': return 'bg-green-100 text-green-700 border-green-200';
      case 'Fastest': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Best Value': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBadgeIcon = (tag: string) => {
    switch(tag) {
      case 'Cheapest': return <IndianRupee size={12} />;
      case 'Fastest': return <Clock size={12} />;
      case 'Best Value': return <Zap size={12} />;
      default: return null;
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header & Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="text-purple-600" />
                Find Crops
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                    onClick={() => setFilterDistance('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterDistance === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All India
                </button>
                <button 
                    onClick={() => setFilterDistance('state')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterDistance === 'state' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    State
                </button>
                <button 
                    onClick={() => setFilterDistance('nearby')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterDistance === 'nearby' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Nearby
                </button>
            </div>
        </div>

        {/* Crop Selector */}
        <div className="relative">
            <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-purple-500 focus:border-purple-500 block p-3 pr-8 shadow-sm font-medium"
            >
                <option value="Onion">Onion (Pyaaz)</option>
                <option value="Tomato">Tomato (Tamatar)</option>
                <option value="Potato">Potato (Aloo)</option>
                <option value="Soybean">Soybean</option>
                <option value="Wheat">Wheat (Gehu)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <Filter size={16} />
            </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Searching mandis for best rates...</p>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredListings.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No listings found in this range.</p>
                    <button onClick={() => setFilterDistance('all')} className="text-purple-600 font-medium text-sm mt-2 hover:underline">
                        View All India
                    </button>
                </div>
            ) : (
                filteredListings.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:border-purple-300 transition-all group">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.mandi}</h3>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> {item.state} • {item.distanceKm} km away
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-bold text-gray-900 flex items-center">
                                            <IndianRupee size={18} className="text-gray-400" /> {item.pricePerQuintal}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Per Quintal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getBadgeStyle(tag)}`}>
                                        {getBadgeIcon(tag)} {tag}
                                    </span>
                                ))}
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 border border-gray-200">
                                    {item.quantityAvailable} Tons Avail.
                                </span>
                            </div>

                            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <span className="flex items-center gap-1.5" title="Estimated Logistics Cost">
                                        <Truck size={14} className="text-gray-400"/>
                                        <span className="font-medium">~₹{item.logisticsCostEst}/ton</span>
                                    </span>
                                    <span className="flex items-center gap-1.5" title="Estimated Time of Arrival">
                                        <Clock size={14} className="text-gray-400"/>
                                        <span className="font-medium">{item.etaHours}h</span>
                                    </span>
                                </div>
                                <button className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:underline">
                                    View Details <ArrowUpRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      )}
    </div>
  );
};