import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../i18n/I18nContext';
import { useV2Session } from '../../../state/v2Session';
import { useAppState } from '../../../state/AppState';
import type { Lang } from '../../../i18n/translations';
import type { SaarthiUserRole } from '../../../types';
import { requestOtp, verifyOtp } from '../../../services/auth/mockOtp';
import { Button } from '../../ui/Button';
import { MapPin } from 'lucide-react';
import { SinglePinLocationMap } from '../maps/SinglePinLocationMap';
import { MP_CENTER } from '../../../config/mpLocations';

const LANGS: Lang[] = ['hi', 'en', 'kn', 'te'];

const PersonaCard: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full min-h-[56px] rounded-2xl border-2 px-4 text-left font-bold transition-all ${
      active ? 'border-[var(--saarthi-primary)] bg-white shadow-md' : 'border-transparent bg-[var(--saarthi-surface-low)]'
    }`}
  >
    {label}
  </button>
);

export const OnboardingWizard: React.FC = () => {
  const { tV2, lang } = useI18n();
  const { session, updateSession, clearSession } = useV2Session();
  const { setLang, setUserRole, setCurrentScreen } = useAppState();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(session.phone || '');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(session.name || '');
  const [pickLang, setPickLang] = useState<Lang>(session.preferredLang || lang);
  const [persona, setPersona] = useState<SaarthiUserRole | null>(session.persona);
  const [address, setAddress] = useState(session.addressLabel || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (session.onboardingComplete && session.persona) {
      navigate('/app', { replace: true });
    }
  }, [session.onboardingComplete, session.persona, navigate]);

  const goApp = () => {
    setLang(pickLang);
    if (persona) setUserRole(persona);
    setCurrentScreen('dashboard');
    navigate('/app', { replace: true });
  };

  const finish = () => {
    updateSession({
      phone: phone.replace(/\D/g, ''),
      name: name.trim(),
      preferredLang: pickLang,
      persona,
      addressLabel: address.trim(),
      onboardingComplete: true,
      otpVerified: true,
    });
    goApp();
  };

  const onRequestOtp = async () => {
    setErr('');
    setBusy(true);
    const p = phone.replace(/\D/g, '');
    if (p.length !== 10) {
      setErr('phone');
      setBusy(false);
      return;
    }
    const res = await requestOtp(p);
    if (!res.ok) setErr(res.message);
    updateSession({ phone: p });
    setBusy(false);
    if (res.ok) setStep(2);
  };

  const onVerifyOtp = async () => {
    setBusy(true);
    const ok = await verifyOtp(phone.replace(/\D/g, ''), otp);
    setBusy(false);
    if (!ok) {
      setErr('otp');
      return;
    }
    updateSession({ otpVerified: true });
    setStep(3);
  };

  const useGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateSession({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setAddress((a) => a || `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`);
      },
      () => setErr('gps')
    );
  };

  return (
    <div className="min-h-screen bg-[var(--saarthi-bg)] text-[var(--saarthi-on-surface)] px-4 py-8 pb-24 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button type="button" className="text-sm font-bold text-[var(--saarthi-primary)]" onClick={() => navigate('/')}>
          {tV2('v2.common.back')}
        </button>
        <span className="text-xs font-bold text-[var(--saarthi-on-surface-variant)]">
          {tV2('v2.onboard.step')} {step}/7
        </span>
      </div>

      <h1 className="saarthi-headline text-2xl font-extrabold text-[var(--saarthi-primary)] mb-1">{tV2('v2.header.app')}</h1>
      {err ? <p className="text-red-600 text-sm mb-2">{err}</p> : null}

      {step === 1 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.phoneTitle')}</h2>
          <p className="text-sm text-gray-600">{tV2('v2.onboard.phoneHint')}</p>
          <input
            className="w-full min-h-[52px] rounded-2xl border-2 border-gray-200 px-4 text-lg bg-white"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
          />
          <Button type="button" fullWidth className="min-h-[56px] rounded-2xl" onClick={onRequestOtp} disabled={busy}>
            {tV2('v2.onboard.continue')}
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.otpTitle')}</h2>
          <p className="text-sm text-gray-600">{tV2('v2.onboard.otpHint')}</p>
          <input
            className="w-full min-h-[52px] rounded-2xl border-2 border-gray-200 px-4 text-lg bg-white tracking-widest"
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button type="button" fullWidth onClick={onVerifyOtp} disabled={busy}>
            {tV2('v2.onboard.verify')}
          </Button>
          <button type="button" className="text-sm font-bold text-[var(--saarthi-tertiary)] w-full" onClick={onRequestOtp}>
            {tV2('v2.onboard.resendOtp')}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.nameTitle')}</h2>
          <input
            className="w-full min-h-[52px] rounded-2xl border-2 border-gray-200 px-4 text-lg bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="button" fullWidth onClick={() => name.trim() && setStep(4)} disabled={!name.trim()}>
            {tV2('v2.common.next')}
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.langTitle')}</h2>
          <div className="grid grid-cols-2 gap-2">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setPickLang(l)}
                className={`min-h-[52px] rounded-2xl font-bold border-2 ${
                  pickLang === l ? 'bg-[var(--saarthi-primary)] text-white border-[var(--saarthi-primary)]' : 'bg-white border-gray-200'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Button type="button" fullWidth onClick={() => setStep(5)}>
            {tV2('v2.common.next')}
          </Button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.personaTitle')}</h2>
          <div className="space-y-2">
            <PersonaCard label={tV2('v2.persona.farmer')} active={persona === 'farmer'} onClick={() => setPersona('farmer')} />
            <PersonaCard label={tV2('v2.persona.buyer')} active={persona === 'buyer'} onClick={() => setPersona('buyer')} />
            <PersonaCard
              label={tV2('v2.persona.logistics')}
              active={persona === 'logistics_partner'}
              onClick={() => setPersona('logistics_partner')}
            />
            <PersonaCard
              label={tV2('v2.persona.cold')}
              active={persona === 'cold_storage_owner'}
              onClick={() => setPersona('cold_storage_owner')}
            />
          </div>
          <Button type="button" fullWidth disabled={!persona} onClick={() => setStep(6)}>
            {tV2('v2.common.next')}
          </Button>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.locationTitle')}</h2>
          <p className="text-sm text-gray-600">{tV2('v2.onboard.locationHint')}</p>
          <p className="text-xs text-gray-500">{tV2('v2.onboard.mapHint')}</p>
          <SinglePinLocationMap
            lat={session.lat}
            lng={session.lng}
            defaultCenter={MP_CENTER}
            onChange={(lat, lng) => {
              updateSession({ lat, lng });
            }}
          />
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              className="w-full min-h-[52px] rounded-2xl border-2 border-gray-200 pl-11 pr-4 text-lg bg-white"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={tV2('v2.onboard.locationHint')}
            />
          </div>
          <Button type="button" variant="outline" fullWidth onClick={useGps}>
            {tV2('v2.onboard.useGps')}
          </Button>
          <Button type="button" fullWidth onClick={() => setStep(7)} disabled={!address.trim()}>
            {tV2('v2.common.next')}
          </Button>
        </div>
      )}

      {step === 7 && (
        <div className="space-y-4 mt-6">
          <h2 className="text-lg font-bold">{tV2('v2.onboard.summaryTitle')}</h2>
          <div className="rounded-2xl bg-white p-4 space-y-2 text-sm shadow-sm">
            <p>
              <span className="font-bold">{name}</span> · {phone}
            </p>
            <p>{address}</p>
            <p className="text-xs text-gray-500">{pickLang.toUpperCase()}</p>
          </div>
          <Button type="button" fullWidth className="min-h-[56px] rounded-2xl" onClick={finish}>
            {tV2('v2.onboard.continue')}
          </Button>
          <button type="button" className="text-xs text-gray-500 w-full text-center" onClick={() => clearSession()}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
