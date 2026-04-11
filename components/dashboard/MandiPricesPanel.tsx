import React, { useEffect, useState } from 'react';
import { getMandiPrices, type MandiPrice } from '../../services/mandiPriceService.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';
import { TrendingUp } from 'lucide-react';

type Props = { compact?: boolean };

export const MandiPricesPanel: React.FC<Props> = ({ compact = false }) => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const { lang } = useI18n();
  const isHi = lang === 'hi';

  useEffect(() => {
    getMandiPrices().then(setPrices);
  }, []);

  if (prices.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
        <div className="h-24" />
      </div>
    );
  }

  const displayPrices = compact ? prices.slice(0, 5) : prices;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 text-white flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        <h3 className="font-bold">{isHi ? '📊 आज के मंडी भाव' : '📊 Today\'s Mandi Prices'}</h3>
      </div>

      <div className="divide-y divide-gray-50">
        {displayPrices.map((p, i) => (
          <div
            key={i}
            className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="font-bold text-gray-900">{isHi ? p.cropHi : p.crop}</p>
              <p className="text-xs text-gray-500">{p.mandi}</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-green-700 text-lg">₹{p.modalPrice}</p>
              <p className="text-[10px] text-gray-400">
                {isHi ? 'रेंज' : 'Range'}: ₹{p.minPrice} – ₹{p.maxPrice}
              </p>
            </div>
          </div>
        ))}
      </div>

      {compact && prices.length > 5 && (
        <div className="px-4 py-2 bg-gray-50 text-center">
          <span className="text-sm text-green-700 font-bold">
            {isHi ? `+ ${prices.length - 5} और भाव देखें →` : `+ ${prices.length - 5} more prices →`}
          </span>
        </div>
      )}
    </div>
  );
};
