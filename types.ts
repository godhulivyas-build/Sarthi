export enum UserRole {
  FARMER = 'Farmer (Kisan)',
  FPO = 'FPO / Admin',
  BUYER = 'Buyer (Vyapari)',
  TRANSPORTER = 'Transporter'
}

export enum AppScreen {
  LANDING = 'LANDING',
  PREFERENCES = 'PREFERENCES',
  DASHBOARD = 'DASHBOARD'
}

export enum DashboardView {
  HOME = 'HOME',
  BOOK_TRANSPORT = 'BOOK_TRANSPORT',
  TRACK_SHIPMENT = 'TRACK_SHIPMENT',
  SUPPORT = 'SUPPORT',
  PROFILE = 'PROFILE',
  AWARENESS = 'AWARENESS',
  MARKET_RATES = 'MARKET_RATES',
  CROP_DISCOVERY = 'CROP_DISCOVERY',
  PRODUCE_MANAGE = 'PRODUCE_MANAGE',
  FARMER_ORDERS = 'FARMER_ORDERS',
  PICKUP_REQUEST = 'PICKUP_REQUEST',
  FPO_NEARBY = 'FPO_NEARBY',
  LOGISTICS_JOBS = 'LOGISTICS_JOBS',
  BUYER_ORDERS = 'BUYER_ORDERS'
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
  onBack: () => void;
}

export type ProductUnit = 'kg' | 'quintal' | 'ton';

export type PickupStatus = 'requested' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'in_transit' | 'delivered' | 'cancelled';
export type LogisticsJobStatus = 'open' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered';

export interface ProduceItem {
  id: string;
  farmerName: string;
  farmerLocation: string;
  crop: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  createdAt: string;
}

export interface PickupRequest {
  id: string;
  produceId: string;
  farmerName: string;
  pickupLocation: string;
  dropLocation: string;
  quantity: number;
  unit: ProductUnit;
  status: PickupStatus;
  requestedAt: string;
  transporterId?: string;
  transporterName?: string;
}

export interface Order {
  id: string;
  produceId: string;
  crop: string;
  buyerName: string;
  buyerLocation: string;
  farmerName: string;
  quantity: number;
  unit: ProductUnit;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface LogisticsJob {
  id: string;
  pickupRequestId: string;
  produceId: string;
  crop: string;
  quantity: number;
  unit: ProductUnit;
  pickupLocation: string;
  dropLocation: string;
  farmerName: string;
  status: LogisticsJobStatus;
  acceptedByTransporterId?: string;
  acceptedByTransporterName?: string;
  updatedAt: string;
}