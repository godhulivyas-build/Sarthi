import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Cloud,
  Handshake,
  Home,
  LayoutList,
  MapPin,
  Mic,
  ShieldCheck,
  TrendingUp,
  Truck,
  User,
  CircleCheck,
  Radio,
  Quote,
} from 'lucide-react';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { SaathiDidi } from './SaathiDidi';
import LiveMapSection from './landing/LiveMapSection';
import MandiPriceTicker from './landing/MandiPriceTicker';
import { Phone, Mail } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';
import { useAppState } from '../state/AppState';
import { useV2Session } from '../state/v2Session';
import { CONTACT } from '../config/contact';
import type { SaarthiUserRole } from '../types';
import { Card } from './v2/ui/Card';
import { V2Button } from './v2/ui/V2Button';

const pipe3 = (raw: string): [string, string, string] => {
  const p = raw.split('|');
  return [p[0] ?? '', p[1] ?? '', p[2] ?? ''];
};

const LANG_OPTS = [
  { code: 'hi' as const, label: 'हिं' },
  { code: 'kn' as const, label: 'ಕ' },
  { code: 'te' as const, label: 'తె' },
  { code: 'en' as const, label: 'EN' },
];

const roles: {
  role: UserRole;
  persona: SaarthiUserRole;
  img: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  {
    role: UserRole.FARMER,
    persona: 'farmer',
    img: '/images/farmer.png',
    titleKey: 'landing.roleFarmer',
    descKey: 'landing.roleFarmerDesc',
  },
  {
    role: UserRole.BUYER,
    persona: 'buyer',
    img: '/images/community.png',
    titleKey: 'landing.roleBuyer',
    descKey: 'landing.roleBuyerDesc',
  },
  {
    role: UserRole.LOGISTICS_PARTNER,
    persona: 'logistics_partner',
    img: '/images/agritech.png',
    titleKey: 'landing.roleLogistics',
    descKey: 'landing.roleLogisticsDesc',
  },
  {
    role: UserRole.COLD_STORAGE_OWNER,
    persona: 'cold_storage_owner',
    img: '/images/field.png',
    titleKey: 'landing.roleCold',
    descKey: 'landing.roleColdDesc',
  },
];

export const LandingPage: React.FC = () => {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { setCurrentScreen, setUserRoleFromEnum, setLang: setAppLang } = useAppState();
  const { completeDemo } = useV2Session();

  const heroRef = React.useRef<HTMLElement | null>(null);
  const mandiRef = React.useRef<HTMLElement | null>(null);
  const ecosystemRef = React.useRef<HTMLElement | null>(null);
  const flowRef = React.useRef<HTMLElement | null>(null);
  const solutionsRef = React.useRef<HTMLElement | null>(null);
  const didiRef = React.useRef<HTMLDivElement | null>(null);

  const scrollTo = (el: HTMLElement | null) =>
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
    setAppLang('hi');
    setCurrentScreen('dashboard');
    navigate('/app');
  };

  const bentoMandi = pipe3(t('landing.v2.bentoMandi'));
  const bentoWeather = pipe3(t('landing.v2.bentoWeather'));
  const bentoRoute = pipe3(t('landing.v2.bentoRoute'));
  const bentoBuyers = pipe3(t('landing.v2.bentoBuyers'));
  const bentoAi = pipe3(t('landing.v2.bentoAi'));
  const flow1 = pipe3(t('landing.v2.flowS1'));
  const flow2 = pipe3(t('landing.v2.flowS2'));
  const flow3 = pipe3(t('landing.v2.flowS3'));
  const navHome = t('landing.v2.navHomePair').split('|');

  const trust = [
    { a: 'landing.v2.trust1a' as const, b: 'landing.v2.trust1b' as const, Icon: ShieldCheck },
    { a: 'landing.v2.trust2a' as const, b: 'landing.v2.trust2b' as const, Icon: CircleCheck },
    { a: 'landing.v2.trust3a' as const, b: 'landing.v2.trust3b' as const, Icon: MapPin },
    { a: 'landing.v2.trust4a' as const, b: 'landing.v2.trust4b' as const, Icon: Radio },
  ];

  return (
    <div className="min-h-screen pb-28 md:pb-8 text-[var(--saarthi-on-surface)]">
      {/* Top bar — Stitch glass nav */}
      <header className="fixed top-0 left-0 right-0 z-[60] border-b border-[var(--saarthi-outline-soft)] bg-[var(--saarthi-glass)] backdrop-blur-md shadow-sm safe-top">
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="" className="w-9 h-9 rounded-xl ring-1 ring-[var(--saarthi-outline-soft)]" />
            <span className="saarthi-headline text-xl font-extrabold text-[var(--saarthi-primary)] tracking-tight">Saarthi</span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-sm font-bold">
            <button
              type="button"
              onClick={() => scrollTo(heroRef.current)}
              className="flex flex-col items-center text-[var(--saarthi-primary)]"
            >
              <span>{navHome[0]}</span>
              <span className="text-[10px] font-semibold opacity-70">{navHome[1]}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(solutionsRef.current)}
              className="flex flex-col items-center text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] px-2 py-1 rounded-xl transition-colors"
            >
              <span>{t('landing.v2.navMarketplace')}</span>
              <span className="text-[10px] opacity-70">{t('landing.v2.navMarketplaceHi')}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(mandiRef.current)}
              className="flex flex-col items-center text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] px-2 py-1 rounded-xl transition-colors"
            >
              <span>{t('landing.v2.navMandi')}</span>
              <span className="text-[10px] opacity-70">{t('landing.v2.navMandiHi')}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(flowRef.current)}
              className="flex flex-col items-center text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] px-2 py-1 rounded-xl transition-colors"
            >
              <span>{t('landing.v2.navLogistics')}</span>
              <span className="text-[10px] opacity-70">{t('landing.v2.navLogisticsHi')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight text-[var(--saarthi-on-surface-variant)] text-xs font-bold mr-1">
              <span>{t('landing.v2.langBanner')}</span>
            </div>
            <div className="flex items-center gap-1">
              {LANG_OPTS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`min-h-[34px] min-w-[34px] rounded-xl text-[11px] font-extrabold border transition-colors ${
                    lang === code
                      ? 'bg-[var(--saarthi-primary)] text-white border-[var(--saarthi-primary)]'
                      : 'bg-white/90 text-[var(--saarthi-on-surface-variant)] border-[var(--saarthi-outline-soft)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={goOnboarding}
              className="rounded-full bg-[var(--saarthi-primary)] text-white px-4 py-2 font-bold text-sm shadow-sm hover:opacity-95 active:scale-[0.98] transition-all flex flex-col items-center leading-tight"
            >
              <span>{t('landing.v2.login')}</span>
              <span className="text-[10px] font-normal opacity-90">{t('landing.v2.loginHi')}</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-[4.5rem] sm:pt-24">
        {/* Hero */}
        <section ref={heroRef} id="landing-hero" className="px-4 sm:px-6 py-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center scroll-mt-28">
          <div className="order-2 md:order-1 space-y-6">
            <h1 className="saarthi-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--saarthi-primary)] leading-tight">
              {t('landing.v2.heroHi')}
              <span className="block mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-[var(--saarthi-secondary)]">{t('landing.v2.heroEn')}</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--saarthi-on-surface-variant)] leading-relaxed max-w-lg">{t('landing.v2.heroBody')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <V2Button
                variant="primary"
                bilingual={{ primary: t('landing.v2.ctaGo'), secondary: t('landing.v2.ctaGoHi') }}
                className="min-h-[56px] px-8"
                onClick={goOnboarding}
              />
              <V2Button
                variant="secondary"
                bilingual={{ primary: t('landing.v2.ctaDidi'), secondary: t('landing.v2.ctaDidiHi') }}
                className="min-h-[56px] px-8"
                onClick={() => scrollTo(didiRef.current)}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {trust.map(({ a, b, Icon }) => (
                <div key={a} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[var(--saarthi-tertiary)]">
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)] leading-tight">{t(a)}</span>
                  </div>
                  <span className="text-[10px] text-[var(--saarthi-on-surface-variant)] pl-7 opacity-80">{t(b)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 relative">
            <div className="aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative z-10">
              <img src="/images/farmer.png" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 left-2 sm:-bottom-6 sm:-left-2 saarthi-glass-panel z-20 flex items-center gap-3 p-4 sm:p-5 max-w-[min(100%,280px)]">
              <div className="bg-[var(--saarthi-surface-low)] p-2.5 rounded-full shrink-0">
                <TrendingUp className="w-7 h-7 text-[var(--saarthi-primary)]" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold uppercase text-[var(--saarthi-on-surface-variant)] tracking-wide">{t('landing.v2.floatLabel')}</p>
                <p className="text-[var(--saarthi-primary)] text-lg sm:text-xl font-black leading-tight">{t('landing.v2.floatValue')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mandi ticker — anchor for nav */}
        <section ref={mandiRef} id="mandi-prices" className="scroll-mt-28 px-2">
          <MandiPriceTicker />
        </section>

        {/* Live metrics */}
        <section className="bg-[var(--saarthi-surface-low)] py-14 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
            {[
              { n: '50,000+', border: 'border-[var(--saarthi-primary)]', label: t('landing.v2.statFarmers'), hi: t('landing.v2.statFarmersHi') },
              { n: '12.5k', border: 'border-[var(--saarthi-secondary)]', label: t('landing.v2.statTrips'), hi: t('landing.v2.statTripsHi') },
              { n: '₹150Cr+', border: 'border-[var(--saarthi-tertiary)]', label: t('landing.v2.statRevenue'), hi: t('landing.v2.statRevenueHi') },
            ].map(({ n, border, label, hi }) => (
              <Card key={n} className={`text-center py-8 sm:py-10 border-b-4 ${border} border-x-0 border-t-0 rounded-2xl shadow-sm`}>
                <p className={`saarthi-headline text-4xl sm:text-5xl font-black mb-2 ${border.includes('primary') ? 'text-[var(--saarthi-primary)]' : border.includes('secondary') ? 'text-[var(--saarthi-secondary)]' : 'text-[var(--saarthi-tertiary)]'}`}>
                  {n}
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-[var(--saarthi-on-surface-variant)]">{label}</p>
                <p className="text-xs text-[var(--saarthi-on-surface-variant)] mt-1 opacity-80">{hi}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Bento — Smart agriculture ecosystem */}
        <section ref={ecosystemRef} id="ecosystem" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-28">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="saarthi-headline text-3xl sm:text-4xl font-extrabold text-[var(--saarthi-on-background)] mb-1">{t('landing.v2.ecoTitle')}</h2>
            <p className="text-lg sm:text-xl font-bold text-[var(--saarthi-primary)]">{t('landing.v2.ecoHi')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 sm:gap-6 md:min-h-[520px]">
            <Card className="md:col-span-2 relative overflow-hidden group">
              <div className="relative z-10">
                <TrendingUp className="w-10 h-10 text-[var(--saarthi-primary)] mb-3" />
                <h3 className="saarthi-headline text-xl sm:text-2xl font-bold mb-2">
                  {bentoMandi[0]} <span className="text-base font-normal text-[var(--saarthi-on-surface-variant)]">/ {bentoMandi[1]}</span>
                </h3>
                <p className="text-sm text-[var(--saarthi-on-surface-variant)] leading-relaxed">{bentoMandi[2]}</p>
              </div>
              <TrendingUp className="absolute -right-4 -bottom-8 w-40 h-40 text-[var(--saarthi-primary)] opacity-[0.07] group-hover:scale-110 transition-transform" strokeWidth={1} />
            </Card>

            <div className="rounded-[var(--saarthi-radius-xl)] p-6 sm:p-8 bg-[var(--saarthi-tertiary)] text-white shadow-md border border-transparent">
              <Cloud className="w-10 h-10 mb-3" />
              <h3 className="saarthi-headline text-lg font-bold mb-1">{bentoWeather[0]}</h3>
              <p className="text-sm text-white/90 leading-relaxed mb-2">{bentoWeather[1]}</p>
              <p className="text-xs text-blue-100/90 leading-relaxed">{bentoWeather[2]}</p>
            </div>

            <Card className="relative overflow-hidden">
              <Truck className="w-10 h-10 text-[var(--saarthi-secondary)] mb-3" />
              <h3 className="saarthi-headline text-lg font-bold mb-1">{bentoRoute[0]}</h3>
              <p className="text-xs text-[var(--saarthi-on-surface-variant)] mb-2">{bentoRoute[1]}</p>
              <p className="text-xs text-[var(--saarthi-on-surface-variant)] leading-relaxed">{bentoRoute[2]}</p>
            </Card>

            <div className="rounded-[var(--saarthi-radius-xl)] p-6 sm:p-8 bg-[var(--saarthi-secondary-container)] text-[var(--saarthi-on-secondary)] shadow-md">
              <Handshake className="w-10 h-10 mb-3" />
              <h3 className="saarthi-headline text-lg font-bold mb-1">{bentoBuyers[0]}</h3>
              <p className="text-xs opacity-90 mb-2">{bentoBuyers[1]}</p>
              <p className="text-xs opacity-80 leading-relaxed">{bentoBuyers[2]}</p>
            </div>

            <Card className="md:col-span-3 bg-[var(--saarthi-primary)] text-white border-0 shadow-md relative overflow-hidden !bg-[var(--saarthi-primary)]">
              <div className="relative z-10 max-w-xl">
                <h3 className="saarthi-headline text-2xl sm:text-3xl font-black mb-1">{bentoAi[0]}</h3>
                <p className="text-lg font-bold text-[#a3f69c] mb-3">{bentoAi[1]}</p>
                <p className="text-sm text-white/95 leading-relaxed mb-5">{bentoAi[2]}</p>
                <button
                  type="button"
                  onClick={() => scrollTo(didiRef.current)}
                  className="inline-flex flex-col items-center gap-0.5 bg-white text-[var(--saarthi-primary)] px-6 py-3 rounded-full font-bold shadow-xl active:scale-[0.98] transition-transform"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Mic className="w-5 h-5" />
                    {t('landing.v2.tryVoice')}
                  </span>
                  <span className="text-[10px] font-semibold opacity-90">{t('landing.v2.tryVoiceHi')}</span>
                </button>
              </div>
              <img
                src="/images/agritech.png"
                alt=""
                className="hidden md:block absolute right-0 bottom-0 h-full w-2/5 object-cover opacity-40 pointer-events-none"
              />
            </Card>
          </div>
        </section>

        <div className="px-4 sm:px-6 max-w-7xl mx-auto pb-12">
          <LiveMapSection />
        </div>

        {/* Logistics flow */}
        <section ref={flowRef} id="logistics-flow" className="bg-[var(--saarthi-surface-high)] py-16 sm:py-20 px-4 sm:px-6 scroll-mt-28">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-10 sm:mb-12">
              <h2 className="saarthi-headline text-3xl sm:text-4xl font-extrabold mb-1">{t('landing.v2.flowTitle')}</h2>
              <p className="text-lg sm:text-xl font-bold text-[var(--saarthi-primary)] mb-3">{t('landing.v2.flowSub')}</p>
              <p className="text-sm sm:text-base text-[var(--saarthi-on-surface-variant)] leading-relaxed">{t('landing.v2.flowLead')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { n: '01', parts: flow1 },
                { n: '02', parts: flow2 },
                { n: '03', parts: flow3 },
              ].map(({ n, parts }) => (
                <div key={n} className="group">
                  <Card className="h-full py-8 sm:py-10 transition-transform group-hover:-translate-y-1">
                    <div className="saarthi-headline text-5xl sm:text-6xl font-black text-[#88d982]/35 mb-4">{n}</div>
                    <h4 className="saarthi-headline text-xl font-bold mb-1">{parts[0]}</h4>
                    <p className="text-base font-semibold text-[var(--saarthi-primary)] mb-2">{parts[1]}</p>
                    <p className="text-sm text-[var(--saarthi-on-surface-variant)] leading-relaxed">{parts[2]}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personas */}
        <section ref={solutionsRef} id="solutions" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-28">
          <div className="text-center mb-12">
            <h2 className="saarthi-headline text-3xl sm:text-4xl font-extrabold mb-1">{t('landing.v2.solTitle')}</h2>
            <p className="text-lg font-bold text-[var(--saarthi-primary)]">{t('landing.v2.solHi')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {roles.map(({ role, persona, img, titleKey, descKey }) => (
              <Card key={role} className="overflow-hidden p-0 group">
                <div className="h-44 overflow-hidden">
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h4 className="saarthi-headline text-lg font-bold">{t(titleKey)}</h4>
                  <p className="text-sm text-[var(--saarthi-on-surface-variant)] mt-2 leading-relaxed">{t(descKey)}</p>
                  <button
                    type="button"
                    onClick={() => quickDemo(persona)}
                    className="mt-4 text-[var(--saarthi-primary)] font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {t('landing.v2.learnMore')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="bg-[var(--saarthi-primary-container)] text-white py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-6 opacity-90 text-[#a3f69c]" strokeWidth={1.25} />
            <blockquote className="saarthi-headline text-xl sm:text-2xl md:text-3xl font-bold italic leading-snug mb-8">{t('landing.v2.quote')}</blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#a3f69c] overflow-hidden bg-white/10">
                <img src="/images/farmer.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="font-bold text-lg">{t('landing.v2.quoteAuthor')}</p>
                <p className="text-[#a3f69c] text-sm">{t('landing.v2.quoteRole')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-zinc-300 py-14 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
            <div>
              <div className="saarthi-headline text-2xl sm:text-3xl font-black text-green-500 mb-4">Saarthi</div>
              <p className="text-sm text-zinc-500 leading-relaxed">{t('landing.v2.footerMission')}</p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 text-sm">
                <a href={`tel:+${CONTACT.phoneE164}`} className="inline-flex items-center gap-2 font-bold text-green-400 hover:text-green-300">
                  <Phone className="w-4 h-4" /> {CONTACT.phone}
                </a>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 font-bold text-sky-400 hover:text-sky-300">
                  <Mail className="w-4 h-4" /> {CONTACT.email}
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold saarthi-headline mb-4">{t('landing.v2.colProduct')}</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button type="button" onClick={() => scrollTo(solutionsRef.current)} className="hover:text-green-400 text-left w-full">
                    {t('landing.v2.flMarketplace')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo(mandiRef.current)} className="hover:text-green-400 text-left w-full">
                    {t('landing.v2.flMandiIntel')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo(flowRef.current)} className="hover:text-green-400 text-left w-full">
                    {t('landing.v2.flLogistics')}
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold saarthi-headline mb-4">{t('landing.v2.colSupport')}</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button type="button" onClick={() => scrollTo(didiRef.current)} className="hover:text-green-400 text-left w-full">
                    {t('landing.v2.flHelp')}
                  </button>
                </li>
                <li>
                  <span className="text-zinc-500">{t('landing.v2.flTerms')}</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold saarthi-headline mb-4">{t('landing.v2.colApp')}</h5>
              <p className="text-zinc-500 text-xs mb-4 leading-relaxed">{t('landing.v2.appBlurb')}</p>
              <button
                type="button"
                className="w-full bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl flex items-center justify-center gap-3 border border-zinc-700 transition-colors"
              >
                <span className="text-xl" aria-hidden>
                  ▶
                </span>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400">{t('landing.v2.playStore')}</p>
                  <p className="font-bold text-xs text-white">{t('landing.v2.playStoreHi')}</p>
                </div>
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-600">{t('landing.v2.copyright')}</div>
        </footer>
      </main>

      {/* Didi scroll target */}
      <div ref={didiRef} id="didi-anchor" className="h-px w-full scroll-mt-32" aria-hidden />

      <SaathiDidi />

      {/* Mobile bottom bar — Stitch */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[55] flex justify-around items-center px-2 pb-5 pt-2 bg-white/95 backdrop-blur-xl border-t border-[var(--saarthi-outline-soft)] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => scrollTo(heroRef.current)} className="flex flex-col items-center py-1 text-[var(--saarthi-primary)] min-w-[4rem]">
          <Home className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase mt-0.5">{t('landing.v2.mobileHome')}</span>
        </button>
        <button type="button" onClick={() => scrollTo(flowRef.current)} className="flex flex-col items-center py-1 text-zinc-400 min-w-[4rem]">
          <LayoutList className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase mt-0.5">{t('landing.v2.mobileBookings')}</span>
        </button>
        <button type="button" onClick={() => scrollTo(mandiRef.current)} className="flex flex-col items-center py-1 text-zinc-400 min-w-[4rem]">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase mt-0.5">{t('landing.v2.mobileMandi')}</span>
        </button>
        <button type="button" onClick={() => scrollTo(solutionsRef.current)} className="flex flex-col items-center py-1 text-zinc-400 min-w-[4rem]">
          <User className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase mt-0.5">{t('landing.v2.mobileProfile')}</span>
        </button>
      </nav>
    </div>
  );
};
