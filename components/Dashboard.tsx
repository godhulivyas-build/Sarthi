import React, { useEffect, useState } from 'react';
import { DashboardView, Shipment, UserRole, DashboardProps, MarketRate } from '../types';
import { BookingView } from './dashboard/BookingView';
import { TrackingView } from './dashboard/TrackingView';
import { SupportView } from './dashboard/SupportView';
import { MarketRatesView } from './dashboard/MarketRatesView';
import { CropDiscoveryView } from './dashboard/CropDiscoveryView';
import { AwarenessView } from './dashboard/AwarenessView';
import { ProduceManageView } from './dashboard/ProduceManageView';
import { PickupRequestView } from './dashboard/PickupRequestView';
import { FarmerOrdersView } from './dashboard/FarmerOrdersView';
import { BuyerOrdersView } from './dashboard/BuyerOrdersView';
import { FPONearbyView } from './dashboard/FPONearbyView';
import { LogisticsJobsView } from './dashboard/LogisticsJobsView';
import { PersonaManager } from './PersonaManager';
import { FloatingAssistant } from './FloatingAssistant';
import { useI18n } from '../i18n/I18nContext';
import type { TranslationKey } from '../i18n/translations';
import { getMarketRates } from '../services/marketService';
import { awarenessItems } from '../services/awarenessData';
import { nearbyBuyers } from '../services/nearbyBuyersMock';
import {
  LayoutGrid,
  Truck,
  Map,
  Headphones,
  UserCircle,
  LogOut,
  Users,
  ChevronDown,
  TrendingUp,
  Search,
  Package,
  Sprout,
  Bell,
  IndianRupee,
  ArrowLeft,
} from 'lucide-react';

export const Dashboard: React.FC<DashboardProps> = ({
  userRole,
  userPreferences,
  onLogout,
  onSwitchPersona,
  onEditPreferences,
}) => {
  const { t, lang, setLang } = useI18n();
  const [stack, setStack] = useState<DashboardView[]>([DashboardView.HOME]);
  const currentView = stack[stack.length - 1];
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [showPersonaManager, setShowPersonaManager] = useState(false);
  const [liveRates, setLiveRates] = useState<MarketRate[]>([]);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [logisticsKey, setLogisticsKey] = useState(0);

  const goBack = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const go = (v: DashboardView) => {
    if (v === DashboardView.HOME) setStack([DashboardView.HOME]);
    else setStack([DashboardView.HOME, v]);
  };

  const handleBookShipment = (shipment: Shipment) => {
    setShipments((prev) => [shipment, ...prev]);
  };

  const isProfileIncomplete = !userPreferences?.location?.trim();

  useEffect(() => {
    const run = async () => {
      setRatesLoading(true);
      const data = await getMarketRates(
        userPreferences?.location || 'नासिक',
        userPreferences?.primaryCrop || 'प्याज'
      );
      setLiveRates(data.slice(0, 4));
      setRatesLoading(false);
    };
    if (currentView === DashboardView.HOME && userRole === UserRole.FARMER) run();
  }, [currentView, userRole, userPreferences?.location, userPreferences?.primaryCrop]);

  type MenuDef = { id: DashboardView; labelKey: TranslationKey; icon: typeof Truck; color: string };
  const menuByRole: Record<UserRole, MenuDef[]> = {
    [UserRole.FARMER]: [
      { id: DashboardView.PRODUCE_MANAGE, labelKey: 'action.addProduce', icon: Sprout, color: 'text-green-600 bg-green-50' },
      { id: DashboardView.PICKUP_REQUEST, labelKey: 'action.requestPickup', icon: Truck, color: 'text-orange-600 bg-orange-50' },
      { id: DashboardView.FARMER_ORDERS, labelKey: 'action.viewOrders', icon: Package, color: 'text-emerald-700 bg-emerald-50' },
      { id: DashboardView.FPO_NEARBY, labelKey: 'fpo.title', icon: Users, color: 'text-blue-600 bg-blue-50' },
      { id: DashboardView.MARKET_RATES, labelKey: 'nav.rates', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
      { id: DashboardView.TRACK_SHIPMENT, labelKey: 'nav.track', icon: Map, color: 'text-blue-600 bg-blue-50' },
      { id: DashboardView.AWARENESS, labelKey: 'nav.awareness', icon: Bell, color: 'text-amber-700 bg-amber-50' },
      { id: DashboardView.SUPPORT, labelKey: 'nav.help', icon: Headphones, color: 'text-purple-600 bg-purple-50' },
      { id: DashboardView.PROFILE, labelKey: 'profile.edit', icon: UserCircle, color: 'text-gray-600 bg-gray-50' },
    ],
    [UserRole.FPO]: [
      { id: DashboardView.BOOK_TRANSPORT, labelKey: 'action.requestPickup', icon: Truck, color: 'text-green-600 bg-green-50' },
      { id: DashboardView.MARKET_RATES, labelKey: 'nav.rates', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
      { id: DashboardView.TRACK_SHIPMENT, labelKey: 'nav.track', icon: Map, color: 'text-blue-600 bg-blue-50' },
      { id: DashboardView.AWARENESS, labelKey: 'nav.awareness', icon: Bell, color: 'text-amber-700 bg-amber-50' },
      { id: DashboardView.SUPPORT, labelKey: 'nav.help', icon: Headphones, color: 'text-purple-600 bg-purple-50' },
      { id: DashboardView.PROFILE, labelKey: 'profile.edit', icon: UserCircle, color: 'text-gray-600 bg-gray-50' },
    ],
    [UserRole.BUYER]: [
      { id: DashboardView.CROP_DISCOVERY, labelKey: 'action.browseProduce', icon: Search, color: 'text-purple-600 bg-purple-50' },
      { id: DashboardView.BUYER_ORDERS, labelKey: 'action.viewOrders', icon: Package, color: 'text-emerald-700 bg-emerald-50' },
      { id: DashboardView.TRACK_SHIPMENT, labelKey: 'nav.track', icon: Map, color: 'text-blue-600 bg-blue-50' },
      { id: DashboardView.AWARENESS, labelKey: 'nav.awareness', icon: Bell, color: 'text-amber-700 bg-amber-50' },
      { id: DashboardView.SUPPORT, labelKey: 'nav.help', icon: Headphones, color: 'text-purple-600 bg-purple-50' },
      { id: DashboardView.PROFILE, labelKey: 'profile.edit', icon: UserCircle, color: 'text-gray-600 bg-gray-50' },
    ],
    [UserRole.TRANSPORTER]: [
      { id: DashboardView.LOGISTICS_JOBS, labelKey: 'nav.findTrips', icon: Truck, color: 'text-orange-600 bg-orange-50' },
      { id: DashboardView.TRACK_SHIPMENT, labelKey: 'nav.track', icon: Map, color: 'text-blue-600 bg-blue-50' },
      { id: DashboardView.AWARENESS, labelKey: 'nav.awareness', icon: Bell, color: 'text-amber-700 bg-amber-50' },
      { id: DashboardView.SUPPORT, labelKey: 'nav.help', icon: Headphones, color: 'text-purple-600 bg-purple-50' },
      { id: DashboardView.PROFILE, labelKey: 'profile.edit', icon: UserCircle, color: 'text-gray-600 bg-gray-50' },
    ],
  };

  const menuItems = menuByRole[userRole];

  const renderFarmerHome = () => (
    <div className="p-4 space-y-5 pb-28">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h2 className="text-2xl font-bold mb-1">{t('farmer.greeting')}!</h2>
            <button
              type="button"
              onClick={() => setShowPersonaManager(true)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-medium mt-1"
            >
              <Users size={14} />
              <span className="truncate max-w-[200px]">{userRole}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-red-800 mb-2 flex items-center gap-2">🔴 {t('farmer.alerts')}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
          {awarenessItems.map((a) => (
            <div
              key={a.id}
              className="min-w-[240px] snap-start bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-900"
            >
              <p className="font-bold">{lang === 'hi' ? a.titleHi : a.titleEn}</p>
              <p className="text-xs mt-1 opacity-90">{lang === 'hi' ? a.detailHi : a.detailEn}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2">{t('farmer.livePrices')}</h3>
        {ratesLoading ? (
          <p className="text-gray-500 text-sm">{t('common.loading')}</p>
        ) : (
          <div className="space-y-2">
            {liveRates.slice(0, 2).map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <p className="text-xs font-semibold text-gray-500">{t('farmer.mandiToday')}</p>
                <p className="text-lg font-bold text-gray-900">
                  {r.crop} · ₹{r.price} / q
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {t('farmer.msp')}: ₹{r.msp}
                </p>
              </div>
            ))}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-500">{t('farmer.buyerPrices')}</p>
              <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                {nearbyBuyers[0]?.pricePerQuintal} / q · {nearbyBuyers[0]?.distanceKm} km
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-2">{t('farmer.nearbyBuyers')}</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {nearbyBuyers.map((b) => (
            <div key={b.id} className="min-w-[200px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
              <p className="font-bold text-gray-900">{b.name}</p>
              <p className="text-xs text-gray-600">{lang === 'hi' ? b.typeHi : b.typeEn}</p>
              <p className="text-sm font-semibold text-green-700 mt-2">
                ₹{b.pricePerQuintal} / q · {b.distanceKm} km
              </p>
            </div>
          ))}
        </div>
      </div>

      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-amber-900 text-sm">{t('farmer.completeLocation')}</p>
            <p className="text-xs text-amber-800 mt-1">{t('farmer.setupLocation')}</p>
          </div>
          <button
            type="button"
            onClick={onEditPreferences}
            className="min-h-[48px] px-4 py-2 bg-white border border-amber-300 text-amber-900 font-bold rounded-xl"
          >
            {t('onboard.save')}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => go(DashboardView.PRODUCE_MANAGE)}
          className="min-h-[56px] rounded-2xl bg-green-600 text-white text-lg font-bold shadow-md active:scale-[0.99]"
        >
          {t('action.addProduce')}
        </button>
        <button
          type="button"
          onClick={() => go(DashboardView.PICKUP_REQUEST)}
          className="min-h-[56px] rounded-2xl bg-orange-500 text-white text-lg font-bold shadow-md active:scale-[0.99]"
        >
          {t('action.requestPickup')}
        </button>
        <button
          type="button"
          onClick={() => go(DashboardView.FARMER_ORDERS)}
          className="min-h-[56px] rounded-2xl bg-emerald-800 text-white text-lg font-bold shadow-md active:scale-[0.99]"
        >
          {t('action.viewOrders')}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {menuItems
          .filter((m) => m.id !== DashboardView.PROFILE && ![DashboardView.PRODUCE_MANAGE, DashboardView.PICKUP_REQUEST, DashboardView.FARMER_ORDERS].includes(m.id))
          .map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => go(item.id)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[112px] hover:border-green-300"
            >
              <div className={`p-3 rounded-full mb-2 ${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className="font-semibold text-gray-800 text-sm leading-tight">{t(item.labelKey)}</span>
            </button>
          ))}
      </div>

      <div>
        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          <LayoutGrid size={18} className="text-gray-400" />
          {lang === 'hi' ? 'हाल की गतिविधि' : 'Recent activity'}
        </h3>
        {shipments.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center border border-dashed text-gray-500 text-sm">
            {lang === 'hi' ? 'अभी कोई ढुलाई नहीं' : 'No shipments yet'}
          </div>
        ) : (
          <div className="space-y-2">
            {shipments.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(DashboardView.TRACK_SHIPMENT)}
                className="w-full bg-white p-4 rounded-lg border text-left"
              >
                <p className="font-bold">{s.destination}</p>
                <p className="text-xs text-gray-500">{s.status}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderBuyerHome = () => (
    <div className="p-4 space-y-6 pb-28">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">{t('app.name')}</h2>
        <p className="text-purple-100 text-sm mt-1">{t('landing.tagline')}</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => go(DashboardView.CROP_DISCOVERY)}
          className="min-h-[56px] rounded-2xl bg-purple-600 text-white text-lg font-bold"
        >
          {t('action.browseProduce')}
        </button>
        <button
          type="button"
          onClick={() => go(DashboardView.BUYER_ORDERS)}
          className="min-h-[56px] rounded-2xl bg-white border-2 border-purple-200 text-purple-800 text-lg font-bold"
        >
          {t('action.viewOrders')}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {menuItems
          .filter((m) => m.id !== DashboardView.PROFILE && m.id !== DashboardView.CROP_DISCOVERY && m.id !== DashboardView.BUYER_ORDERS)
          .map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => go(item.id)}
              className="bg-white p-4 rounded-xl border min-h-[100px] flex flex-col items-center justify-center"
            >
              <item.icon className="mb-2 text-purple-600" size={24} />
              <span className="text-sm font-semibold text-center">{t(item.labelKey)}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const renderTransporterHome = () => (
    <div className="p-4 space-y-6 pb-28">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">{t('nav.findTrips')}</h2>
        <p className="text-orange-100 text-sm mt-1">{lang === 'hi' ? 'खाली गाड़ी के लिए काम देखें' : 'Find loads for your vehicle'}</p>
      </div>
      <button
        type="button"
        onClick={() => go(DashboardView.LOGISTICS_JOBS)}
        className="w-full min-h-[56px] rounded-2xl bg-orange-600 text-white text-lg font-bold"
      >
        {t('jobs.title')}
      </button>
      <div className="grid grid-cols-2 gap-3">
        {menuItems
          .filter((m) => m.id !== DashboardView.PROFILE && m.id !== DashboardView.LOGISTICS_JOBS)
          .map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => go(item.id)}
              className="bg-white p-4 rounded-xl border min-h-[100px] flex flex-col items-center justify-center"
            >
              <item.icon className="mb-2 text-orange-600" size={24} />
              <span className="text-sm font-semibold text-center">{t(item.labelKey)}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const renderFPOHome = () => (
    <div className="p-4 space-y-6 pb-28">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">FPO</h2>
        <p className="text-blue-100 text-sm mt-1">{lang === 'hi' ? 'बल्क ढुलाई और बाज़ार' : 'Bulk logistics & market'}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {menuItems
          .filter((m) => m.id !== DashboardView.PROFILE)
          .map((item, idx) => (
            <button
              key={`${item.id}-${idx}`}
              type="button"
              onClick={() => go(item.id)}
              className="bg-white p-4 rounded-xl border min-h-[100px] flex flex-col items-center justify-center"
            >
              <item.icon className="mb-2 text-blue-600" size={24} />
              <span className="text-sm font-semibold text-center">{t(item.labelKey)}</span>
            </button>
          ))}
      </div>
    </div>
  );

  const renderHome = () => {
    if (userRole === UserRole.FARMER) return renderFarmerHome();
    if (userRole === UserRole.BUYER) return renderBuyerHome();
    if (userRole === UserRole.TRANSPORTER) return renderTransporterHome();
    return renderFPOHome();
  };

  const renderContent = () => {
    switch (currentView) {
      case DashboardView.BOOK_TRANSPORT:
        return <BookingView onBook={handleBookShipment} />;
      case DashboardView.TRACK_SHIPMENT:
        return <TrackingView activeShipments={shipments} />;
      case DashboardView.SUPPORT:
        return <SupportView />;
      case DashboardView.AWARENESS:
        return <AwarenessView />;
      case DashboardView.MARKET_RATES:
        return <MarketRatesView preferences={userPreferences} />;
      case DashboardView.CROP_DISCOVERY:
        return <CropDiscoveryView preferences={userPreferences} />;
      case DashboardView.PRODUCE_MANAGE:
        return <ProduceManageView preferences={userPreferences} />;
      case DashboardView.PICKUP_REQUEST:
        return (
          <PickupRequestView
            preferences={userPreferences}
            onCreated={() => setLogisticsKey((k) => k + 1)}
          />
        );
      case DashboardView.FARMER_ORDERS:
        return <FarmerOrdersView preferences={userPreferences} />;
      case DashboardView.BUYER_ORDERS:
        return <BuyerOrdersView preferences={userPreferences} />;
      case DashboardView.FPO_NEARBY:
        return <FPONearbyView />;
      case DashboardView.LOGISTICS_JOBS:
        return <LogisticsJobsView preferences={userPreferences} refreshKey={logisticsKey} />;
      case DashboardView.PROFILE:
        return (
          <div className="p-6 text-center pb-24">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserCircle size={40} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-bold">{userRole}</h2>
            <p className="text-gray-500 mb-6">{userPreferences?.location || '—'}</p>
            <button
              type="button"
              onClick={onEditPreferences}
              className="mb-6 min-h-[48px] px-4 py-2 bg-gray-100 rounded-xl text-base font-medium w-full max-w-xs"
            >
              {t('profile.edit')}
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="text-red-600 font-medium flex items-center justify-center gap-2 mx-auto min-h-[48px]"
            >
              <LogOut size={16} /> {t('profile.logout')}
            </button>
          </div>
        );
      default:
        return renderHome();
    }
  };

  const titleForView = (): string | undefined => {
    if (currentView === DashboardView.HOME) return undefined;
    const map: Partial<Record<DashboardView, TranslationKey>> = {
      [DashboardView.BOOK_TRANSPORT]: 'action.requestPickup',
      [DashboardView.TRACK_SHIPMENT]: 'nav.track',
      [DashboardView.SUPPORT]: 'nav.help',
      [DashboardView.AWARENESS]: 'nav.awareness',
      [DashboardView.MARKET_RATES]: 'nav.rates',
      [DashboardView.CROP_DISCOVERY]: 'action.browseProduce',
      [DashboardView.PRODUCE_MANAGE]: 'produce.title',
      [DashboardView.PICKUP_REQUEST]: 'pickup.title',
      [DashboardView.FARMER_ORDERS]: 'orders.title',
      [DashboardView.BUYER_ORDERS]: 'orders.title',
      [DashboardView.FPO_NEARBY]: 'fpo.title',
      [DashboardView.LOGISTICS_JOBS]: 'jobs.title',
      [DashboardView.PROFILE]: 'profile.edit',
    };
    const key = map[currentView];
    return key ? t(key) : t('app.name');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0 relative">
      <header className="bg-white border-b border-gray-200 px-2 py-2 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="w-12 shrink-0 flex justify-start">
            {stack.length > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-green-800 font-bold text-lg"
                aria-label={t('back')}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            ) : (
              <span className="w-10" aria-hidden />
            )}
          </div>
          <button
            type="button"
            onClick={() => go(DashboardView.HOME)}
            className="flex-1 flex items-center justify-center gap-2 min-w-0 py-2"
          >
            <div className="bg-green-600 p-1.5 rounded-lg shrink-0">
              <Truck className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-gray-900 truncate">{titleForView() || t('app.name')}</span>
          </button>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`min-h-[40px] px-2 rounded-lg text-xs font-bold border ${
                lang === 'hi' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-200'
              }`}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`min-h-[40px] px-2 rounded-lg text-xs font-bold border ${
                lang === 'en' ? 'bg-green-600 text-white border-green-600' : 'bg-gray-100 border-gray-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setShowPersonaManager(true)}
              className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold max-w-[72px] truncate"
            >
              {userRole.split(' ')[0]}
            </button>
            <button type="button" onClick={() => go(DashboardView.PROFILE)} className="p-2 rounded-full min-h-[44px] min-w-[44px]">
              <UserCircle className="text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto min-h-[calc(100vh-56px)]">{renderContent()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden flex justify-between px-1 py-2 pb-safe z-40">
        <button
          type="button"
          onClick={() => go(DashboardView.HOME)}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.HOME ? 'text-green-600' : 'text-gray-400'}`}
        >
          <LayoutGrid size={22} />
          <span className="text-[10px] mt-0.5 font-medium">{t('nav.home')}</span>
        </button>

        {userRole === UserRole.FARMER && (
          <button
            type="button"
            onClick={() => go(DashboardView.MARKET_RATES)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.MARKET_RATES ? 'text-green-600' : 'text-gray-400'}`}
          >
            <TrendingUp size={22} />
            <span className="text-[10px] mt-0.5 font-medium">{t('nav.rates')}</span>
          </button>
        )}

        {userRole === UserRole.BUYER && (
          <button
            type="button"
            onClick={() => go(DashboardView.CROP_DISCOVERY)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.CROP_DISCOVERY ? 'text-green-600' : 'text-gray-400'}`}
          >
            <Search size={22} />
            <span className="text-[10px] mt-0.5 font-medium">{t('nav.findProduce')}</span>
          </button>
        )}

        {(userRole === UserRole.FPO || userRole === UserRole.TRANSPORTER) && (
          <button
            type="button"
            onClick={() => go(userRole === UserRole.TRANSPORTER ? DashboardView.LOGISTICS_JOBS : DashboardView.BOOK_TRANSPORT)}
            className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${
              (userRole === UserRole.TRANSPORTER ? currentView === DashboardView.LOGISTICS_JOBS : currentView === DashboardView.BOOK_TRANSPORT)
                ? 'text-green-600'
                : 'text-gray-400'
            }`}
          >
            <Truck size={22} />
            <span className="text-[10px] mt-0.5 font-medium">{userRole === UserRole.TRANSPORTER ? t('nav.findTrips') : t('action.requestPickup')}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => go(DashboardView.TRACK_SHIPMENT)}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.TRACK_SHIPMENT ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Map size={22} />
          <span className="text-[10px] mt-0.5 font-medium">{t('nav.track')}</span>
        </button>

        <button
          type="button"
          onClick={() => go(DashboardView.AWARENESS)}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.AWARENESS ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Bell size={22} />
          <span className="text-[10px] mt-0.5 font-medium">{t('nav.awareness')}</span>
        </button>

        <button
          type="button"
          onClick={() => go(DashboardView.SUPPORT)}
          className={`flex flex-col items-center p-2 rounded-lg min-w-[56px] ${currentView === DashboardView.SUPPORT ? 'text-green-600' : 'text-gray-400'}`}
        >
          <Headphones size={22} />
          <span className="text-[10px] mt-0.5 font-medium">{t('nav.help')}</span>
        </button>
      </nav>

      <FloatingAssistant />

      <PersonaManager
        isOpen={showPersonaManager}
        onClose={() => setShowPersonaManager(false)}
        currentRole={userRole}
        onSwitch={onSwitchPersona}
      />
    </div>
  );
};
