import React from 'react';
import { useVoiceAssistant } from '../voice/VoiceAssistantProvider';
import { useI18n } from '../i18n/I18nContext';

export const SaathiDidi: React.FC = () => {
  const { toggle, speaking, listening } = useVoiceAssistant();
  const { lang } = useI18n();

  return (
    <div className="fixed bottom-24 left-4 z-[75] max-w-[260px]">
      <button
        type="button"
        onClick={toggle}
        className={`w-full flex items-center gap-3 bg-white border-2 rounded-2xl p-3 shadow-lg active:scale-[0.99] ${
          speaking || listening ? 'border-red-300' : 'border-green-200'
        }`}
        aria-label="Saathi Didi"
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
            SD
          </div>
          <span className="absolute -inset-1 rounded-full border-2 border-green-300 animate-pulse" aria-hidden />
        </div>
        <div className="text-left">
          <p className="font-bold text-gray-900">Saathi Didi</p>
          <p className="text-xs text-gray-600 leading-snug">
            {lang === 'en'
              ? 'Tap me. I will explain and listen.'
              : 'Agar samajh nahi aa raha, toh mujhe dabaiye. Main madad karti hoon.'}
          </p>
        </div>
      </button>
    </div>
  );
};

