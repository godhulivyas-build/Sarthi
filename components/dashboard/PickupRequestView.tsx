import React, { useEffect, useState } from 'react';
import { UserPreferences, ProduceItem } from '../../types';
import { listProduce, requestPickup } from '../../services/mvpDataService';
import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Loader2, Truck } from 'lucide-react';

type PickupRequestViewProps = {
  preferences: UserPreferences | null;
  onCreated?: () => void;
};

const farmerLabel = (prefs: UserPreferences | null): string => {
  if (prefs?.location?.trim()) return `किसान (${prefs.location})`;
  return 'किसान';
};

export const PickupRequestView: React.FC<PickupRequestViewProps> = ({ preferences, onCreated }) => {
  const { t, lang } = useI18n();
  const [produce, setProduce] = useState<ProduceItem[]>([]);
  const [produceId, setProduceId] = useState('');
  const [from, setFrom] = useState(preferences?.location || '');
  const [to, setTo] = useState('');
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const list = await listProduce();
      setProduce(list);
      if (list[0]) setProduceId(list[0].id);
      setLoading(false);
    };
    run();
  }, []);

  useEffect(() => {
    if (preferences?.location) setFrom(preferences.location);
  }, [preferences?.location]);

  const selected = produce.find((p) => p.id === produceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const q = Number(qty);
    if (!Number.isFinite(q) || q <= 0 || q > selected.quantity) return;
    setSubmitting(true);
    await requestPickup({
      produceId: selected.id,
      farmerName: farmerLabel(preferences),
      pickupLocation: from.trim() || '—',
      dropLocation: to.trim() || '—',
      quantity: q,
      unit: selected.unit,
    });
    setSubmitting(false);
    setDone(true);
    onCreated?.();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6 text-center pb-24">
        <Truck className="w-14 h-14 text-green-600 mx-auto mb-4" aria-hidden />
        <p className="text-lg font-bold text-gray-900">OK ✓</p>
        <p className="text-gray-600 mt-2">
          {lang === 'hi' ? 'पिकअप की मांग भेज दी गई।' : 'Pickup request sent.'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="text-green-600" aria-hidden />
        {t('pickup.title')}
      </h2>
      {!selected ? (
        <p className="text-gray-500">{t('produce.empty')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('pickup.selectProduce')}</label>
            <select
              value={produceId}
              onChange={(e) => setProduceId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            >
              {produce.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.crop} — {p.quantity} {p.unit}
                </option>
              ))}
            </select>
          </div>
          <Input label={t('pickup.from')} value={from} onChange={(e) => setFrom(e.target.value)} required />
          <Input label={t('pickup.to')} value={to} onChange={(e) => setTo(e.target.value)} required />
          <Input
            label={t('produce.qty')}
            type="number"
            min={1}
            max={selected.quantity}
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? <Loader2 className="animate-spin mx-auto" /> : t('pickup.submit')}
          </Button>
        </form>
      )}
    </div>
  );
};
