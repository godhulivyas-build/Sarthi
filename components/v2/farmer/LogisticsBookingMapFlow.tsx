import React, { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useI18n } from '../../../i18n/I18nContext';
import { mapsEnabled, GOOGLE_MAPS_API_KEY } from '../../../services/maps/googleMapsConfig';
import { getDistrictByName } from '../../../config/mpLocations';
import { listProduce, requestPickup } from '../../../services/mvpDataService';
import type { ProduceItem, UserPreferences } from '../../../types';
import { Button } from '../../ui/Button';
import { Loader2, Truck } from 'lucide-react';

const CITIES = ['Indore', 'Bhopal', 'Ujjain', 'Dewas', 'Jabalpur'];

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
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

  useEffect(() => {
    listProduce().then((list) => {
      setProduce(list);
      if (list[0]) setProduceId(list[0].id);
      setLoading(false);
    });
  }, []);

  const pickupLL = useMemo(() => {
    const d = getDistrictByName(from);
    return d ? { lat: d.lat, lng: d.lng } : { lat: 22.72, lng: 75.86 };
  }, [from]);
  const dropLL = useMemo(() => {
    const d = getDistrictByName(to);
    return d ? { lat: d.lat, lng: d.lng } : { lat: 23.26, lng: 77.4 };
  }, [to]);

  const distanceKm = useMemo(() => Math.round(haversineKm(pickupLL, dropLL) * 10) / 10, [pickupLL, dropLL]);
  const estimateInr = Math.max(800, Math.round(distanceKm * 42 * (1 + qty / 100)));

  const selected = produce.find((p) => p.id === produceId);

  const nearby = useMemo(
    () => [
      { id: '1', name: 'Ravi Transport', km: Math.max(2, Math.round(distanceKm * 0.15)), rating: 4.6 },
      { id: '2', name: 'MP Logistics', km: Math.max(3, Math.round(distanceKm * 0.22)), rating: 4.4 },
    ],
    [distanceKm]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    await requestPickup({
      produceId: selected.id,
      farmerName: preferences?.location?.trim() || 'Farmer',
      pickupLocation: from,
      dropLocation: to,
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

  const mapBlock = mapsEnabled() ? (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="rounded-2xl overflow-hidden border-2 border-[var(--saarthi-surface-high)] h-[220px]">
        <Map defaultCenter={{ lat: pickupLL.lat, lng: pickupLL.lng }} defaultZoom={7} gestureHandling="greedy" disableDefaultUI />
      </div>
    </APIProvider>
  ) : (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">{tV2('v2.maps.missingKey')}</div>
  );

  return (
    <form onSubmit={submit} className="p-4 space-y-4 pb-28">
      <h2 className="text-xl font-bold flex items-center gap-2 saarthi-headline">
        <Truck className="text-[var(--saarthi-primary)]" />
        {t('pickup.title')}
      </h2>
      {mapBlock}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.pickup')}</label>
          <select className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-2 bg-white" value={from} onChange={(e) => setFrom(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">{tV2('v2.maps.drop')}</label>
          <select className="w-full mt-1 min-h-[48px] rounded-xl border-2 border-gray-200 px-2 bg-white" value={to} onChange={(e) => setTo(e.target.value)}>
            {CITIES.map((c) => (
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
          <input type="number" min={1} className="w-full min-h-[48px] rounded-xl border-2 px-3 bg-white" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} />
        </>
      )}
      <Button type="submit" fullWidth className="min-h-[56px] rounded-2xl" disabled={submitting || !selected}>
        {submitting ? '…' : tV2('v2.maps.submitBooking')}
      </Button>
    </form>
  );
};
