import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useI18n } from '../../../i18n/I18nContext';
import { mapsEnabled, GOOGLE_MAPS_API_KEY } from '../../../services/maps/googleMapsConfig';
import { getDistrictByName, LOCATION_NAMES } from '../../../config/mpLocations';
import { listProduce, requestPickup } from '../../../services/mvpDataService';
import type { ProduceItem, UserPreferences } from '../../../types';
import { Button } from '../../ui/Button';
import { Loader2, MapPinned, Truck, ExternalLink, Mic, ArrowLeftRight } from 'lucide-react';
import { BookingRouteMapInner } from '../maps/InteractiveBookingMap';
import { FallbackOsrmLeafletMap } from '../maps/FallbackOsrmLeafletMap';
import type { LatLng, DrivingRouteResult } from '../../../services/maps/routePlanning';
import { buildGoogleMapsDirUrl } from '../../../services/maps/routePlanning';
import { computeMoistureImpact } from '../../../services/moisturePriceModel';
import { PayoutBreakdown } from '../ui/PayoutBreakdown';
import { CONTACT } from '../../../config/contact';
import { buildWhatsAppLink, templateBookingConfirmation, templateTestimonialRequest } from '../../../services/whatsappTemplates';
import { useVoiceAssistant } from '../../../voice/VoiceAssistantProvider';

const CITY_OPTIONS = LOCATION_NAMES.slice(0, 28);

function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

type Props = {
  preferences: UserPreferences | null;
  onDone?: () => void;
};

export const LogisticsBookingMapFlow: React.FC<Props> = ({ preferences, onDone }) => {
  const { t, tV2 } = useI18n();
  const { dictateOnce, listening } = useVoiceAssistant();
  const [from, setFrom] = useState(preferences?.location?.trim() || 'Indore');
  const [to, setTo] = useState('Bhopal');
  const [produce, setProduce] = useState<ProduceItem[]>([]);
  const [produceId, setProduceId] = useState('');
  const [qty, setQty] = useState(5);
  const [moisturePct, setMoisturePct] = useState(14);
  const [needReturn, setNeedReturn] = useState(false);
  const [returnLoadKg, setReturnLoadKg] = useState(250);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [placeMode, setPlaceMode] = useState<'pickup' | 'drop'>('pickup');
  const [routePath, setRoutePath] = useState<LatLng[] | null>(null);
  const [routeMeta, setRouteMeta] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  useEffect(() => {
    listProduce().then((list) => {
      setProduce(list);
      if (list[0]) setProduceId(list[0].id);
      setLoading(false);
    });
  }, []);

  const pickupLL = useMemo((): LatLng => {
    const d = getDistrictByName(from);
    return d ? { lat: d.lat, lng: d.lng } : { lat: 22.72, lng: 75.86 };
  }, [from]);
  const dropLL = useMemo((): LatLng => {
    const d = getDistrictByName(to);
    return d ? { lat: d.lat, lng: d.lng } : { lat: 23.26, lng: 77.4 };
  }, [to]);

  const [pickAdjust, setPickAdjust] = useState<LatLng>(pickupLL);
  const [dropAdjust, setDropAdjust] = useState<LatLng>(dropLL);

  useEffect(() => {
    setPickAdjust(pickupLL);
    setDropAdjust(dropLL);
  }, [from, to, pickupLL, dropLL]);

  const onRouteComputed = useCallback((r: DrivingRouteResult | null) => {
    if (r && r.path.length > 0) {
      setRoutePath(r.path);
      setRouteMeta({ distanceKm: r.distanceKm, durationMin: r.durationMin });
    } else {
      setRoutePath(null);
      setRouteMeta(null);
    }
  }, []);

  const distanceKm = useMemo(() => {
    if (routeMeta) return Math.round(routeMeta.distanceKm * 10) / 10;
    return Math.round(haversineKm(pickAdjust, dropAdjust) * 10) / 10;
  }, [routeMeta, pickAdjust, dropAdjust]);

  const estimateInr = Math.max(800, Math.round(distanceKm * 42 * (1 + qty / 100)));
  const returnSavingsInr = useMemo(() => {
    if (!needReturn) return 0;
    // Pilot heuristic: a matched backhaul can reduce effective one-way cost by ~12–22%.
    const base = estimateInr;
    const pct = 0.16 + Math.min(0.06, Math.max(0, (returnLoadKg - 200) / 1000));
    return Math.round(base * Math.min(0.22, Math.max(0.12, pct)));
  }, [needReturn, estimateInr, returnLoadKg]);
  const split = useMemo(() => {
    const platform = Math.round(estimateInr * 0.05);
    const logistics = estimateInr - platform;
    return { logistics, platform, total: estimateInr };
  }, [estimateInr]);

  const selected = produce.find((p) => p.id === produceId);
  const moisture = useMemo(() => computeMoistureImpact(selected?.crop || 'Soybean', moisturePct), [selected?.crop, moisturePct]);

  const nearby = useMemo(
    () => [
      { id: '1', name: 'Ravi Transport', km: Math.max(2, Math.round(distanceKm * 0.15)), rating: 4.6 },
      { id: '2', name: 'MP Logistics', km: Math.max(3, Math.round(distanceKm * 0.22)), rating: 4.4 },
    ],
    [distanceKm]
  );

  const navHref = buildGoogleMapsDirUrl(pickAdjust, dropAdjust);
  const bookingId = useMemo(() => `bk-${Date.now().toString(36)}`, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    await requestPickup({
      produceId: selected.id,
      farmerName: preferences?.location?.trim() || 'Farmer',
      pickupLocation: `${from} (${pickAdjust.lat.toFixed(4)},${pickAdjust.lng.toFixed(4)})`,
      dropLocation: `${to} (${dropAdjust.lat.toFixed(4)},${dropAdjust.lng.toFixed(4)})`,
      quantity: qty,
      unit: selected.unit,
      estimatedFareInr: estimateInr,
    });
    setSubmitting(false);
    setDone(true);
    onDone?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--saarthi-primary)]" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6 text-center pb-24">
        <Truck className="w-14 h-14 text-[var(--saarthi-primary)] mx-auto mb-3" />
        <p className="text-lg font-bold">{t('pickup.submit')} ✓</p>
        <p className="mt-2 text-xs text-[var(--saarthi-on-surface-variant)]">Booking id: {bookingId}</p>
        <div className="mt-5 space-y-2">
          <a
            href={buildWhatsAppLink(
              templateBookingConfirmation({
                crop: selected?.crop || 'Crop',
                qty,
                unit: selected?.unit || 'unit',
                from,
                to,
                fareInr: estimateInr,
                moisturePct,
              }),
              CONTACT.phoneE164
            )}
            target="_blank"
            rel="noreferrer"
            className="block w-full min-h-[52px] rounded-2xl bg-[#25D366] text-white font-extrabold flex items-center justify-center"
          >
            WhatsApp: booking confirmation
          </a>
          <a
            href={buildWhatsAppLink(
              templateTestimonialRequest({ role: 'farmer', what: 'Booking flow + price/moisture info' }),
              CONTACT.phoneE164
            )}
            target="_blank"
            rel="noreferrer"
            className="block w-full min-h-[52px] rounded-2xl border-2 border-[var(--saarthi-outline-soft)] bg-white text-[var(--saarthi-primary)] font-extrabold flex items-center justify-center"
          >
            WhatsApp: request feedback
          </a>
        </div>
      </div>
    );
  }

  const mapCommonProps = {
    pickup: pickAdjust,
    drop: dropAdjust,
    onPickupChange: setPickAdjust,
    onDropChange: setDropAdjust,
    placeMode,
    routePath,
    onRouteComputed,
  };

  const mapBlock = mapsEnabled() ? (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['marker']}>
      <BookingRouteMapInner
        {...mapCommonProps}
        pickupLabel={tV2('v2.maps.pickup')}
        dropLabel={tV2('v2.maps.drop')}
      />
    </APIProvider>
  ) : (
    <FallbackOsrmLeafletMap {...mapCommonProps} />
  );

  return (
    <form onSubmit={submit} className="p-4 space-y-4 pb-28">
      <h2 className="text-xl font-bold flex items-center gap-2 saarthi-headline">
        <Truck className="text-[var(--saarthi-primary)]" />
        {t('pickup.title')}
      </h2>

      <p className="text-xs text-gray-600 leading-relaxed">{tV2('v2.maps.mapHelp')}</p>

      {mapBlock}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPlaceMode('pickup')}
          className={`min-h-[44px] flex-1 min-w-[120px] rounded-xl font-bold text-sm border-2 ${
            placeMode === 'pickup' ? 'border-[var(--saarthi-primary)] bg-green-50 text-green-900' : 'border-gray-200 bg-white text-gray-700'
          }`}
        >
          {tV2('v2.maps.tapPickup')}
        </button>
        <button
          type="button"
          onClick={() => setPlaceMode('drop')}
          className={`min-h-[44px] flex-1 min-w-[120px] rounded-xl font-bold text-sm border-2 ${
            placeMode === 'drop' ? 'border-[var(--saarthi-secondary)] bg-orange-50 text-orange-900' : 'border-gray-200 bg-white text-gray-700'
          }`}
        >
          {tV2('v2.maps.tapDrop')}
        </button>
      </div>

      <a
        href={navHref}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 min-h-[48px] w-full rounded-2xl border-2 border-[var(--saarthi-primary)] text-[var(--saarthi-primary)] font-bold text-sm bg-white hover:bg-green-50 transition-colors"
      >
        <ExternalLink className="w-4 h-4 shrink-0" />
        {tV2('v2.maps.openGoogleNav')}
      </a>

      {!mapsEnabled() ? (
        <p className="text-xs text-gray-500 flex items-start gap-2">
          <MapPinned className="w-4 h-4 shrink-0 mt-0.5" />
          {tV2('v2.maps.osmNote')}
        </p>
      ) : null}

      <div className="rounded-3xl bg-white border border-[var(--saarthi-outline-soft)] p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-extrabold text-sm">
            {tV2('v2.maps.pickup')} → {tV2('v2.maps.drop')}
          </p>
          <button
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="min-h-[36px] px-3 rounded-xl border border-[var(--saarthi-outline-soft)] bg-white text-xs font-extrabold text-[var(--saarthi-primary)] inline-flex items-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Swap
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.pickup')}</label>
            <div className="mt-1 relative">
              <select
                className="w-full min-h-[48px] rounded-xl border-2 border-gray-200 px-2 pr-11 bg-white"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={listening}
                onClick={() =>
                  dictateOnce({
                    onText: (txt) => {
                      const q = txt.toLowerCase().trim();
                      const hit = CITY_OPTIONS.find((c) => c.toLowerCase().includes(q) || q.includes(c.toLowerCase()));
                      if (hit) setFrom(hit);
                    },
                  })
                }
                className="absolute right-1 top-1 min-h-[40px] min-w-[40px] rounded-xl bg-[var(--saarthi-primary)] text-white flex items-center justify-center disabled:opacity-60"
                aria-label="Speak pickup location"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.drop')}</label>
            <div className="mt-1 relative">
              <select
                className="w-full min-h-[48px] rounded-xl border-2 border-gray-200 px-2 pr-11 bg-white"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {CITY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="button"
                disabled={listening}
                onClick={() =>
                  dictateOnce({
                    onText: (txt) => {
                      const q = txt.toLowerCase().trim();
                      const hit = CITY_OPTIONS.find((c) => c.toLowerCase().includes(q) || q.includes(c.toLowerCase()));
                      if (hit) setTo(hit);
                    },
                  })
                }
                className="absolute right-1 top-1 min-h-[40px] min-w-[40px] rounded-xl bg-[var(--saarthi-primary)] text-white flex items-center justify-center disabled:opacity-60"
                aria-label="Speak drop location"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-[var(--saarthi-surface-low)] p-4 space-y-1 text-sm">
        <p>
          <span className="font-bold">{tV2('v2.maps.distance')}:</span> {distanceKm} km
        </p>
        {routeMeta ? (
          <p>
            <span className="font-bold">{tV2('v2.maps.duration')}:</span> {Math.round(routeMeta.durationMin)} {tV2('v2.maps.minutes')}
          </p>
        ) : null}
        <p>
          <span className="font-bold">{tV2('v2.maps.estimate')}:</span> ₹{estimateInr}
        </p>
      </div>

      <PayoutBreakdown
        title="Fare split (pilot)"
        split={split}
        note="Shows how much the driver earns vs platform fee. Pilot assumptions only."
      />

      <div className="rounded-2xl bg-white border border-[var(--saarthi-outline-soft)] p-4">
        <p className="font-extrabold text-sm">{t('landing.v2.bentoWeather')}</p>
        <p className="text-xs text-[var(--saarthi-on-surface-variant)] mt-1">
          {t('landing.v2.bentoWeatherBody')}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-600">Moisture (%)</label>
            <input
              className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-3 bg-white"
              type="number"
              min={0}
              max={40}
              step={0.5}
              value={moisturePct}
              onChange={(e) => setMoisturePct(Number(e.target.value) || 0)}
            />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-[var(--saarthi-surface-low)] p-3">
            <p className="text-xs font-bold text-gray-700">Risk band (pilot)</p>
            <p className="text-sm font-extrabold text-[var(--saarthi-primary)] mt-1">{moisture.band.toUpperCase()}</p>
            <p className="text-[10px] text-gray-500 mt-1">{moisture.note}</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-gray-500">
          We intentionally avoid numeric deduction estimates until backed by verified mandi-grade datasets.
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-[var(--saarthi-outline-soft)] p-4">
        <p className="font-extrabold text-sm">Return truck / fertilizer backhaul</p>
        <p className="text-xs text-[var(--saarthi-on-surface-variant)] mt-1">
          If you want a return load (e.g., fertilizer), Saarthi can try to match a backhaul to reduce your net cost.
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="text-sm font-bold text-gray-700">Need return truck?</label>
          <button
            type="button"
            onClick={() => setNeedReturn((v) => !v)}
            className={`min-h-[40px] px-4 rounded-full font-extrabold text-sm transition-colors ${
              needReturn ? 'bg-[var(--saarthi-primary)] text-white' : 'bg-[var(--saarthi-surface-low)] text-[var(--saarthi-on-surface)]'
            }`}
          >
            {needReturn ? 'Yes' : 'No'}
          </button>
        </div>
        {needReturn ? (
          <div className="mt-3 grid grid-cols-2 gap-3 items-start">
            <div>
              <label className="text-xs font-bold text-gray-600">Return load (kg)</label>
              <input
                className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-3 bg-white"
                type="number"
                min={50}
                step={50}
                value={returnLoadKg}
                onChange={(e) => setReturnLoadKg(Number(e.target.value) || 50)}
              />
              <p className="mt-1 text-[10px] text-gray-500">Example: fertilizer bags.</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[var(--saarthi-surface-low)] p-3">
              <p className="text-xs font-bold text-gray-700">Estimated savings (pilot)</p>
              <p className="text-2xl font-extrabold text-[var(--saarthi-primary)] mt-1">₹{returnSavingsInr}</p>
              <p className="text-[10px] text-gray-500 mt-1">Not guaranteed—depends on match availability.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-bold text-gray-600 mb-1">{tV2('v2.maps.nearbyDrivers')}</p>
        <ul className="space-y-2">
          {nearby.map((d) => (
            <li key={d.id} className="flex justify-between rounded-xl bg-white border border-gray-100 px-3 py-2 text-sm">
              <span className="font-semibold">{d.name}</span>
              <span className="text-gray-500">
                ~{d.km} km · ★{d.rating}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <>
          <label className="text-sm font-medium">{t('pickup.selectProduce')}</label>
          <select className="w-full min-h-[48px] rounded-xl border-2 px-2 bg-white" value={produceId} onChange={(e) => setProduceId(e.target.value)}>
            {produce.map((p) => (
              <option key={p.id} value={p.id}>
                {p.crop}
              </option>
            ))}
          </select>
          <label className="text-sm font-medium">{t('produce.qty')}</label>
          <input
            type="number"
            min={1}
            className="w-full min-h-[48px] rounded-xl border-2 px-3 bg-white"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value) || 1)}
          />
        </>
      )}
      <Button type="submit" fullWidth className="min-h-[56px] rounded-2xl" disabled={submitting || !selected}>
        {submitting ? '…' : tV2('v2.maps.submitBooking')}
      </Button>
    </form>
  );
};
