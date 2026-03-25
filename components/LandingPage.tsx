import React from 'react';
import { UserRole } from '../types';
import { useI18n } from '../i18n/I18nContext';
import { ScreenChrome } from './layout/ScreenChrome';
import { Tractor, Users, ShoppingBag, Truck } from 'lucide-react';
import type { TranslationKey } from '../i18n/translations';

type LandingPageProps = {
  onContinueAs: (role: UserRole) => void;
};

const roles: {
  role: UserRole;
  icon: typeof Tractor;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  color: string;
}[] = [
  { role: UserRole.FARMER, icon: Tractor, titleKey: 'landing.roleFarmer', descKey: 'landing.roleFarmerDesc', color: 'bg-green-100 text-green-800 border-green-200' },
  { role: UserRole.BUYER, icon: ShoppingBag, titleKey: 'landing.roleBuyer', descKey: 'landing.roleBuyerDesc', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { role: UserRole.TRANSPORTER, icon: Truck, titleKey: 'landing.roleTransporter', descKey: 'landing.roleTransporterDesc', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { role: UserRole.FPO, icon: Users, titleKey: 'landing.roleFpo', descKey: 'landing.roleFpoDesc', color: 'bg-blue-100 text-blue-800 border-blue-200' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onContinueAs }) => {
  const { t } = useI18n();

  return (
    <ScreenChrome title={t('app.name')}>
      <div className="p-4 pb-28 max-w-lg mx-auto w-full space-y-8">
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-green-600 shadow-lg mb-4">
            <Truck className="w-10 h-10 text-white" aria-hidden />
          </div>
          <p className="text-green-800 font-semibold text-lg leading-snug">{t('landing.tagline')}</p>
        </div>

        <section className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t('landing.whatTitle')}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{t('landing.whatBody')}</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-4 text-center">{t('landing.forWhom')}</h2>
          <div className="space-y-3">
            {roles.map(({ role, icon: Icon, titleKey, descKey, color }) => (
              <button
                key={role}
                type="button"
                onClick={() => onContinueAs(role)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 bg-white text-left shadow-sm active:scale-[0.99] transition-transform min-h-[56px] ${color}`}
              >
                <div className={`p-3 rounded-xl bg-white/80 border border-current/20`}>
                  <Icon className="w-7 h-7" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-lg text-gray-900">{t(titleKey)}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{t(descKey)}</p>
                  <p className="text-xs font-semibold text-green-700 mt-2">{t('landing.continueAs')} {t(titleKey)} →</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </ScreenChrome>
  );
};
