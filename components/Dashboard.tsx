import React, { useState } from 'react';
import { DashboardView, Shipment, UserRole, DashboardProps } from '../types';
import { BookingView } from './dashboard/BookingView';
import { TrackingView } from './dashboard/TrackingView';
import { SupportView } from './dashboard/SupportView';
import { WalletView } from './dashboard/WalletView';
import { MarketRatesView } from './dashboard/MarketRatesView';
import { CropDiscoveryView } from './dashboard/CropDiscoveryView';
import { PersonaManager } from './PersonaManager';
import { LayoutGrid, Truck, Map, Headphones, UserCircle, LogOut, Users, ChevronDown, Wallet, TrendingUp, DollarSign, AlertCircle, Search } from 'lucide-react';

export const Dashboard: React.FC<DashboardProps> = ({ userRole, userPreferences, wallet, onLogout, onSwitchPersona, onEditPreferences }) => {
  const [currentView, setCurrentView] = useState<DashboardView>(DashboardView.HOME);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [showPersonaManager, setShowPersonaManager] = useState(false);

  const handleBookShipment = (shipment: Shipment) => {
    setShipments(prev => [shipment, ...prev]);
  };

  const isProfileIncomplete = !userPreferences || !userPreferences.location || !userPreferences.primaryCrop;

  // Define menu items
  const allMenuItems = [
    { id: DashboardView.BOOK_TRANSPORT, label: 'Book Transport', icon: Truck, color: 'text-green-600 bg-green-50', roles: [UserRole.FARMER, UserRole.FPO] },
    { id: DashboardView.BOOK_TRANSPORT, label: 'Find Loads', icon: Truck, color: 'text-orange-600 bg-orange-50', roles: [UserRole.TRANSPORTER] },
    
    // New Buyer View
    { id: DashboardView.CROP_DISCOVERY, label: 'Find Crops', icon: Search, color: 'text-purple-600 bg-purple-50', roles: [UserRole.BUYER] },

    { id: DashboardView.TRACK_SHIPMENT, label: 'Track Shipment', icon: Map, color: 'text-blue-600 bg-blue-50', roles: [UserRole.FARMER, UserRole.FPO, UserRole.BUYER] },
    { id: DashboardView.TRACK_SHIPMENT, label: 'My Trips', icon: Map, color: 'text-blue-600 bg-blue-50', roles: [UserRole.TRANSPORTER] },
    { id: DashboardView.MARKET_RATES, label: 'Mandi Rates', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50', roles: [UserRole.FARMER, UserRole.FPO] },
    { id: DashboardView.WALLET, label: 'Wallet', icon: Wallet, color: 'text-yellow-600 bg-yellow-50', roles: [UserRole.FARMER, UserRole.FPO, UserRole.BUYER, UserRole.TRANSPORTER] },
    { id: DashboardView.SUPPORT, label: 'Support', icon: Headphones, color: 'text-purple-600 bg-purple-50', roles: [UserRole.FARMER, UserRole.FPO, UserRole.BUYER, UserRole.TRANSPORTER] },
    { id: DashboardView.PROFILE, label: 'Profile', icon: UserCircle, color: 'text-gray-600 bg-gray-50', roles: [UserRole.FARMER, UserRole.FPO, UserRole.BUYER, UserRole.TRANSPORTER] },
  ];

  // Filter menu items based on role
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  const renderContent = () => {
    switch (currentView) {
      case DashboardView.BOOK_TRANSPORT:
        return <BookingView onBook={handleBookShipment} />;
      case DashboardView.TRACK_SHIPMENT:
        return <TrackingView activeShipments={shipments} />;
      case DashboardView.SUPPORT:
        return <SupportView />;
      case DashboardView.WALLET:
        return <WalletView wallet={wallet} />;
      case DashboardView.MARKET_RATES:
        return <MarketRatesView preferences={userPreferences} />;
      case DashboardView.CROP_DISCOVERY:
        return <CropDiscoveryView preferences={userPreferences} />;
      case DashboardView.PROFILE:
        return (
            <div className="p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <UserCircle size={40} className="text-gray-500" />
                </div>
                <h2 className="text-xl font-bold">{userRole}</h2>
                <p className="text-gray-500 mb-6">{userPreferences?.location || 'Location not set'} • Active Member</p>
                <button onClick={onEditPreferences} className="mb-6 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Edit Profile Details
                </button>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800 text-sm mb-6">
                    Verified Member since 2023
                </div>
                <button onClick={onLogout} className="text-red-600 font-medium hover:underline flex items-center justify-center gap-2 mx-auto">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        );
      default:
        // Home View - Overview
        return (
          <div className="p-4 space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Namaste!</h2>
                        <div 
                          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:bg-white/30 transition-colors inline-flex mt-1"
                          onClick={() => setShowPersonaManager(true)}
                        >
                           <Users size={14} />
                           <span>{userRole}</span>
                           <ChevronDown size={14} className="opacity-75" />
                        </div>
                    </div>
                    <div 
                        className="bg-white/20 backdrop-blur-md p-3 rounded-xl cursor-pointer hover:bg-white/30 transition"
                        onClick={() => setCurrentView(DashboardView.WALLET)}
                    >
                        <p className="text-xs text-green-100 mb-1">Wallet Balance</p>
                        <p className="text-xl font-bold flex items-center"><DollarSign size={16}/> {wallet.balance.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {isProfileIncomplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                    <div className="flex-1 mr-4">
                        <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-1">
                            <AlertCircle size={16} className="text-amber-600"/> Complete Profile
                        </h3>
                        <p className="text-xs text-amber-800 leading-tight">Add your location & crop details to get accurate mandi rates and transport options.</p>
                    </div>
                    <button 
                        onClick={onEditPreferences}
                        className="whitespace-nowrap px-3 py-2 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-lg hover:bg-amber-50 shadow-sm"
                    >
                        Setup Now
                    </button>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {menuItems.filter(item => item.id !== DashboardView.PROFILE && item.id !== DashboardView.SUPPORT).map((item, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentView(item.id)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-32 hover:border-green-300 transition-all hover:shadow-md"
                    >
                        <div className={`p-3 rounded-full mb-2 ${item.color}`}>
                            <item.icon size={24} />
                        </div>
                        <span className="font-semibold text-gray-800 text-sm">{item.label}</span>
                    </button>
                ))}
            </div>

            <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <LayoutGrid size={18} className="text-gray-400"/> Recent Activity
                </h3>
                {shipments.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                        <p className="text-gray-400 mb-2">No active shipments</p>
                        {userRole === UserRole.FARMER && (
                            <button onClick={() => setCurrentView(DashboardView.BOOK_TRANSPORT)} className="text-green-600 font-medium text-sm hover:underline">
                                Book your first load
                            </button>
                        )}
                        {userRole === UserRole.BUYER && (
                            <button onClick={() => setCurrentView(DashboardView.CROP_DISCOVERY)} className="text-purple-600 font-medium text-sm hover:underline">
                                Find crops to buy
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {shipments.map(s => (
                            <div key={s.id} onClick={() => setCurrentView(DashboardView.TRACK_SHIPMENT)} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex justify-between items-center cursor-pointer">
                                <div>
                                    <p className="font-bold text-gray-800">{s.destination}</p>
                                    <p className="text-xs text-gray-500">{s.date} • {s.weight}</p>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                    {s.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 relative">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 flex justify-between items-center shadow-sm">
            <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => setCurrentView(DashboardView.HOME)}
            >
                <div className="bg-green-600 p-1.5 rounded-lg">
                    <Truck className="text-white w-5 h-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Saarthi</span>
            </div>
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setShowPersonaManager(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold uppercase transition-colors border border-gray-200"
                 >
                    {userRole.split(' ')[0]} <ChevronDown size={14} className="text-gray-500" />
                 </button>

                 <button onClick={() => setCurrentView(DashboardView.PROFILE)} className="p-2 hover:bg-gray-100 rounded-full">
                    <UserCircle className="text-gray-600" />
                 </button>
            </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-3xl mx-auto min-h-[calc(100vh-60px)]">
            {renderContent()}
        </main>

        {/* Mobile Bottom Navigation - 5 items max for spacing */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden flex justify-between px-2 p-2 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <button 
                onClick={() => setCurrentView(DashboardView.HOME)}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.HOME ? 'text-green-600' : 'text-gray-400'}`}
            >
                <LayoutGrid size={20} />
                <span className="text-[10px] mt-1 font-medium">Home</span>
            </button>
            
            {/* Show Book only for Farmers/FPO, else show Market or Wallet */}
            {(userRole === UserRole.FARMER || userRole === UserRole.FPO) ? (
                 <button 
                    onClick={() => setCurrentView(DashboardView.BOOK_TRANSPORT)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.BOOK_TRANSPORT ? 'text-green-600' : 'text-gray-400'}`}
                >
                    <Truck size={20} />
                    <span className="text-[10px] mt-1 font-medium">Book</span>
                </button>
            ) : userRole === UserRole.BUYER ? (
                 <button 
                    onClick={() => setCurrentView(DashboardView.CROP_DISCOVERY)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.CROP_DISCOVERY ? 'text-green-600' : 'text-gray-400'}`}
                >
                    <Search size={20} />
                    <span className="text-[10px] mt-1 font-medium">Find</span>
                </button>
            ) : (
                <button 
                    onClick={() => setCurrentView(DashboardView.WALLET)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.WALLET ? 'text-green-600' : 'text-gray-400'}`}
                >
                    <Wallet size={20} />
                    <span className="text-[10px] mt-1 font-medium">Wallet</span>
                </button>
            )}

             <button 
                onClick={() => setCurrentView(DashboardView.TRACK_SHIPMENT)}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.TRACK_SHIPMENT ? 'text-green-600' : 'text-gray-400'}`}
            >
                <Map size={20} />
                <span className="text-[10px] mt-1 font-medium">{userRole === UserRole.TRANSPORTER ? 'Trips' : 'Track'}</span>
            </button>
            
            {/* Market Rates for farmers/FPO */}
             {(userRole === UserRole.FARMER || userRole === UserRole.FPO) && (
                <button 
                    onClick={() => setCurrentView(DashboardView.MARKET_RATES)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.MARKET_RATES ? 'text-green-600' : 'text-gray-400'}`}
                >
                    <TrendingUp size={20} />
                    <span className="text-[10px] mt-1 font-medium">Rates</span>
                </button>
             )}
             
             {/* Wallet for Buyer/Transporter instead of Rates */}
             {(userRole === UserRole.BUYER || userRole === UserRole.TRANSPORTER) && (
                <button 
                    onClick={() => setCurrentView(DashboardView.WALLET)}
                    className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.WALLET ? 'text-green-600' : 'text-gray-400'}`}
                >
                    <Wallet size={20} />
                    <span className="text-[10px] mt-1 font-medium">Wallet</span>
                </button>
             )}

             <button 
                onClick={() => setCurrentView(DashboardView.SUPPORT)}
                className={`flex flex-col items-center p-2 rounded-lg min-w-[60px] ${currentView === DashboardView.SUPPORT ? 'text-green-600' : 'text-gray-400'}`}
            >
                <Headphones size={20} />
                <span className="text-[10px] mt-1 font-medium">Help</span>
            </button>
        </nav>

        <PersonaManager 
            isOpen={showPersonaManager}
            onClose={() => setShowPersonaManager(false)}
            currentRole={userRole}
            onSwitch={onSwitchPersona}
        />
    </div>
  );
};