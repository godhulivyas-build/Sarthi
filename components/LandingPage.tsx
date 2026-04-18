import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { ScreenChrome } from './layout/ScreenChrome';
import { SaathiDidi } from './SaathiDidi';
import { AgriImages } from './landing/AgriImages';
import LiveMapSection from './landing/LiveMapSection';
import MandiPriceTicker from './landing/MandiPriceTicker';
import { Tractor, ShoppingBag, Truck, Warehouse, BadgeCheck, TrendingUp, MapPin, Bell, Phone, Mail } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';
import { useAppState } from '../state/AppState';
import { useV2Session } from '../state/v2Session';
import { CONTACT } from '../config/contact';
import type { SaarthiUserRole } from '../types';

const roles: {
  role: UserRole;
  persona: SaarthiUserRole;
  icon: typeof Tractor;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
}[] = [
  { role: UserRole.FARMER, persona: 'farmer', icon: Tractor, titleKey: 'landing.roleFarmer', descKey: 'landing.roleFarmerDesc', color: 'bg-green-100 text-green-800 border-green-200' },
  { role: UserRole.BUYER, persona: 'buyer', icon: ShoppingBag, titleKey: 'landing.roleBuyer', descKey: 'landing.roleBuyerDesc', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { role: UserRole.LOGISTICS_PARTNER, persona: 'logistics_partner', icon: Truck, titleKey: 'landing.roleLogistics', descKey: 'landing.roleLogisticsDesc', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { role: UserRole.COLD_STORAGE_OWNER, persona: 'cold_storage_owner', icon: Warehouse, titleKey: 'landing.roleCold', descKey: 'landing.roleColdDesc', color: 'bg-cyan-100 text-cyan-900 border-cyan-200' },
];

const advantages: { icon: typeof BadgeCheck; titleKey: TranslationKey; descKey: TranslationKey; iconColor: string }[] = [
  { icon: BadgeCheck, titleKey: 'landing.adv.booking', descKey: 'landing.adv.bookingDesc', iconColor: 'text-green-600' },
  { icon: TrendingUp, titleKey: 'landing.adv.price', descKey: 'landing.adv.priceDesc', iconColor: 'text-indigo-600' },
  { icon: MapPin, titleKey: 'landing.adv.local', descKey: 'landing.adv.localDesc', iconColor: 'text-orange-600' },
  { icon: Bell, titleKey: 'landing.adv.updates', descKey: 'landing.adv.updatesDesc', iconColor: 'text-purple-600' },
];

const steps: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'landing.step1', descKey: 'landing.step1Desc' },
  { titleKey: 'landing.step2', descKey: 'landing.step2Desc' },
  { titleKey: 'landing.step3', descKey: 'landing.step3Desc' },
];

export const LandingPage: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { setCurrentScreen, setUserRoleFromEnum, setLang } = useAppState();
  const { completeDemo } = useV2Session();
  const joinRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToJoin = () =>
    setTimeout(() => joinRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);

  const goOnboarding = () => navigate('/onboarding');

  const quickDemo = (persona: SaarthiUserRole) => {
    completeDemo(persona);
    setUserRoleFromEnum(
      persona === 'farmer'
        ? UserRole.FARMER
        : persona === 'buyer'
          ? UserRole.BUYER
          : persona === 'logistics_partner'
            ? UserRole.LOGISTICS_PARTNER
            : UserRole.COLD_STORAGE_OWNER
    );
    setLang('hi');
    setCurrentScreen('dashboard');
    navigate('/app');
  };

  return (
    <ScreenChrome>
      <div className="pb-28 max-w-3xl mx-auto w-full">
        {/* HERO */}
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-6 sm:p-8 text-white overflow-hidden relative">
          <div className="flex items-start justify-between gap-4">
            <div className="anim-fade-up">
              <p className="text-green-100 font-semibold text-sm">{t('landing.tagline')}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 leading-tight">
                {t('landing.heroTitle')}
              </h1>
              <p className="text-green-100 mt-3 text-base leading-relaxed max-w-xl">
                {t('landing.whatBody')}
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={goOnboarding}
                  className="min-h-[56px] px-8 rounded-2xl bg-white text-green-800 font-extrabold text-lg shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  {t('landing.startNow')}
                </button>
                <button
                  type="button"
                  onClick={scrollToJoin}
                  className="min-h-[56px] px-6 rounded-2xl bg-white/15 border border-white/40 text-white font-bold text-sm hover:bg-white/25 transition-all"
                >
                  {t('landing.joinTitle')}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold anim-fade anim-delay-3">
                <span className="bg-white/20 px-3 py-1 rounded-full">{t('landing.stats1')}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{t('landing.stats2')}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{t('landing.stats3')}</span>
              </div>
            </div>
            <img
              src="/images/logo.png"
              alt="Sarthi Setu"
              className="hidden sm:block w-40 h-40 shrink-0 rounded-2xl object-contain bg-white/10 p-2 border-2 border-white/20 shadow-lg anim-scale anim-delay-2"
            />
          </div>
        </section>

        {/* MANDI PRICE TICKER */}
        <MandiPriceTicker />

        <div className="p-4 space-y-10">
          {/* VISUALS */}
          <section className="anim-fade-up anim-delay-1">
            <AgriImages />
          </section>

          {/* ADVANTAGE */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 anim-fade-up anim-delay-2">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4">{t('landing.advantage')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advantages.map(({ icon: Icon, titleKey, descKey, iconColor }, i) => (
                <div
                  key={titleKey}
                  className={`rounded-2xl border border-gray-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 anim-scale anim-delay-${i + 1}`}
                >
                  <p className="font-bold text-gray-900 flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${iconColor}`} /> {t(titleKey)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* LIVE MAP */}
          <LiveMapSection />

          {/* HOW IT WORKS */}
          <section className="bg-gradient-to-br from-amber-50 to-white rounded-3xl border border-amber-100 p-5 anim-fade-up anim-delay-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-3">{t('landing.howItWorks')}</h2>
            <ol className="space-y-3">
              {steps.map(({ titleKey, descKey }, i) => (
                <li
                  key={titleKey}
                  className={`bg-white rounded-2xl border border-amber-100 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 anim-fade-up anim-delay-${i + 1}`}
                >
                  <p className="font-bold text-gray-900">{t(titleKey)}</p>
                  <p className="text-sm text-gray-600 mt-1">{t(descKey)}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* JOIN / ROLE SELECTION */}
          <section ref={joinRef} className="scroll-mt-24 anim-fade-up anim-delay-4">
            <h2 className="text-xl font-extrabold text-gray-900 mb-2 text-center">{t('landing.joinTitle')}</h2>
            <p className="text-sm text-gray-600 text-center mb-4">{t('landing.joinSubtitle')}</p>
            <div className="space-y-3 max-w-lg mx-auto">
              {roles.map(({ role, persona, icon: Icon, titleKey, descKey, color }, i) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => quickDemo(persona)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 min-h-[60px] anim-scale anim-delay-${i + 1} ${color}`}
                >
                  <div className="p-3 rounded-xl bg-white/80 border border-current/20">
                    <Icon className="w-7 h-7" aria-hidden />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg text-gray-900">{t(titleKey)}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{t(descKey)}</p>
                  </div>
                  <span className="font-extrabold text-green-700 text-xl">→</span>
                </button>
              ))}
            </div>
          </section>

          {/* HELP */}
          <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 anim-fade-up anim-delay-5">
            <h2 className="text-xl font-extrabold text-gray-900">{t('landing.helpTitle')}</h2>
            <p className="text-sm text-gray-600 mt-2">{t('landing.helpBody')}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:+${CONTACT.phoneE164}`}
                className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-green-50 border border-green-200 text-green-800 font-bold text-sm hover:bg-green-100 transition-colors duration-200"
              >
                <Phone className="w-4 h-4" /> {CONTACT.phone}
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-center gap-2 min-h-[48px] px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm hover:bg-blue-100 transition-colors duration-200"
              >
                <Mail className="w-4 h-4" /> {CONTACT.email}
              </a>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-6 border-t border-gray-200 py-6 px-4 text-center anim-fade">
          <img src="/images/logo.png" alt="Sarthi Setu" className="w-10 h-10 rounded mx-auto" />
          <p className="mt-2 text-sm font-bold text-gray-700">Sarthi Setu — सारथी सेतु</p>
          <p className="mt-1 text-xs text-gray-500">{t('landing.footer.builtFor')}</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500">
            <a href={`tel:+${CONTACT.phoneE164}`} className="hover:text-green-700 transition-colors">{CONTACT.phone}</a>
            <span>·</span>
            <a href={`mailto:${CONTACT.email}`} className="hover:text-blue-700 transition-colors">{CONTACT.email}</a>
          </div>
        </footer>
      </div>
      <SaathiDidi />
    </ScreenChrome>
  );
};
