import React from 'react';
import { MessageCircle } from 'lucide-react';

type WhatsAppFloatProps = {
  phoneE164?: string;
  message?: string;
};

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({
  phoneE164 = '919876543210',
  message = 'Namaste! Saarthi par madad chahiye.',
}) => {
  const href = `https://wa.me/${phoneE164}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-44 right-4 z-[78] min-h-[56px] min-w-[56px] rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center border-2 border-white active:scale-95"
      aria-label="WhatsApp"
      title="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" aria-hidden />
    </a>
  );
};

