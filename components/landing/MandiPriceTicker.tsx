import React, { useEffect, useState } from 'react';
import { getMandiPrices, type MandiPrice } from '../../services/mandiPriceService.ts';
import { useI18n } from '../../i18n/I18nContext.tsx';

const MandiPriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const { lang } = useI18n();
  const isHi = lang === 'hi';

  useEffect(() => {
    getMandiPrices().then(setPrices);
  }, []);

  if (prices.length === 0) return null;

  const items = [...prices, ...prices];

  return (
    <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white py-2.5 overflow-hidden">
      <div className="flex items-center">
        <span className="pl-4 pr-3 font-semibold text-sm whitespace-nowrap border-r border-green-500 mr-3">
          {isHi ? '📊 मंडी भाव' : '📊 Mandi Prices'}
        </span>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll flex whitespace-nowrap">
            {items.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 text-sm">
                <span className="font-medium">{isHi ? p.cropHi : p.crop}</span>
                <span className="text-green-200">({p.mandi})</span>
                <span className="font-bold text-yellow-200">₹{p.modalPrice}</span>
                <span className="text-green-300 text-xs">{p.unit}</span>
                <span className="text-green-400 mx-1">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiPriceTicker;
