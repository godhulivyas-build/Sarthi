export enum UserRole {
  FARMER = 'Farmer (Kisan)',
  FPO = 'FPO / Admin',
  BUYER = 'Buyer (Vyapari)',
  TRANSPORTER = 'Transporter'
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  PREFERENCES = 'PREFERENCES',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardView {
  HOME = 'HOME',
  BOOK_TRANSPORT = 'BOOK_TRANSPORT',
  TRACK_SHIPMENT = 'TRACK_SHIPMENT',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  WALLET = 'WALLET',
  MARKET_RATES = 'MARKET_RATES',
  CROP_DISCOVERY = 'CROP_DISCOVERY'
}

export interface UserPreferences {
  location: string;
  primaryCrop: string;
  loadSize: string;
  urgency: string;
}

export interface TransportOption {
  id: string;
  provider: string;
  vehicleType: string;
  price: number;
  eta: string;
  rating: number;
}

export interface Shipment {
  id: string;
  source: string;
  destination: string;
  crop: string;
  weight: string;
  status: 'Booked' | 'Picked Up' | 'In Transit' | 'Delivered';
  date: string;
  cost: number;
  eta: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface WalletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: 'payment' | 'refund' | 'incentive' | 'payout';
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletState {
  balance: number;
  transactions: WalletTransaction[];
}

export interface MarketRate {
  id: string;
  crop: string;
  mandi: string;
  price: number; // Current market price per quintal
  msp: number;   // Minimum Support Price
  trend: 'up' | 'down' | 'stable';
  change: number; // Percentage change
}

export interface CropDiscoveryListing {
  id: string;
  crop: string;
  mandi: string;
  state: string;
  pricePerQuintal: number;
  quantityAvailable: number; // in Tons
  distanceKm: number;
  etaHours: number;
  logisticsCostEst: number;
  tags: ('Cheapest' | 'Fastest' | 'Best Value')[];
}

export interface DashboardProps {
  userRole: UserRole;
  userPreferences: UserPreferences | null;
  wallet: WalletState;
  onLogout: () => void;
  onSwitchPersona: (role: UserRole) => void;
  onEditPreferences: () => void;
}

export interface PreferenceScreenProps {
  userRole: UserRole;
  initialPreferences?: UserPreferences | null;
  onComplete: (prefs: UserPreferences) => void;
  onSwitchPersona: (role: UserRole) => void;
  onSkip: () => void;
}