import React from 'react';
import { useAppState } from '../state/AppState';
import { useI18n } from '../i18n/I18nContext';
import { VoiceMic } from './VoiceMic';
import { SaathiDidi } from './SaathiDidi';
import { CropDiscoveryView } from './dashboard/CropDiscoveryView';
import { BuyerOrdersView } from './dashboard/BuyerOrdersView';
import { ProduceManageView } from './dashboard/ProduceManageView';
import { PickupRequestView } from './dashboard/PickupRequestView';
import { LogisticsJobsView } from './dashboard/LogisticsJobsView';
import { Truck, Home, List, Package } from 'lucide-react';
import { listPickupRequests } from '../services/mvpDataService';
import type { PickupRequest } from '../types';

const FarmerRequests: React.FC = () => {
  const { t, lang } = useI18n();
  const [items, setItems] = React.useState<PickupRequest[]>([]);
  React.useEffect(() => {
    listPickupRequests().then(setItems);
  }, []);
  return (
    <div className="p-4 pb-28">
      <h2 className="text-xl font-bold">{lang === 'hi' ? 'मेरी रिक्वेस्ट' : 'My requests'}</h2>
      <div className="mt-4 space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500">{lang === 'hi' ? 'अभी कोई रिक्वेस्ट नहीं' : 'No requests yet'}</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="bg-white border rounded-xl p-4">
              <p className="font-bold">{r.farmerName}</p>
              <p className="text-sm text-gray-600">
                {r.pickupLocation} → {r.dropLocation}
              </p>
              <span className="inline-block mt-2 text-xs font-bold px-2 py-1 rounded-full bg-gray-100">{r.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { state, setCurrentDashboardView, logout, setCurrentScreen } = useAppState();
  const { lang } = useI18n();

  const role = state.userRole;
  const dv = state.currentDashboardView;

  if (!role || !dv) return null;

  const setView = (view: any) => setCurrentDashboardView({ role, view } as any);

  const title =
    role === 'farmer'
      ? (dv.view === 'home' ? (lang === 'hi' ? 'किसान' : 'Farmer') : dv.view === 'book_vehicle' ? (lang === 'hi' ? 'गाड़ी बुक' : 'Book') : (lang === 'hi' ? 'मेरी रिक्वेस्ट' : 'My requests'))
      : role === 'transporter'
        ? (dv.view === 'home' ? (lang === 'hi' ? 'ड्राइवर' : 'Driver') : dv.view === 'jobs' ? (lang === 'hi' ? 'काम' : 'Jobs') : (lang === 'hi' ? 'मेरी ट्रिप' : 'My trips'))
        : (dv.view === 'home' ? (lang === 'hi' ? 'खरीदार' : 'Buyer') : dv.view === 'browse' ? (lang === 'hi' ? 'फसल देखें' : 'Browse') : (lang === 'hi' ? 'ऑर्डर' : 'Orders'));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">{title}</span>
        <button
          type="button"
          onClick={() => {
            logout();
            setCurrentScreen('landing');
          }}
          className="text-red-600 font-bold"
        >
          {lang === 'hi' ? 'बाहर' : 'Logout'}
        </button>
      </header>

      <main className="max-w-3xl mx-auto">
        {role === 'farmer' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button onClick={() => setView('book_vehicle')} className="w-full min-h-[56px] rounded-2xl bg-green-600 text-white text-lg font-bold">
              {lang === 'hi' ? 'गाड़ी बुक करें' : 'Book vehicle'}
            </button>
            <button onClick={() => setView('my_requests')} className="w-full min-h-[56px] rounded-2xl bg-white border-2 text-green-800 text-lg font-bold">
              {lang === 'hi' ? 'रिक्वेस्ट देखें' : 'My requests'}
            </button>
          </div>
        )}
        {role === 'farmer' && dv.view === 'book_vehicle' && <PickupRequestView preferences={null} />}
        {role === 'farmer' && dv.view === 'my_requests' && <FarmerRequests />}

        {role === 'transporter' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button onClick={() => setView('jobs')} className="w-full min-h-[56px] rounded-2xl bg-orange-600 text-white text-lg font-bold">
              {lang === 'hi' ? 'काम दिखाओ' : 'Show jobs'}
            </button>
            <button onClick={() => setView('my_trips')} className="w-full min-h-[56px] rounded-2xl bg-white border-2 text-orange-700 text-lg font-bold">
              {lang === 'hi' ? 'मेरी ट्रिप' : 'My trips'}
            </button>
          </div>
        )}
        {role === 'transporter' && dv.view === 'jobs' && <LogisticsJobsView preferences={null} />}
        {role === 'transporter' && dv.view === 'my_trips' && <LogisticsJobsView preferences={null} />}

        {role === 'buyer' && dv.view === 'home' && (
          <div className="p-4 space-y-4 pb-28">
            <button onClick={() => setView('browse')} className="w-full min-h-[56px] rounded-2xl bg-purple-600 text-white text-lg font-bold">
              {lang === 'hi' ? 'फसल देखें' : 'Browse'}
            </button>
            <button onClick={() => setView('orders')} className="w-full min-h-[56px] rounded-2xl bg-white border-2 text-purple-700 text-lg font-bold">
              {lang === 'hi' ? 'मेरे ऑर्डर' : 'Orders'}
            </button>
          </div>
        )}
        {role === 'buyer' && dv.view === 'browse' && <CropDiscoveryView preferences={null} />}
        {role === 'buyer' && dv.view === 'orders' && <BuyerOrdersView preferences={null} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <button type="button" onClick={() => setView('home')} className="flex flex-col items-center text-gray-600">
          <Home className="w-5 h-5" />
          <span className="text-[10px]">{lang === 'hi' ? 'होम' : 'Home'}</span>
        </button>
        {role === 'farmer' && (
          <button type="button" onClick={() => setView('book_vehicle')} className="flex flex-col items-center text-gray-600">
            <Truck className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'बुक' : 'Book'}</span>
          </button>
        )}
        {role === 'farmer' && (
          <button type="button" onClick={() => setView('my_requests')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'रिक्वेस्ट' : 'Requests'}</span>
          </button>
        )}
        {role === 'transporter' && (
          <button type="button" onClick={() => setView('jobs')} className="flex flex-col items-center text-gray-600">
            <Truck className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'काम' : 'Jobs'}</span>
          </button>
        )}
        {role === 'transporter' && (
          <button type="button" onClick={() => setView('my_trips')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'ट्रिप' : 'Trips'}</span>
          </button>
        )}
        {role === 'buyer' && (
          <button type="button" onClick={() => setView('browse')} className="flex flex-col items-center text-gray-600">
            <List className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'देखें' : 'Browse'}</span>
          </button>
        )}
        {role === 'buyer' && (
          <button type="button" onClick={() => setView('orders')} className="flex flex-col items-center text-gray-600">
            <Package className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'hi' ? 'ऑर्डर' : 'Orders'}</span>
          </button>
        )}
      </nav>

      <SaathiDidi />
      <VoiceMic />
    </div>
  );
};
