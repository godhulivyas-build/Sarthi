import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  ShieldCheck,
  Truck,
  CircleCheck,
  Radio,
} from 'lucide-react';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { Phone, Mail } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';
import { useAppState } from '../state/AppState';
import { useV2Session } from '../state/v2Session';
import { CONTACT } from '../config/contact';
import { Card } from './v2/ui/Card';
import { V2Button } from './v2/ui/V2Button';
import { AnimatePresence, motion, useReducedMotion, useInView } from 'framer-motion';
import { IndiaStorySection } from './landing/IndiaStorySection';
import { HowItWorks3DDemo } from './landing/HowItWorks3DDemo';

// Landing is intentionally visual-first and minimal; role demos are handled after onboarding.

const LANG_OPTS = [
  { code: 'hi' as const, label: 'हिं' },
  { code: 'en' as const, label: 'EN' },
  { code: 'kn' as const, label: 'ಕ' },
  { code: 'te' as const, label: 'తె' },
];

type CountUpOpts = { from?: number; to: number; durationMs?: number };
const useCountUp = (active: boolean, opts: CountUpOpts) => {
  const { from = 0, to, durationMs = 900 } = opts;
  const [v, setV] = React.useState(from);

  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, from, to, durationMs]);

  return v;
};

export const LandingPage: React.FC = () => {
  // Hindi-first version: do not mix languages on the same page.
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { setCurrentScreen, setUserRoleFromEnum, setLang: setAppLang } = useAppState();
  useV2Session();
  const reduce = useReducedMotion();
  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [heroUiStep, setHeroUiStep] = React.useState(0);
  const [splashOpen, setSplashOpen] = React.useState(false);

  const heroRef = React.useRef<HTMLElement | null>(null);
  const howRef = React.useRef<HTMLElement | null>(null);
  const mandiRef = React.useRef<HTMLElement | null>(null);
  const journeyRef = React.useRef<HTMLElement | null>(null);
  const didiRef = React.useRef<HTMLDivElement | null>(null);

  const scrollTo = (el: HTMLElement | null) =>
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const goOnboarding = () => navigate('/onboarding');

  const navHome = t('landing.v2.navHome');

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    // Small, premium splash (session-only)
    const key = 'saarthi.setu.splash.shown';
    let shown = false;
    try {
      shown = sessionStorage.getItem(key) === '1';
    } catch {
      shown = true;
    }
    if (shown) return;
    setSplashOpen(true);
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      // ignore
    }
    const tId = window.setTimeout(() => setSplashOpen(false), 900);
    return () => window.clearTimeout(tId);
  }, []);

  React.useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setHeroUiStep((s) => (s + 1) % 3), 2400);
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

  const CropsFieldBackdrop: React.FC = () => (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Real Bharat imagery: wheat sunset + green field vibe */}
      <div className="absolute inset-0 bg-[url('/images/bg_wheat_sunset_wide.png')] bg-cover bg-center opacity-[0.52] blur-[1.4px] scale-[1.04] saturate-[1.08] contrast-[1.06]" />
      <div className="absolute inset-0 bg-[url('/images/bg_wheat_sunset_portrait.png')] bg-cover bg-center opacity-[0.24] blur-[1.6px] scale-[1.06] mix-blend-multiply" />

      {/* Slight dark overlay for readability, plus warm tint */}
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/72 to-white/84" />
      <div className="absolute inset-0 opacity-[0.70] bg-[radial-gradient(circle_at_70%_18%,rgba(251,191,36,0.24),transparent_52%),radial-gradient(circle_at_26%_32%,rgba(34,197,94,0.12),transparent_52%),radial-gradient(circle_at_55%_88%,rgba(245,158,11,0.14),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.18)_1px,transparent_1px)] [background-size:26px_26px]" />
    </div>
  );

  const FloatingCrop: React.FC<{ emoji: string; className: string; delay: number }> = ({ emoji, className, delay }) => (
    <motion.div
      aria-hidden
      className={`absolute grid place-items-center rounded-3xl border border-white/50 bg-white/70 backdrop-blur shadow-sm ${className}`}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={reduce ? undefined : { opacity: 1, y: [0, -10, 0] }}
      transition={reduce ? undefined : { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <span className="text-xl">{emoji}</span>
    </motion.div>
  );

  const Clouds: React.FC = () => (
    <motion.svg
      aria-hidden
      viewBox="0 0 1200 260"
      className="absolute -top-8 left-0 right-0 w-full h-40 opacity-[0.65]"
      initial={reduce ? false : { x: -40, opacity: 0 }}
      animate={reduce ? undefined : { x: 40, opacity: 1 }}
      transition={reduce ? undefined : { duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
        </linearGradient>
      </defs>
      <g fill="url(#cloudGrad)">
        <path d="M140 170c0-28 24-52 58-52 12-30 42-52 78-52 46 0 84 34 86 78 24 5 42 24 42 47 0 28-24 52-58 52H194c-30 0-54-20-54-48z" />
        <path d="M650 190c0-22 18-40 44-40 9-22 31-38 58-38 34 0 62 25 64 57 18 4 31 18 31 35 0 22-18 40-44 40H692c-23 0-42-15-42-38z" />
        <path d="M910 160c0-20 16-36 40-36 8-20 28-34 52-34 30 0 54 22 56 50 16 3 28 16 28 31 0 20-16 36-40 36H950c-21 0-40-13-40-33z" />
      </g>
    </motion.svg>
  );

  const TruckHorizon: React.FC = () => (
    <motion.div
      aria-hidden
      className="absolute bottom-12 left-0 right-0"
      initial={reduce ? false : { x: '-12%', opacity: 0 }}
      animate={reduce ? undefined : { x: '12%', opacity: 1 }}
      transition={reduce ? undefined : { duration: 9.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <div className="mx-auto w-[min(520px,92vw)] h-6 relative">
        <div className="absolute inset-x-0 top-1 h-px bg-[rgba(24,29,23,0.18)]" />
        <div className="absolute left-12 top-0 h-6 w-20 rounded-xl bg-white/55 border border-white/50 backdrop-blur shadow-sm flex items-center justify-center">
          <Truck className="w-4 h-4 text-[var(--saarthi-primary)]" />
          <span className="ml-1 text-[10px] font-extrabold text-[var(--saarthi-on-surface-variant)]">Route</span>
        </div>
      </div>
    </motion.div>
  );

  const HeroPhoneOverlay: React.FC = () => {
    const steps = [
      {
        badge: 'ऑर्डर',
        title: '500 किलो गेहूँ',
        sub: 'दिल्ली से डिमांड',
      },
      {
        badge: 'ट्रांसपोर्ट',
        title: '1 टैप में बुक',
        sub: 'MP → दिल्ली रूट',
      },
      {
        badge: 'मंडी',
        title: 'इंदौर ₹2450',
        sub: 'लाइव भाव',
      },
    ];
    const s = steps[heroUiStep] ?? steps[0];

    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={heroUiStep}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.99 }}
          animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="rounded-2xl border border-white/55 bg-white/80 backdrop-blur px-4 py-3 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)]">
                {s.badge}
              </p>
              <p className="mt-1 text-sm font-black text-[var(--saarthi-on-background)]">{s.title}</p>
              <p className="mt-0.5 text-[11px] font-bold text-[var(--saarthi-on-surface-variant)]">{s.sub}</p>
            </div>
            <div className="rounded-full bg-[var(--saarthi-primary)] text-white px-3 py-1.5 text-[10px] font-extrabold shadow-sm">
              लाइव
            </div>
          </div>
          <motion.div
            className="mt-3 h-1.5 rounded-full bg-[rgba(24,29,23,0.10)] overflow-hidden"
            initial={false}
          >
            <motion.div
              className="h-full bg-[var(--saarthi-primary)] rounded-full"
              initial={reduce ? undefined : { width: '0%' }}
              animate={reduce ? undefined : { width: '100%' }}
              transition={reduce ? undefined : { duration: 2.2, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  };

  const IndiaFlowMap: React.FC = () => {
    // India outline image + animated route overlays (big labels, icon-first)
    return (
      <div className="relative rounded-3xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,197,94,0.12),transparent_55%),radial-gradient(circle_at_85%_22%,rgba(251,191,36,0.18),transparent_55%),radial-gradient(circle_at_55%_88%,rgba(22,163,74,0.10),transparent_60%)]" />
        <div className="relative p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-extrabold saarthi-headline text-xl sm:text-2xl text-[var(--saarthi-on-background)]">
                सारथी सेतु पूरे भारत में कैसे काम करता है
              </p>
              <p className="mt-1 text-sm text-[var(--saarthi-on-surface-variant)] max-w-xl">
                डिमांड से लेकर ट्रक और भुगतान तक — सब कुछ विज़ुअल में।
              </p>
            </div>
            <div className="rounded-full bg-[var(--saarthi-surface-low)] border border-[var(--saarthi-outline-soft)] px-3 py-1.5 text-[10px] font-extrabold text-[var(--saarthi-on-surface-variant)]">
              लाइव नेटवर्क डेमो
            </div>
          </div>

          <div className="mt-5 grid lg:grid-cols-2 gap-4 items-stretch">
            <div className="relative rounded-3xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-white">
              <img
                src="/images/india_crop_map_ref.png"
                alt="भारत का नक्शा"
                className="w-full h-auto block opacity-95"
              />

              {/* Glowing route overlay (MP -> दिल्ली), with moving notification + truck */}
              <svg viewBox="0 0 1000 650" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="routeGlow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(34,197,94,0.30)" />
                    <stop offset="50%" stopColor="rgba(34,197,94,0.90)" />
                    <stop offset="100%" stopColor="rgba(251,191,36,0.95)" />
                  </linearGradient>
                  <filter id="routeSoft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                {/* Route path (approx visual) */}
                <path d="M540 330 C 560 270, 585 230, 610 200" stroke="url(#routeGlow)" strokeWidth="10" fill="none" opacity="0.85" />
                <path d="M540 330 C 560 270, 585 230, 610 200" stroke="rgba(34,197,94,0.18)" strokeWidth="20" fill="none" filter="url(#routeSoft)" />

                {!reduce ? (
                  <>
                    <motion.circle
                      r="10"
                      fill="rgba(34,197,94,0.95)"
                      stroke="white"
                      strokeWidth="4"
                      animate={{ offsetDistance: ['0%', '100%'] } as any}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                      style={{ offsetPath: 'path("M540 330 C 560 270, 585 230, 610 200")' } as any}
                    />
                    <motion.g
                      animate={{ offsetDistance: ['0%', '100%'] } as any}
                      transition={{ duration: 3.2, repeat: Infinity, ease: 'linear', delay: 0.7 }}
                      style={{ offsetPath: 'path("M540 330 C 560 270, 585 230, 610 200")' } as any}
                    >
                      <rect x="-20" y="-12" width="40" height="24" rx="10" fill="rgba(255,255,255,0.92)" stroke="rgba(112,122,108,0.25)" />
                      <circle cx="-12" cy="14" r="4" fill="rgba(24,29,23,0.35)" />
                      <circle cx="12" cy="14" r="4" fill="rgba(24,29,23,0.35)" />
                      <rect x="-7" y="-7" width="18" height="14" rx="5" fill="rgba(251,191,36,0.25)" />
                    </motion.g>
                  </>
                ) : null}
              </svg>

              {/* Big popups (icon-first, readable) */}
              <div className="absolute top-4 left-4 rounded-2xl border border-white/55 bg-white/90 backdrop-blur px-4 py-3 shadow-sm max-w-[18rem]">
                <p className="text-[11px] font-extrabold tracking-wide text-[var(--saarthi-on-surface-variant)]">
                  दिल्ली (खरीदार)
                </p>
                <p className="mt-1 text-sm font-black text-[var(--saarthi-on-background)]">500 किलो गेहूं चाहिए</p>
              </div>
              <div className="absolute bottom-4 left-4 rounded-2xl border border-white/55 bg-white/90 backdrop-blur px-4 py-3 shadow-sm max-w-[18rem]">
                <p className="text-[11px] font-extrabold tracking-wide text-[var(--saarthi-on-surface-variant)]">
                  मध्य प्रदेश (किसान)
                </p>
                <p className="mt-1 text-sm font-black text-[var(--saarthi-on-background)]">मोबाइल अलर्ट मिला ✅</p>
              </div>
              <motion.div
                className="absolute bottom-4 right-4 rounded-2xl border border-white/55 bg-white/90 backdrop-blur px-4 py-3 shadow-sm max-w-[18rem]"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <p className="text-[11px] font-extrabold tracking-wide text-[var(--saarthi-on-surface-variant)]">
                  भुगतान
                </p>
                <p className="mt-1 text-sm font-black text-[var(--saarthi-on-background)]">सफल ✅ बेहतर दाम</p>
              </motion.div>
            </div>

            {/* Icon flow strip (no paragraphs) */}
            <div className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { i: '1', t: 'डिमांड उठी', d: 'दिल्ली खरीदार' },
                  { i: '2', t: 'नोटिफिकेशन', d: 'MP किसान तक' },
                  { i: '3', t: 'ऑर्डर एक्सेप्ट', d: 'एक टैप' },
                  { i: '4', t: 'ट्रक बुक', d: 'सारथी सेतु' },
                  { i: '5', t: 'रूट ट्रैक', d: 'MP → दिल्ली' },
                  { i: '6', t: 'पेमेंट', d: 'बेहतर दाम' },
                ].map((s) => (
                  <div key={s.i} className="rounded-2xl border border-[var(--saarthi-outline-soft)] bg-white px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl grid place-items-center bg-[var(--saarthi-surface-low)] border border-[var(--saarthi-outline-soft)] text-[var(--saarthi-primary)] font-black">
                      {s.i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-[var(--saarthi-on-background)]">{s.t}</p>
                      <p className="text-xs font-bold text-[var(--saarthi-on-surface-variant)]">{s.d}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl grid place-items-center bg-white border border-[var(--saarthi-outline-soft)] text-[var(--saarthi-primary)]">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatCard: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)]">
            {label}
          </p>
          <p className="mt-1 text-2xl font-black text-[var(--saarthi-on-background)]">{value}</p>
        </div>
        {icon ? (
          <div className="w-11 h-11 rounded-2xl grid place-items-center bg-[var(--saarthi-surface-low)] border border-[var(--saarthi-outline-soft)] text-[var(--saarthi-primary)]">
            {icon}
          </div>
        ) : null}
      </div>
    </motion.div>
  );

  const UspCards: React.FC = () => {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref, { amount: 0.25, once: true });
    const c1 = useCountUp(inView && !reduce, { to: 28 });
    const c2 = useCountUp(inView && !reduce, { to: 1 });
    const c3 = useCountUp(inView && !reduce, { to: 24 });

    const items = [
      { t: 'बेहतर दाम', d: 'बिना बिचौलिया' },
      { t: 'बिना बिचौलिया बिक्री', d: 'सीधा खरीदार' },
      { t: 'एक क्लिक ट्रांसपोर्ट', d: 'ट्रक तुरंत' },
      { t: 'लाइव मंडी भाव', d: 'हर दिन अपडेट' },
      { t: 'पूरे भारत के खरीदार', d: 'बड़ा नेटवर्क' },
      { t: 'भरोसेमंद सौदे', d: 'सुरक्षित + ट्रेस' },
    ];

    return (
      <div ref={ref} className="px-4 sm:px-6 max-w-7xl mx-auto py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="saarthi-headline text-2xl sm:text-3xl font-black text-[var(--saarthi-on-background)]">
              किसानों को यह क्यों चाहिए
            </p>
            <p className="mt-2 text-sm text-[var(--saarthi-on-surface-variant)] max-w-2xl">
              कम टेक्स्ट, ज़्यादा विज़ुअल — हर USP एक कार्ड में।
            </p>
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it, idx) => (
            <motion.div
              key={it.t}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: reduce ? 0 : idx * 0.04 }}
              whileHover={reduce ? undefined : { y: -5, scale: 1.01 }}
              className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm p-5 overflow-hidden relative"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[rgba(34,197,94,0.10)] blur-[1px]" />
              <div className="absolute -left-8 -bottom-8 w-28 h-28 rounded-full bg-[rgba(251,191,36,0.16)] blur-[1px]" />
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)]">
                यूएसपी
              </p>
              <p className="mt-1 text-lg font-black text-[var(--saarthi-on-background)] leading-snug">{it.t}</p>
              <p className="mt-1 text-sm font-bold text-[var(--saarthi-on-surface-variant)]">{it.d}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="h-2 flex-1 rounded-full bg-[rgba(24,29,23,0.06)] overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--saarthi-primary)]"
                    initial={reduce ? undefined : { width: '0%' }}
                    whileInView={reduce ? undefined : { width: '100%' }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={reduce ? undefined : { duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] font-extrabold text-[var(--saarthi-primary)]">
                  देखें
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const MandiDashboard: React.FC = () => {
    const cards = [
      { crop: 'गेहूं', city: 'इंदौर', price: '₹2450' },
      { crop: 'प्याज', city: 'नासिक', price: '₹1800' },
      { crop: 'मक्का', city: 'भोपाल', price: '₹2100' },
      { crop: 'टमाटर', city: 'बेंगलुरु', price: '₹1600' },
    ];

    return (
      <section ref={mandiRef} id="mandi-bhav" className="scroll-mt-28 px-4 sm:px-6 max-w-7xl mx-auto py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="saarthi-headline text-2xl sm:text-3xl font-black text-[var(--saarthi-on-background)]">
              आज के लाइव मंडी भाव
            </p>
            <p className="mt-2 text-sm text-[var(--saarthi-on-surface-variant)] max-w-2xl">
              डैशबोर्ड स्टाइल — टिकर चलता रहेगा।
            </p>
          </div>
          <div className="rounded-full bg-white/70 backdrop-blur border border-[var(--saarthi-outline-soft)] px-3 py-2 text-[10px] font-extrabold text-[var(--saarthi-on-surface-variant)]">
            ऑटो-अपडेट
          </div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <motion.div
              key={c.crop}
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm p-5"
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)]">
                {c.city}
              </p>
              <p className="mt-1 text-lg font-black text-[var(--saarthi-on-background)]">{c.crop}</p>
              <p className="mt-2 text-2xl font-black text-[var(--saarthi-primary)]">{c.price}</p>
              <p className="mt-1 text-xs font-bold text-[var(--saarthi-on-surface-variant)]">
                प्रति क्विंटल (डेमो)
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/70 backdrop-blur shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--saarthi-outline-soft)] flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[var(--saarthi-on-background)]">टिकर</p>
            <span className="text-[10px] font-extrabold text-[var(--saarthi-on-surface-variant)]">लाइव</span>
          </div>
          <div className="relative h-12">
            {!reduce ? (
              <motion.div
                className="absolute inset-y-0 left-0 flex items-center gap-6 whitespace-nowrap px-4"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                {[...cards, ...cards].map((c, idx) => (
                  <span key={`${c.crop}-${idx}`} className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--saarthi-on-surface-variant)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--saarthi-primary)]" />
                    {c.crop} {c.city} <span className="text-[var(--saarthi-primary)]">{c.price}</span>
                  </span>
                ))}
              </motion.div>
            ) : (
              <div className="absolute inset-y-0 left-0 flex items-center gap-6 whitespace-nowrap px-4">
                {cards.map((c) => (
                  <span key={c.crop} className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--saarthi-on-surface-variant)]">
                    <span className="w-2 h-2 rounded-full bg-[var(--saarthi-primary)]" />
                    {c.crop} {c.city} <span className="text-[var(--saarthi-primary)]">{c.price}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const FarmerJourney: React.FC = () => (
    <section ref={journeyRef} id="farmer-journey" className="scroll-mt-28 px-4 sm:px-6 max-w-7xl mx-auto py-10 sm:py-14">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="saarthi-headline text-2xl sm:text-3xl font-black text-[var(--saarthi-on-background)]">
            सारथी सेतु से पहले और बाद
          </p>
          <p className="mt-2 text-sm text-[var(--saarthi-on-surface-variant)] max-w-2xl">
            टाइमलाइन नहीं — सीधे दो दुनिया का फर्क।
          </p>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -14 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--saarthi-outline-soft)] bg-[rgba(239,68,68,0.05)]">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[rgba(239,68,68,0.85)]">
              पहले
            </p>
            <p className="mt-1 text-lg font-black text-[var(--saarthi-on-background)]">
              किसान मंडी में इंतजार
            </p>
          </div>
          <div className="p-5 space-y-3">
            {[
              'कम दाम',
              'बिचौलिया',
              'तनाव',
            ].map((x) => (
              <div key={x} className="rounded-2xl border border-[var(--saarthi-outline-soft)] bg-white px-4 py-3 flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-[var(--saarthi-on-surface-variant)]">{x}</span>
                <span className="text-xs font-black text-[rgba(239,68,68,0.85)]">—</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 14 }}
          whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-[var(--saarthi-outline-soft)] bg-[rgba(34,197,94,0.07)]">
            <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--saarthi-primary)]">
              बाद
            </p>
            <p className="mt-1 text-lg font-black text-[var(--saarthi-on-background)]">
              मोबाइल पर ऑर्डर → ट्रक → भुगतान
            </p>
          </div>
          <div className="p-5 space-y-3">
            {[
              'मोबाइल पर ऑर्डर',
              'ट्रक घर से उठाव',
              'सही दाम',
              'तुरंत भुगतान',
            ].map((x, idx) => (
              <motion.div
                key={x}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: reduce ? 0 : idx * 0.05 }}
                className="rounded-2xl border border-[var(--saarthi-outline-soft)] bg-white px-4 py-3 flex items-center justify-between gap-3"
              >
                <span className="text-sm font-bold text-[var(--saarthi-on-surface-variant)]">{x}</span>
                <span className="text-xs font-black text-[var(--saarthi-primary)]">✓</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );

  return (
    <div className="relative min-h-screen pb-28 md:pb-8 text-[var(--saarthi-on-surface)]">
      <CropsFieldBackdrop />

      {/* Splash */}
      <AnimatePresence>
        {splashOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-white/65 backdrop-blur-xl"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <motion.div
              className="rounded-3xl border border-white/60 bg-white/85 backdrop-blur shadow-2xl px-6 py-5 flex items-center gap-4"
              initial={reduce ? false : { scale: 0.98, y: 8 }}
              animate={reduce ? undefined : { scale: 1, y: 0 }}
              exit={reduce ? undefined : { scale: 0.98, y: 8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <img src="/images/saarthi_setu_logo.png" alt="सारथी सेतु" className="w-12 h-12 rounded-2xl bg-white ring-1 ring-[var(--saarthi-outline-soft)] p-1" />
              <div>
                <p className="text-lg font-black text-[var(--saarthi-primary)]">सारथी सेतु</p>
                <p className="text-xs font-bold text-[var(--saarthi-on-surface-variant)]">किसान-प्रथम प्लेटफॉर्म</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Top bar — Stitch glass nav */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-[60] safe-top"
        initial={false}
        animate={scrolled ? 'solid' : 'clear'}
        variants={{
          clear: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.25)' },
          solid: { backdropFilter: 'blur(14px)', backgroundColor: 'rgba(255,255,255,0.86)', borderColor: 'rgba(112,122,108,0.25)' },
        }}
        style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
      >
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="saarthi-headline text-xl font-extrabold text-[var(--saarthi-primary)] tracking-tight">
              <span className="inline-flex items-center gap-2">
                <img
                  src="/images/saarthi_setu_logo.png"
                  alt="सारथी सेतु"
                  className="w-11 h-11 object-contain rounded-xl bg-white ring-1 ring-[var(--saarthi-outline-soft)] p-1"
                />
                <span className="font-black text-[var(--saarthi-primary)]">सारथी सेतु</span>
              </span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-sm font-extrabold">
            <button
              type="button"
              onClick={() => scrollTo(heroRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-primary)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>होम</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(howRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>कैसे काम करता है</span>
            </button>
            <button
              type="button"
              onClick={() => scrollTo(mandiRef.current)}
              className="px-3 py-2 rounded-2xl text-[var(--saarthi-on-surface-variant)] hover:bg-[var(--saarthi-surface-low)] transition-colors"
            >
              <span>मंडी भाव</span>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-1">
              {LANG_OPTS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`min-h-[34px] min-w-[34px] rounded-xl text-[11px] font-extrabold border transition-colors ${
                    lang === code
                      ? 'bg-[var(--saarthi-primary)] text-white border-[var(--saarthi-primary)]'
                      : 'bg-white/90 text-[var(--saarthi-on-surface-variant)] border-[var(--saarthi-outline-soft)] hover:bg-white'
                  }`}
                  aria-label={`भाषा: ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={goOnboarding}
              className="rounded-full bg-[var(--saarthi-primary)] text-white px-4 py-2 font-black text-sm shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <span className="inline-flex items-center gap-2">
                <img src="/images/saarthi_setu_logo.png" alt="" className="w-5 h-5 rounded-lg bg-white/90 p-0.5" />
                लॉगिन
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

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
            <div className="w-full h-full grid place-items-center bg-[var(--saarthi-primary)]">
              <span className="text-white font-black">S</span>
            </div>
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
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[var(--saarthi-outline-soft)] bg-[var(--saarthi-primary)] shrink-0 grid place-items-center">
                    <span className="text-white font-black">S</span>
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
        <section
          ref={heroRef}
          id="landing-hero"
          className="px-4 sm:px-6 py-10 sm:py-14 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-12 items-center scroll-mt-28"
        >
          <div className="relative order-2 lg:order-1 space-y-6">
            <Clouds />
            <FloatingCrop emoji="🌾" className="w-12 h-12 top-8 -left-1" delay={0.1} />
            <FloatingCrop emoji="🌽" className="w-12 h-12 top-16 left-24" delay={0.7} />
            <FloatingCrop emoji="🍅" className="w-12 h-12 top-24 right-10" delay={1.1} />
            <FloatingCrop emoji="🧅" className="w-12 h-12 top-40 right-28" delay={1.6} />

            <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={reduce ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1.5 border border-white/50 text-xs font-extrabold text-[var(--saarthi-on-surface-variant)] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[var(--saarthi-primary)]" />
                किसान-प्रथम • लॉजिस्टिक्स + सीधा बाज़ार
              </p>
              <h1 className="mt-4 saarthi-headline text-3xl sm:text-4xl md:text-5xl font-black text-[var(--saarthi-on-background)] leading-tight">
                अच्छा दाम, सीधा बाज़ार, पूरे भारत से जुड़ाव
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[var(--saarthi-on-surface-variant)] leading-relaxed max-w-xl font-bold">
                अपनी फसल सीधे खरीदारों को बेचें, ट्रांसपोर्ट बुक करें और मंडी भाव देखें।
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.div
                whileTap={reduce ? undefined : { scale: 0.98 }}
                animate={reduce ? undefined : { boxShadow: ['0 0 0 0 rgba(34,197,94,0.00)', '0 0 0 12px rgba(34,197,94,0.14)', '0 0 0 0 rgba(34,197,94,0.00)'] }}
                transition={reduce ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-2xl"
              >
                <V2Button variant="primary" className="min-h-[56px] px-8 w-full sm:w-auto" onClick={goOnboarding}>
                  बिक्री शुरू करें
                </V2Button>
              </motion.div>
              <V2Button
                variant="secondary"
                className="min-h-[56px] px-8 w-full sm:w-auto"
                onClick={() => scrollTo(howRef.current)}
              >
                डेमो देखें
              </V2Button>
            </div>

            {/* Live mandi popup (moved to left, after text) */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <div className="rounded-3xl border border-white/60 bg-white/78 backdrop-blur-xl shadow-sm overflow-hidden">
                <div className="px-4 sm:px-5 py-3 border-b border-white/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--saarthi-primary)]" />
                    <p className="text-sm font-black text-[var(--saarthi-on-background)]">आज के लाइव मंडी भाव</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[var(--saarthi-primary)] text-white">
                    लाइव
                  </span>
                </div>
                <div className="p-4 sm:p-5 grid sm:grid-cols-3 gap-3">
                  {[
                    { crop: 'गेहूं', city: 'इंदौर', price: '₹2450' },
                    { crop: 'प्याज', city: 'नासिक', price: '₹1800' },
                    { crop: 'मक्का', city: 'भोपाल', price: '₹2100' },
                  ].map((x) => (
                    <div key={x.crop} className="rounded-2xl border border-white/60 bg-white/85 px-4 py-3">
                      <p className="text-[11px] font-extrabold text-[var(--saarthi-on-surface-variant)]">{x.city}</p>
                      <p className="mt-0.5 text-base font-black text-[var(--saarthi-on-background)]">{x.crop}</p>
                      <p className="mt-1 text-lg font-black text-[var(--saarthi-primary)]">{x.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

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

            <TruckHorizon />
          </div>

          <div className="order-1 lg:order-2 relative">
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.98, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[var(--saarthi-outline-soft)] bg-white relative"
            >
              <div className="relative">
                <img
                  src="/images/hero_farmer.png"
                  alt="सारथी सेतु ऐप का उपयोग करते किसान"
                  className="w-full h-[460px] sm:h-[520px] object-cover"
                  loading="eager"
                />
                {/* Keep photo fully visible: no overlay cards on the image */}
              </div>
            </motion.div>

            {/* Info strip moved below image (no photo obstruction) */}
            <div className="mt-4 max-w-md mx-auto">
              <div className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/80 backdrop-blur shadow-sm px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--saarthi-on-surface-variant)]">
                    किसान → खरीदार → ट्रक
                  </p>
                  <p className="mt-1 text-sm font-black text-[var(--saarthi-on-background)] leading-tight">
                    बिना बिचौलिया • सही दाम • तेज़ भुगतान
                  </p>
                </div>
                <div className="shrink-0 rounded-full bg-[var(--saarthi-primary)] text-white px-3 py-2 text-[10px] font-extrabold shadow-sm">
                  <span className="inline-flex items-center gap-2">
                    <img src="/images/saarthi_setu_logo.png" alt="" className="w-4 h-4 rounded bg-white/90 p-0.5" />
                    सारथी सेतु
                  </span>
                </div>
              </div>
            </div>

            {/* App card on mobile (never on face) */}
            <div className="sm:hidden mt-4">
              <div className="rounded-3xl border border-[var(--saarthi-outline-soft)] bg-white/85 backdrop-blur shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--saarthi-outline-soft)] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <img src="/images/saarthi_setu_logo.png" alt="" className="w-8 h-8 rounded-xl bg-white ring-1 ring-[var(--saarthi-outline-soft)] p-1" />
                    <p className="text-sm font-black text-[var(--saarthi-on-background)]">सारथी सेतु</p>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-[var(--saarthi-primary)] text-white">लाइव</span>
                </div>
                <div className="p-4">
                  <div className="rounded-2xl border border-[var(--saarthi-outline-soft)] bg-white p-4">
                    <p className="text-[11px] font-extrabold text-[var(--saarthi-on-surface-variant)]">ऑर्डर</p>
                    <p className="mt-1 text-lg font-black text-[var(--saarthi-on-background)]">500 किलो गेहूं</p>
                    <p className="mt-1 text-sm font-bold text-[var(--saarthi-on-surface-variant)]">दिल्ली से डिमांड</p>
                    <div className="mt-3 h-1.5 rounded-full bg-[rgba(24,29,23,0.08)] overflow-hidden">
                      <div className="h-full w-2/3 bg-[var(--saarthi-primary)] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: How it works (India map network flow) */}
        <div ref={howRef as any} id="how-it-works" className="scroll-mt-28">
          <HowItWorks3DDemo onCtaClick={goOnboarding} lang={lang} />
        </div>

        {/* Section 3: USPs */}
        <UspCards />

        {/* Section 4: Mandi Bhav */}
        <MandiDashboard />

        {/* Section 5: Farmer Journey */}
        <FarmerJourney />

        {/* Minimal CTA footer (keep clean) */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto py-14 sm:py-16">
          <Card className="p-6 sm:p-8 bg-[var(--saarthi-primary)] text-white border-0 overflow-hidden relative">
            <div aria-hidden className="absolute -top-20 -right-16 w-56 h-56 rounded-full bg-white/15 blur-[1px]" />
            <div aria-hidden className="absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-white/10 blur-[1px]" />
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-2xl sm:text-3xl font-black saarthi-headline">
                  आपकी फसल अब पूरे भारत तक
                </p>
                <p className="mt-2 text-sm text-white/90">
                  किसान, खरीदार और ट्रांसपोर्ट — एक ही प्लेटफॉर्म पर।
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <V2Button variant="secondary" className="min-h-[56px] px-8 bg-white text-[var(--saarthi-primary)]" onClick={goOnboarding}>
                  किसान लॉगिन
                </V2Button>
                <V2Button variant="secondary" className="min-h-[56px] px-8 bg-white/15 text-white border border-white/25" onClick={goOnboarding}>
                  खरीदार लॉगिन
                </V2Button>
                <V2Button variant="secondary" className="min-h-[56px] px-8 bg-white/15 text-white border border-white/25" onClick={goOnboarding}>
                  अभी जुड़ें
                </V2Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Footer */}
        <footer className="bg-zinc-900 text-zinc-300 py-14 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/saarthi_setu_logo.png" alt="सारथी सेतु" className="w-12 h-12 rounded-2xl bg-white ring-1 ring-zinc-800 p-1" />
                <div>
                  <div className="saarthi-headline text-2xl sm:text-3xl font-black text-green-400">सारथी सेतु</div>
                  <p className="text-xs text-zinc-500 font-bold">किसान-प्रथम एग्री-लॉजिस्टिक्स</p>
                </div>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                किसानों को सीधे खरीदारों से जोड़कर बेहतर दाम, ट्रांसपोर्ट बुकिंग और मंडी भाव — सब एक जगह।
              </p>
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
              <h5 className="text-white font-bold saarthi-headline mb-4">प्रोडक्ट</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button type="button" onClick={goOnboarding} className="hover:text-green-400 text-left w-full">
                    लॉगिन
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo(mandiRef.current)} className="hover:text-green-400 text-left w-full">
                    मंडी भाव
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => scrollTo(howRef.current)} className="hover:text-green-400 text-left w-full">
                    कैसे काम करता है
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold saarthi-headline mb-4">सपोर्ट</h5>
              <ul className="space-y-3 text-sm">
                <li>
                  <button type="button" onClick={() => scrollTo(didiRef.current)} className="hover:text-green-400 text-left w-full">
                    मदद
                  </button>
                </li>
                <li>
                  <span className="text-zinc-500">शर्तें</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold saarthi-headline mb-4">ऐप</h5>
              <p className="text-zinc-500 text-xs mb-4 leading-relaxed">
                मोबाइल पर ऑर्डर, ट्रांसपोर्ट और मंडी भाव — आसान और तेज़।
              </p>
              <button
                type="button"
                className="w-full bg-zinc-800 hover:bg-zinc-700 py-2.5 rounded-xl flex items-center justify-center gap-3 border border-zinc-700 transition-colors"
              >
                <span className="text-xl" aria-hidden>
                  ▶
                </span>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-400">गूगल प्ले</p>
                  <p className="font-bold text-xs text-white">जल्द आ रहा है</p>
                </div>
              </button>
            </div>
          </div>
          <div className="max-w-7xl mx-auto border-t border-zinc-800 mt-12 pt-6 text-center text-xs text-zinc-600">
            © {new Date().getFullYear()} सारथी सेतु
          </div>
        </footer>
      </main>

      {/* Didi scroll target */}
      <div ref={didiRef} id="didi-anchor" className="h-px w-full scroll-mt-32" aria-hidden />

      {/* Mobile bottom bar — Stitch */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[55] flex justify-around items-center px-2 pb-5 pt-2 bg-white/92 backdrop-blur-xl border-t border-[var(--saarthi-outline-soft)] rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => scrollTo(heroRef.current)} className="flex flex-col items-center py-1 text-[var(--saarthi-primary)] min-w-[4rem]">
          <span className="text-lg font-black">⌂</span>
          <span className="text-[9px] font-bold uppercase mt-0.5">होम</span>
        </button>
        <button type="button" onClick={() => scrollTo(howRef.current)} className="flex flex-col items-center py-1 text-zinc-500 min-w-[4rem]">
          <span className="text-lg font-black">⇄</span>
          <span className="text-[9px] font-bold uppercase mt-0.5">कैसे</span>
        </button>
        <button type="button" onClick={() => scrollTo(mandiRef.current)} className="flex flex-col items-center py-1 text-zinc-500 min-w-[4rem]">
          <span className="text-lg font-black">₹</span>
          <span className="text-[9px] font-bold uppercase mt-0.5">मंडी</span>
        </button>
        <button type="button" onClick={goOnboarding} className="flex flex-col items-center py-1 text-zinc-500 min-w-[4rem]">
          <span className="text-lg font-black">⟶</span>
          <span className="text-[9px] font-bold uppercase mt-0.5">लॉगिन</span>
        </button>
      </nav>
    </div>
  );
};
