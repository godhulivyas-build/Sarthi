import type { Lang } from '../i18n/translations';
import type {
  BuyerDashboardView,
  FarmerDashboardView,
  TransporterDashboardView,
} from '../types';

type VoiceRow = Partial<Record<Lang, string>>;

export const landingVoice: VoiceRow = {
  hi: 'Farm se Market tak – Seedha aur Sasta। अपनी भूमिका चुनिए: किसान, ट्रांसपोर्टर, या खरीदार।',
  en: 'Farm to market — direct and affordable. Choose your role: farmer, transporter, or buyer.',
  kn: 'Farm to market — direct. Role ಆಯ್ಕೆ ಮಾಡಿ: farmer, transporter, buyer.',
  te: 'Farm to market — direct. మీ పాత్ర ఎంచుకోండి: farmer, transporter, buyer.',
};

export const voiceContent: {
  farmer: Record<FarmerDashboardView, VoiceRow>;
  transporter: Record<TransporterDashboardView, VoiceRow>;
  buyer: Record<BuyerDashboardView, VoiceRow>;
} = {
  farmer: {
    home: {
      hi: 'किसान होम। दो काम: गाड़ी बुक करें या मेरी रिक्वेस्ट देखें। बोलें: गाड़ी बुक करो।',
      en: 'Farmer home. Two actions: book vehicle or view my requests.',
      kn: 'Farmer home. Book vehicle ಅಥವಾ requests ನೋಡಿ.',
      te: 'Farmer home. Book vehicle లేదా requests చూడండి.',
    },
    book_vehicle: {
      hi: 'गाड़ी बुक स्क्रीन। फसल और मात्रा चुनकर पिकअप रिक्वेस्ट भेजें।',
      en: 'Book vehicle screen. Choose crop and quantity, then submit request.',
      kn: 'Book vehicle. Crop ಮತ್ತು quantity ಆಯ್ಕೆ ಮಾಡಿ.',
      te: 'Book vehicle. Crop మరియు quantity ఎంచుకోండి.',
    },
    my_requests: {
      hi: 'मेरी रिक्वेस्ट स्क्रीन। यहाँ आपकी सभी रिक्वेस्ट और स्टेटस दिखेगा।',
      en: 'My requests. You can see request status here.',
      kn: 'My requests. Status ನೋಡಿ.',
      te: 'My requests. Status చూడండి.',
    },
  },
  transporter: {
    home: {
      hi: 'ड्राइवर होम। काम देखने के लिए बोलें: काम दिखाओ।',
      en: 'Driver home. Say: show jobs.',
      kn: 'Driver home. Jobs ನೋಡಿ.',
      te: 'Driver home. Jobs చూడండి.',
    },
    jobs: {
      hi: 'काम स्क्रीन। कोई काम चुनें और स्वीकार करें।',
      en: 'Jobs screen. Pick a job and accept.',
      kn: 'Jobs. Job ಆಯ್ಕೆ ಮಾಡಿ accept ಮಾಡಿ.',
      te: 'Jobs. Job ఎంచుకుని accept చేయండి.',
    },
    my_trips: {
      hi: 'मेरी ट्रिप स्क्रीन। यहाँ आपके स्वीकार किए काम दिखेंगे।',
      en: 'My trips. Your accepted jobs show here.',
      kn: 'My trips. Accepted jobs.',
      te: 'My trips. Accepted jobs.',
    },
  },
  buyer: {
    home: {
      hi: 'खरीदार होम। फसल देखने के लिए बोलें: फसल दिखाओ। या बोलें: मेरा ऑर्डर दिखाओ।',
      en: 'Buyer home. Say: browse produce or show orders.',
      kn: 'Buyer home. Produce browse ಅಥವಾ orders ನೋಡಿ.',
      te: 'Buyer home. Produce browse లేదా orders చూడండి.',
    },
    browse: {
      hi: 'ब्राउज़ स्क्रीन। यहाँ उपलब्ध फसल देखें और ऑर्डर करें।',
      en: 'Browse screen. See produce and place an order.',
      kn: 'Browse. Produce ನೋಡಿ.',
      te: 'Browse. Produce చూడండి.',
    },
    orders: {
      hi: 'ऑर्डर स्क्रीन। यहाँ आपके ऑर्डर दिखेंगे।',
      en: 'Orders screen. Your orders are here.',
      kn: 'Orders. ನಿಮ್ಮ orders ಇಲ್ಲಿ.',
      te: 'Orders. మీ orders ఇక్కడ.',
    },
  },
};

