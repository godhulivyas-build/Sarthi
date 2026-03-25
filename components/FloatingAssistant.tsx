import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SupportView } from './dashboard/SupportView';
import { useI18n } from '../i18n/I18nContext';

export const FloatingAssistant: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-[60] min-h-[56px] min-w-[56px] rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center md:bottom-8 active:scale-95"
        aria-label={t('support.title')}
      >
        <MessageCircle className="w-7 h-7" aria-hidden />
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/40" role="dialog" aria-modal="true">
          <div className="flex-1" onClick={() => setOpen(false)} aria-hidden />
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-bold text-gray-900">{t('support.title')}</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden min-h-[50vh]">
              <SupportView embedded />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
