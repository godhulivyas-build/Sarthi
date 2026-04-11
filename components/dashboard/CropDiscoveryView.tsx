import React, { useEffect, useState } from 'react';
import { UserPreferences, ProduceItem } from '../../types';
import { listProduce, placeOrder } from '../../services/mvpDataService';
import { useI18n } from '../../i18n/I18nContext';
import { Search, MapPin, Loader2, IndianRupee } from 'lucide-react';
import { Button } from '../ui/Button';

interface CropDiscoveryViewProps {
  preferences: UserPreferences | null;
}

const CROP_OPTIONS = ['Soybean', 'Wheat', 'Onion', 'Gram', 'Garlic', 'Tomato'];

const QTY_PRESETS = [1, 5, 10, 25];

export const CropDiscoveryView: React.FC<CropDiscoveryViewProps> = ({ preferences }) => {
  const { t } = useI18n();
  const [items, setItems] = useState<ProduceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('');
  const [orderFor, setOrderFor] = useState<ProduceItem | null>(null);
  const [qty, setQty] = useState(1);
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

  const filtered = items.filter((p) => {
    if (!cropFilter) return true;
    return p.crop.toLowerCase() === cropFilter.toLowerCase();
  });

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFor || qty <= 0 || qty > orderFor.quantity) return;
    setSubmitting(true);
    await placeOrder({
      produceId: orderFor.id,
      buyerName: preferences?.location?.trim() || t('dashboard.buyer'),
      buyerLocation: preferences?.location?.trim() || '—',
      quantity: qty,
    });
    setSubmitting(false);
    setOrderFor(null);
    setQty(1);
    await load();
  };

  const uniqueLocations = [...new Set(items.map((i) => i.farmerLocation))];

  return (
    <div className="p-4 space-y-4 pb-28">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        <Search className="text-purple-600" aria-hidden />
        {t('action.browseProduce')}
      </h2>

      {/* Filter by crop — dropdown */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-1 block">{t('buyer.filterCrop')}</label>
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="w-full min-h-[48px] border border-gray-300 rounded-xl px-3 py-2 text-base bg-white"
        >
          <option value="">{t('buyer.filterCrop')}…</option>
          {CROP_OPTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
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
                    <p className="text-[10px] text-gray-500">/{item.unit}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {item.quantity} {item.unit}
                </p>
                <button
                  type="button"
                  onClick={() => { setOrderFor(item); setQty(1); }}
                  className="mt-3 w-full min-h-[48px] rounded-xl bg-purple-600 text-white font-bold text-base"
                >
                  {t('buyer.order')}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Order modal — quantity preset buttons */}
      {orderFor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={submitOrder}
            className="bg-white w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4"
          >
            <p className="font-bold text-lg">{orderFor.crop}</p>
            <label className="block text-sm font-medium text-gray-700">{t('produce.qty')}</label>
            <div className="flex flex-wrap gap-2">
              {QTY_PRESETS.filter((q) => q <= orderFor.quantity).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQty(q)}
                  className={`min-h-[44px] min-w-[56px] rounded-xl border-2 font-bold text-base ${
                    qty === q ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">{orderFor.unit} (max {orderFor.quantity})</p>
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
