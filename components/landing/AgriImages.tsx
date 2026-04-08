import React from 'react';

type CardProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4">
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
};

const SvgWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-full aspect-[16/9] rounded-xl bg-gradient-to-br from-green-50 to-amber-50 border border-gray-100 flex items-center justify-center">{children}</div>;
};

export const AgriImages: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card title="Farmer" subtitle="Crop & price decisions">
        <SvgWrap>
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="10" y="70" width="200" height="30" rx="10" fill="#DCFCE7" />
            <path d="M60 85c10-22 30-32 50-32s40 10 50 32" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="44" r="14" fill="#F59E0B" />
            <path d="M30 80c10-18 22-28 35-28" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
            <path d="M190 80c-10-18-22-28-35-28" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </SvgWrap>
      </Card>

      <Card title="Transport" subtitle="Pickup → delivery updates">
        <SvgWrap>
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="30" y="52" width="110" height="40" rx="10" fill="#DBEAFE" />
            <rect x="140" y="62" width="50" height="30" rx="8" fill="#93C5FD" />
            <circle cx="70" cy="95" r="10" fill="#111827" />
            <circle cx="160" cy="95" r="10" fill="#111827" />
            <path d="M24 47h60" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" />
            <path d="M120 47h76" stroke="#2563EB" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 10" />
          </svg>
        </SvgWrap>
      </Card>

      <Card title="Market" subtitle="Buyer connections & mandi">
        <SvgWrap>
          <svg width="220" height="120" viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M40 54l70-30 70 30" stroke="#7C3AED" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="55" y="54" width="110" height="48" rx="10" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M78 102V70" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
            <path d="M110 102V70" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
            <path d="M142 102V70" stroke="#8B5CF6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="46" r="7" fill="#F59E0B" />
          </svg>
        </SvgWrap>
      </Card>
    </div>
  );
};

