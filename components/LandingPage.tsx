import React from 'react';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { ScreenChrome } from './layout/ScreenChrome';
import { VoiceMic } from './VoiceMic';
import { SaathiDidi } from './SaathiDidi';
import { AgriImages } from './landing/AgriImages';
import { WhatsAppFloat } from './WhatsAppFloat';
import { Tractor, ShoppingBag, Truck, BadgeCheck, TrendingUp, MapPin, Radar } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';
import { useAppState } from '../state/AppState';

const roles: {
  role: UserRole;
  icon: typeof Tractor;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
}[] = [
  { role: UserRole.FARMER, icon: Tractor, titleKey: 'landing.roleFarmer', descKey: 'landing.roleFarmerDesc', color: 'bg-green-100 text-green-800 border-green-200' },
  { role: UserRole.BUYER, icon: ShoppingBag, titleKey: 'landing.roleBuyer', descKey: 'landing.roleBuyerDesc', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { role: UserRole.TRANSPORTER, icon: Truck, titleKey: 'landing.roleTransporter', descKey: 'landing.roleTransporterDesc', color: 'bg-orange-100 text-orange-800 border-orange-200' },
];

export const LandingPage: React.FC = () => {
  const { t } = useI18n();
  const { setCurrentScreen, setUserRoleFromEnum } = useAppState();
  const joinRef = React.useRef<HTMLDivElement | null>(null);
  const [showJoin, setShowJoin] = React.useState(false);

  return (
    <ScreenChrome title={t('app.name')}>
      <div className="p-4 pb-28 max-w-3xl mx-auto w-full space-y-10">
        {/* HERO */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-green-100 font-semibold text-sm">{t('landing.tagline')}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 leading-tight">
                Farm se Market tak – Seedha aur Sasta
              </h1>
              <p className="text-green-100 mt-3 text-base leading-relaxed max-w-xl">
                {t('landing.whatBody')}
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowJoin(true);
                  setTimeout(() => joinRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
                }}
                className="mt-5 min-h-[56px] px-6 rounded-2xl bg-white text-green-800 font-extrabold text-lg shadow-sm active:scale-[0.99]"
              >
                Start Now
              </button>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                <span className="bg-white/20 px-3 py-1 rounded-full">50,000+ Farmers</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Live Booking</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Hindi default</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/15 border border-white/20">
              <Truck className="w-12 h-12 text-white" aria-hidden />
            </div>
          </div>
        </section>

        {/* VISUALS */}
        <section>
          <h2 className="text-lg font-extrabold text-gray-900 mb-3">India-ready, farmer-first</h2>
          <AgriImages />
        </section>

        {/* ADVANTAGE */}
        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">The Saarthi Advantage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-gray-900 flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-green-600" /> Easy booking</p>
              <p className="text-sm text-gray-600 mt-1">One-tap flow. Voice help anytime.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-600" /> Price clarity</p>
              <p className="text-sm text-gray-600 mt-1">Mandi + buyer signals (mock now, backend-ready).</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-5 h-5 text-orange-600" /> Local matching</p>
              <p className="text-sm text-gray-600 mt-1">Nearby jobs, nearby crops (mock geo for now).</p>
            </div>
            <div className="rounded-2xl border border-gray-100 p-4">
              <p className="font-bold text-gray-900 flex items-center gap-2"><Radar className="w-5 h-5 text-purple-600" /> Live updates structure</p>
              <p className="text-sm text-gray-600 mt-1">Prepared to plug realtime later.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-gradient-to-br from-amber-50 to-white rounded-3xl border border-amber-100 p-5">
          <h2 className="text-xl font-extrabold text-gray-900 mb-3">How it works</h2>
          <ol className="space-y-3">
            <li className="bg-white rounded-2xl border border-amber-100 p-4">
              <p className="font-bold text-gray-900">1) Farmer adds crop</p>
              <p className="text-sm text-gray-600 mt-1">Create a request with crop + quantity.</p>
            </li>
            <li className="bg-white rounded-2xl border border-amber-100 p-4">
              <p className="font-bold text-gray-900">2) Transporter accepts</p>
              <p className="text-sm text-gray-600 mt-1">Jobs appear instantly. Accept and move.</p>
            </li>
            <li className="bg-white rounded-2xl border border-amber-100 p-4">
              <p className="font-bold text-gray-900">3) Buyer orders</p>
              <p className="text-sm text-gray-600 mt-1">Browse produce and place orders.</p>
            </li>
          </ol>
        </section>

        {/* JOIN */}
        <section ref={joinRef} className="scroll-mt-24">
          <h2 className="text-xl font-extrabold text-gray-900 mb-2 text-center">Join Saarthi</h2>
          <p className="text-sm text-gray-600 text-center mb-4">What do you want to do?</p>
          {(showJoin || true) && (
            <div className="space-y-3 max-w-lg mx-auto">
              {roles.map(({ role, icon: Icon, titleKey, descKey, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setUserRoleFromEnum(role);
                    setCurrentScreen('dashboard');
                  }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left shadow-sm active:scale-[0.99] transition-transform min-h-[60px] ${color}`}
                >
                  <div className="p-3 rounded-xl bg-white/80 border border-current/20">
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-gray-900">{t(titleKey)}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{t(descKey)}</p>
                  </div>
                  <span className="font-extrabold text-green-700">→</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT */}
        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-xl font-extrabold text-gray-900">Need Help?</h2>
          <p className="text-sm text-gray-600 mt-2">Tap WhatsApp or Saathi Didi. We’ll guide you.</p>
        </section>
      </div>
      <SaathiDidi />
      <WhatsAppFloat />
      <VoiceMic />
    </ScreenChrome>
  );
};
