import React, { useEffect, useState } from 'react';
import { UserPreferences, ProduceItem } from '../../types';
import { listProduce, placeOrder } from '../../services/mvpDataService';
import { useI18n } from '../../i18n/I18nContext';
import { Search, MapPin, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '../ui/Button';

interface CropDiscoveryViewProps {
  preferences: UserPreferences | null;
}

export const CropDiscoveryView: React.FC<CropDiscoveryViewProps> = ({ preferences }) => {
  const { t, lang } = useI18n();
  const [items, setItems] = useState<ProduceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [locFilter, setLocFilter] = useState(preferences?.location || '');
  const [cropFilter, setCropFilter] = useState('');
  const [orderFor, setOrderFor] = useState<ProduceItem | null>(null);
  const [qty, setQty] = useState('1');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await listProduce();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (preferences?.location) setLocFilter(preferences.location);
  }, [preferences?.location]);

  const filtered = items.filter((p) => {
    const locOk = !locFilter.trim() || p.farmerLocation.toLowerCase().includes(locFilter.trim().toLowerCase());
    const cropOk = !cropFilter.trim() || p.crop.toLowerCase().includes(cropFilter.trim().toLowerCase());
    return locOk && cropOk;
  });

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFor) return;
    const q = Number(qty);
    if (!Number.isFinite(q) || q <= 0 || q > orderFor.quantity) return;
    setSubmitting(true);
    await placeOrder({
      produceId: orderFor.id,
      buyerName: preferences?.location?.trim() || (lang === 'hi' ? 'खरीदार' : 'Buyer'),
      buyerLocation: preferences?.location?.trim() || '—',
      quantity: q,
    });
    setSubmitting(false);
    setOrderFor(null);
    setQty('1');
    await load();
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Search className="text-purple-600" aria-hidden />
        {t('action.browseProduce')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">{t('buyer.filterLocation')}</label>
          <input
            value={locFilter}
            onChange={(e) => setLocFilter(e.target.value)}
            className="w-full min-h-[48px] border border-gray-300 rounded-xl px-3 py-2 text-base"
            placeholder={t('onboard.locationPh')}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-1 block">{t('buyer.filterCrop')}</label>
          <input
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="w-full min-h-[48px] border border-gray-300 rounded-xl px-3 py-2 text-base"
            placeholder="Onion / Tomato"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-10 bg-gray-50 rounded-xl border border-dashed">{t('produce.empty')}</p>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.crop}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {item.farmerLocation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold flex items-center justify-end gap-0.5">
                      <IndianRupee className="w-5 h-5 text-gray-400" />
                      {item.pricePerUnit}
                    </p>
                    <p className="text-[10px] text-gray-500">per {item.unit}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {lang === 'hi' ? 'उपलब्ध' : 'Available'}: {item.quantity} {item.unit}
                </p>
                <button
                  type="button"
                  onClick={() => setOrderFor(item)}
                  className="mt-3 w-full min-h-[48px] rounded-xl bg-purple-600 text-white font-bold text-base"
                >
                  {t('buyer.order')}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {orderFor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submitOrder}
            className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4"
          >
            <p className="font-bold text-lg">{orderFor.crop}</p>
            <label className="block text-sm font-medium text-gray-700">{t('produce.qty')}</label>
            <input
              type="number"
              min={1}
              max={orderFor.quantity}
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full min-h-[48px] border rounded-xl px-3 text-lg"
              required
            />
            <div className="flex gap-2">
              <Button type="button" fullWidth variant="outline" onClick={() => setOrderFor(null)}>
                {t('back')}
              </Button>
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? '…' : t('buyer.order')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
