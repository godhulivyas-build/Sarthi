import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useI18n } from '../../../i18n/I18nContext';
import { mapsEnabled, GOOGLE_MAPS_API_KEY } from '../../../services/maps/googleMapsConfig';
import { getDistrictByName, LOCATION_NAMES } from '../../../config/mpLocations';
import { listProduce, requestPickup } from '../../../services/mvpDataService';
import type { ProduceItem, UserPreferences } from '../../../types';
import { Button } from '../../ui/Button';
import { Loader2, MapPinned, Truck, ExternalLink } from 'lucide-react';
import { BookingRouteMapInner } from '../maps/InteractiveBookingMap';
import { FallbackOsrmLeafletMap } from '../maps/FallbackOsrmLeafletMap';
import type { LatLng, DrivingRouteResult } from '../../../services/maps/routePlanning';
import { buildGoogleMapsDirUrl } from '../../../services/maps/routePlanning';

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
  const [from, setFrom] = useState(preferences?.location?.trim() || 'Indore');
  const [to, setTo] = useState('Bhopal');
  const [produce, setProduce] = useState<ProduceItem[]>([]);
  const [produceId, setProduceId] = useState('');
  const [qty, setQty] = useState(5);
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

  const selected = produce.find((p) => p.id === produceId);

  const nearby = useMemo(
    () => [
      { id: '1', name: 'Ravi Transport', km: Math.max(2, Math.round(distanceKm * 0.15)), rating: 4.6 },
      { id: '2', name: 'MP Logistics', km: Math.max(3, Math.round(distanceKm * 0.22)), rating: 4.4 },
    ],
    [distanceKm]
  );

  const navHref = buildGoogleMapsDirUrl(pickAdjust, dropAdjust);

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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.pickup')}</label>
          <select
            className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-2 bg-white"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.drop')}</label>
          <select
            className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-2 bg-white"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          >
            {CITY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
