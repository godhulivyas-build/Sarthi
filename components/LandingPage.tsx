import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
} from 'lucide-react';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import MandiPriceTicker from './landing/MandiPriceTicker';
import { Phone, Mail } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';
import { useAppState } from '../state/AppState';
import { useV2Session } from '../state/v2Session';
import { CONTACT } from '../config/contact';
import { Card } from './v2/ui/Card';
import { V2Button } from './v2/ui/V2Button';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SaarthiEcosystemVisual } from './landing/visuals/SaarthiEcosystemVisual';
import { SaarthiWorkflowVisual } from './landing/visuals/SaarthiWorkflowVisual';

const LANG_OPTS = [
  { code: 'hi' as const, label: 'हिं' },
  { code: 'en' as const, label: 'EN' },
  { code: 'kn' as const, label: 'ಕ' },
  { code: 'ta' as const, label: 'த' },
  { code: 'te' as const, label: 'తె' },
];

// Landing is intentionally visual-first and minimal; role demos are handled after onboarding.

export const LandingPage: React.FC = () => {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { setCurrentScreen, setUserRoleFromEnum, setLang: setAppLang } = useAppState();
  useV2Session();
  const reduce = useReducedMotion();
  const [visualTab, setVisualTab] = React.useState<'ecosystem' | 'map'>('ecosystem');
  const [heroImgIdx, setHeroImgIdx] = React.useState(0);
  const [avatarOpen, setAvatarOpen] = React.useState(false);

  const heroRef = React.useRef<HTMLElement | null>(null);
  const mandiRef = React.useRef<HTMLElement | null>(null);
  const flowRef = React.useRef<HTMLElement | null>(null);
  const journeyRef = React.useRef<HTMLElement | null>(null);
  const networkRef = React.useRef<HTMLElement | null>(null);
  const didiRef = React.useRef<HTMLDivElement | null>(null);

  const scrollTo = (el: HTMLElement | null) =>
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const goOnboarding = () => navigate('/onboarding');

  const navHome = t('landing.v2.navHome');

  const FIELD_IMAGES = React.useMemo(
    () => [
      '/images/field/01.png',
      '/images/field/02.png',
      '/images/field/03.png',
      '/images/field/04.png',
      '/images/field/05.png',
      '/images/field/06.png',
      '/images/field/07.png',
      '/images/field/08.png',
      '/images/field/09.png',
    ],
    []
  );

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setHeroImgIdx((i) => (i + 1) % 6);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduce]);

  React.useEffect(() => {
    // Speak once per session for a “guide” feel.
    const key = 'saarthi.avatar.greeted';
    let greeted = false;
    try {
      greeted = sessionStorage.getItem(key) === '1';
    } catch {
      greeted = false;
    }
    if (greeted) return;
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      // ignore
    }

    const msg =
      lang === 'hi'
        ? 'नमस्ते। मैं आपको स्वस्थ अनाज दूँगा। लॉगिन करो।'
        : 'Namaste. I will help you get healthier grains. Please login.';
    const speak = () => {
      try {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(msg);
        u.rate = 1;
        u.pitch = 1;
        u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
        window.speechSynthesis.speak(u);
      } catch {
        // ignore
      }
    };
    const tId = window.setTimeout(speak, 800);
    return () => window.clearTimeout(tId);
  }, [lang]);

  const trust = [
    { en: 'landing.v2.trust1a' as const, hi: 'landing.v2.trust1b' as const, Icon: ShieldCheck },
    { en: 'landing.v2.trust2a' as const, hi: 'landing.v2.trust2b' as const, Icon: CircleCheck },
    { en: 'landing.v2.trust3a' as const, hi: 'landing.v2.trust3b' as const, Icon: MapPin },
    { en: 'landing.v2.trust4a' as const, hi: 'landing.v2.trust4b' as const, Icon: Radio },
  ];

  const CropChip: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur px-3 py-1.5 border border-[var(--saarthi-outline-soft)] text-xs font-extrabold text-[var(--saarthi-on-surface-variant)] shadow-sm">
      <span className="text-base leading-none">🌿</span>
      <span className="leading-none">{label}</span>
    </span>
  );

  const CropsFieldBackdrop: React.FC = () => (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Single full-page wheat background (with contrast regulation) */}
      <div className="absolute inset-0">
        <img
          src="/images/bg/wheat.png"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'saturate(1.05) contrast(1.06) brightness(0.9)' }}
        />
      </div>

      {/* Contrast overlays to keep text readable everywhere */}
      <div className="absolute inset-0 bg-white/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/72 to-white/90" />
      <div className="absolute inset-0 mix-blend-multiply opacity-[0.22] bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.28),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.18),transparent_50%),radial-gradient(circle_at_60%_80%,rgba(250,204,21,0.14),transparent_55%)]" />

      {/* Subtle grain (premium) */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:26px_26px]" />
    </div>
  );

  return (
    <div className="relative min-h-screen pb-28 md:pb-8 text-[var(--saarthi-on-surface)]">
      <CropsFieldBackdrop />
      {/* Top bar — Stitch glass nav */}
      <header className="fixed top-0 left-0 right-0 z-[60] border-b border-[var(--saarthi-outline-soft)] bg-[var(--saarthi-glass)] backdrop-blur-md shadow-sm safe-top">
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/images/saarthi_setu_logo.png"
              alt="Saarthi Setu"
              className="w-11 h-11 object-contain rounded-xl bg-white ring-1 ring-[var(--saarthi-outline-soft)] p-1"
            />
            <span className="saarthi-headline text-xl font-extrabold text-[var(--saarthi-primary)] tracking-tight">Saarthi</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-extrabold">
            <button
              type="button"
              onClick={() => scrollTo(heroRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-primary)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>{navHome}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(flowRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>{t('landing.v2.navHow')}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(mandiRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>{t('landing.v2.navMandi2')}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(journeyRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>{t('landing.v2.navJourney')}</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(networkRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>{t('landing.v2.navNetworkMap')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight text-[var(--saarthi-on-surface-variant)] text-xs font-bold mr-1">
              <span>{t('landing.v2.langChoose')}</span>
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
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-[4.5rem] sm:pt-24">
        {/* Avatar / guide (speaks + prompts login) */}
        <div className="fixed bottom-24 right-4 z-[70] flex flex-col items-end gap-2">
          <motion.button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            whileHover={reduce ? undefined : { y: -2 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="w-14 h-14 rounded-3xl overflow-hidden border border-white/60 shadow-xl bg-white"
            aria-label="Saarthi guide"
            title="Saarthi guide"
          >
            <img src="/images/field/08.png" alt="" className="w-full h-full object-cover" />
          </motion.button>

          <AnimatePresence>
            {avatarOpen ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-[min(320px,calc(100vw-2rem))] rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/95 backdrop-blur shadow-2xl p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-white shrink-0">
                    <img src="/images/field/08.png" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-extrabold text-[var(--saarthi-on-background)]">
                      {lang === 'hi' ? 'नमस्ते!' : 'Namaste!'}
                    </p>
                    <p className="mt-1 text-xs text-[var(--saarthi-on-surface-variant)] leading-relaxed">
                      {lang === 'hi'
                        ? 'मैं आपको स्वस्थ अनाज दूँगा। लॉगिन करो — मैं शुरू करवाता/करवाती हूँ।'
                        : 'I’ll help you get healthier grains. Login and I’ll guide you.'}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const msg =
                              lang === 'hi'
                                ? 'नमस्ते। मैं आपको स्वस्थ अनाज दूँगा। लॉगिन करो।'
                                : 'Namaste. Please login.';
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const u = new SpeechSynthesisUtterance(msg);
                              u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
                              window.speechSynthesis.speak(u);
                            }
                          } catch {
                            // ignore
                          }
                        }}
                        className="min-h-[38px] px-3 rounded-2xl bg-[var(--saarthi-surface-low)] border border-[var(--saarthi-outline-soft)] text-xs font-extrabold text-[var(--saarthi-on-surface-variant)]"
                      >
                        {lang === 'hi' ? '🔊 बोलो' : '🔊 Speak'}
                      </button>
                      <button
                        type="button"
                        onClick={goOnboarding}
                        className="min-h-[38px] px-3 rounded-2xl bg-[var(--saarthi-primary)] text-white text-xs font-extrabold shadow-sm"
                      >
                        {t('landing.v2.navJoin')}
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAvatarOpen(false)}
                    className="text-[11px] font-extrabold text-[var(--saarthi-on-surface-variant)] hover:opacity-80"
                    aria-label="Close"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        {/* Hero */}
        <section ref={heroRef} id="landing-hero" className="px-4 sm:px-6 py-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center scroll-mt-28">
          <div className="order-2 md:order-1 space-y-6">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="saarthi-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--saarthi-primary)] leading-tight">
                {t('landing.v2.heroHi')}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[var(--saarthi-on-surface-variant)] leading-relaxed max-w-lg">
                {t('landing.v2.heroBody')}
              </p>
            </motion.div>
            <div className="flex flex-col sm:flex-row gap-3">
              <V2Button
                variant="primary"
                className="min-h-[56px] px-8"
                onClick={goOnboarding}
              >
                {t('landing.v2.ctaGo')}
              </V2Button>
              <V2Button
                variant="secondary"
                className="min-h-[56px] px-8"
                onClick={() => scrollTo(didiRef.current)}
              >
                {t('landing.v2.ctaDidi')}
              </V2Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {trust.map(({ en, hi, Icon }) => (
                <div key={en} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-[var(--saarthi-tertiary)]">
                    <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)] leading-tight">
                      {t(lang === 'hi' ? hi : en)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              <CropChip label={lang === 'hi' ? 'टमाटर' : 'Tomato'} />
              <CropChip label={lang === 'hi' ? 'प्याज़' : 'Onion'} />
              <CropChip label={lang === 'hi' ? 'आलू' : 'Potato'} />
              <CropChip label={lang === 'hi' ? 'भिंडी' : 'Okra'} />
              <CropChip label={lang === 'hi' ? 'मक्का' : 'Maize'} />
            </motion.div>
          </div>

          <div className="order-1 md:order-2 relative">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.98, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[var(--saarthi-outline-soft)] bg-white relative z-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={FIELD_IMAGES[heroImgIdx] ?? '/images/agritech.png'}
                  src={FIELD_IMAGES[heroImgIdx] ?? '/images/agritech.png'}
                  alt=""
                  className="w-full h-full object-cover"
                  initial={reduce ? false : { opacity: 0, scale: 1.01 }}
                  animate={reduce ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.08)] via-transparent to-transparent" />
            </motion.div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {FIELD_IMAGES.slice(0, 6).map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setHeroImgIdx(idx)}
                  className={`h-10 w-10 rounded-2xl overflow-hidden border transition-all ${
                    heroImgIdx === idx
                      ? 'border-[var(--saarthi-primary)] ring-2 ring-[var(--saarthi-primary)]/20'
                      : 'border-white/60 hover:border-[var(--saarthi-outline-soft)]'
                  }`}
                  aria-label={`hero image ${idx + 1}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Farmer journey (GIF) */}
        <section
          ref={journeyRef}
          id="farmer-journey"
          className="px-4 sm:px-6 max-w-7xl mx-auto py-6 sm:py-10 scroll-mt-28"
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Card className="p-5 sm:p-6 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="font-extrabold saarthi-headline text-2xl text-[var(--saarthi-on-background)]">
                    {lang === 'hi' ? 'किसान की यात्रा — Saarthi के बाद' : 'Farmer journey — after Saarthi'}
                  </p>
                  <p className="mt-2 text-sm text-[var(--saarthi-on-surface-variant)] leading-relaxed">
                    {lang === 'hi'
                      ? 'यह GIF किसान के संघर्ष से लेकर—बुकिंग, ट्रैकिंग और सही भाव तक—पूरी कहानी दिखाएगा।'
                      : 'This GIF should show the full story: struggle → booking → tracking → fair price.'}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">✅</span>
                      <span className="text-[var(--saarthi-on-surface-variant)]">
                        {lang === 'hi' ? 'किसान को कम खाली-ट्रक नुकसान' : 'Fewer empty trips for farmers'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">✅</span>
                      <span className="text-[var(--saarthi-on-surface-variant)]">
                        {lang === 'hi'
                          ? 'खरीदार को ताज़ा और ट्रेस करने योग्य खाद्य'
                          : 'Buyers get fresher, more traceable produce'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">✅</span>
                      <span className="text-[var(--saarthi-on-surface-variant)]">
                        {lang === 'hi' ? 'WhatsApp पर लाइव अपडेट' : 'Live updates on WhatsApp'}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={reduce ? undefined : { scale: 1.01 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="rounded-3xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-white shadow-sm"
                >
                  <img
                    src="/images/farmer_journey.gif"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FIELD_IMAGES[0] ?? '/images/farmer.png';
                    }}
                    alt={lang === 'hi' ? 'किसान यात्रा (GIF)' : 'Farmer journey (GIF)'}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </motion.div>

                {/* Keep imagery focused; avoid random galleries across sections */}
              </div>
            </Card>
          </motion.div>
        </section>

        <section className="px-4 sm:px-6 max-w-7xl mx-auto -mt-2 sm:-mt-4 space-y-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Card ref={flowRef as any} className="p-5 sm:p-6">
              <SaarthiWorkflowVisual highlightStep={1} />
            </Card>
          </motion.div>

          <motion.div
            ref={networkRef as any}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.04 }}
          >
            <Card className="p-5 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-extrabold saarthi-headline text-[var(--saarthi-on-background)]">
                    {lang === 'hi' ? 'नेटवर्क + मैप' : 'Network + map'}
                  </p>
                  <p className="mt-1 text-sm text-[var(--saarthi-on-surface-variant)]">
                    {lang === 'hi'
                      ? 'टैब बदलकर देखें—क्लीन, इंटरैक्टिव और ट्रांज़िशन के साथ।'
                      : 'Switch tabs—clean, interactive, with transitions.'}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-2xl bg-[var(--saarthi-surface-low)] border border-[var(--saarthi-outline-soft)] p-1">
                  <button
                    type="button"
                    onClick={() => setVisualTab('ecosystem')}
                    className={`min-h-[36px] px-3 rounded-xl text-xs font-extrabold transition-colors ${
                      visualTab === 'ecosystem'
                        ? 'bg-white text-[var(--saarthi-primary)] shadow-sm'
                        : 'text-[var(--saarthi-on-surface-variant)] hover:bg-white/60'
                    }`}
                  >
                    {lang === 'hi' ? 'इकोसिस्टम' : 'Ecosystem'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisualTab('map')}
                    className={`min-h-[36px] px-3 rounded-xl text-xs font-extrabold transition-colors ${
                      visualTab === 'map'
                        ? 'bg-white text-[var(--saarthi-primary)] shadow-sm'
                        : 'text-[var(--saarthi-on-surface-variant)] hover:bg-white/60'
                    }`}
                  >
                    {lang === 'hi' ? 'भारत मैप' : 'India map'}
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <AnimatePresence mode="wait" initial={false}>
                  {visualTab === 'ecosystem' ? (
                    <motion.div
                      key="ecosystem"
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={reduce ? undefined : { opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: 10 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <SaarthiEcosystemVisual />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="map"
                      initial={reduce ? false : { opacity: 0, x: 10 }}
                      animate={reduce ? undefined : { opacity: 1, x: 0 }}
                      exit={reduce ? undefined : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="rounded-3xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-white">
                        <img src="/images/india_orders_map_ref.png" alt="" className="w-full h-auto" />
                      </div>
                      <p className="mt-2 text-xs text-[var(--saarthi-on-surface-variant)]">
                        {lang === 'hi'
                          ? 'यह डेमो विज़ुअल है—हम फेक नंबर नहीं दिखाते।'
                          : 'Demo visual—no fake numbers shown.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Mandi ticker (kept compact) */}
        <section ref={mandiRef} id="mandi-prices" className="scroll-mt-28 px-2">
          <MandiPriceTicker />
        </section>

        {/* Minimal CTA footer (keep clean) */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-16">
          <Card className="p-6 sm:p-8 bg-[var(--saarthi-primary)] text-white border-0">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black saarthi-headline">{lang === 'hi' ? 'आज ही शुरू करें' : 'Start today'}</p>
                <p className="mt-2 text-sm text-white/90">
                  {lang === 'hi'
                    ? 'बुकिंग, अपडेट और सपोर्ट—WhatsApp + वॉइस के साथ।'
                    : 'Bookings, updates and support—via WhatsApp + voice.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <V2Button variant="secondary" className="min-h-[56px] px-8 bg-white text-[var(--saarthi-primary)]" onClick={goOnboarding}>
                  {lang === 'hi' ? 'जॉइन करें' : 'Join Saarthi'}
                </V2Button>
                <a
                  href={`https://wa.me/${CONTACT.phoneE164}?text=${encodeURIComponent(CONTACT.whatsappPrefill)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[56px] px-8 rounded-2xl bg-[#25D366] text-white font-extrabold inline-flex items-center justify-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </Card>
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
                  <button type="button" onClick={goOnboarding} className="hover:text-green-400 text-left w-full">
                    {lang === 'hi' ? 'जॉइन' : 'Join'}
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
        <button type="button" onClick={goOnboarding} className="flex flex-col items-center py-1 text-zinc-400 min-w-[4rem]">
          <User className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase mt-0.5">{lang === 'hi' ? 'जॉइन' : 'Join'}</span>
        </button>
      </nav>
    </div>
  );
};
