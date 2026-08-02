// ─── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  price: number;
  originalPrice: number;
  discount: number;
  isNew: boolean;
  isPromo: boolean;
  isEndOfSeries: boolean;
  isActive: boolean;
  reference: string;
  barcode: string;
  stockByStore: Record<string, number>;
  tags: string[];
  weight?: string;
  dimensions?: string;
}

// ─── Category ───────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  icon: string;
  productCount: number;
  color: string;
}

// ─── Brand ──────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  productCount: number;
  description: string;
  categories: string[];
  isPartner: boolean;
  discount?: number;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export interface StoreHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  image: string;
  coordinates: { lat: number; lng: number };
  hours: StoreHours[];
  services: string[];
  hasParking: boolean;
  paymentMethods: string[];
  clickAndCollectDelay: number;
  distance?: number;
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Reservation ────────────────────────────────────────────────────────────

export type ReservationStatus =
  | "nouvelle"
  | "en_preparation"
  | "prete"
  | "retiree"
  | "annulee";

export interface ReservationItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface ReservationMessage {
  text: string;
  sentAt: string;
}

export interface Reservation {
  id: string;
  orderNumber: string;
  status: ReservationStatus;
  items: ReservationItem[];
  store: Store;
  pickupSlot: PickupSlot;
  total: number;
  discount: number;
  promoCode?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  customerEmail?: string;
  customerName?: string;
  messages?: ReservationMessage[];
}

// ─── Pickup ──────────────────────────────────────────────────────────────────

export interface PickupSlot {
  date: string;
  startTime: string;
  endTime: string;
}

// ─── User ───────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  favoriteStoreId?: string;
  createdAt: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminStats {
  pendingOrders: number;
  readyOrders: number;
  totalProducts: number;
  totalCustomers: number;
  revenue: number;
  revenueGrowth: number;
  weeklyRevenue: { day: string; amount: number }[];
  statusDistribution: { status: string; count: number; color: string }[];
}

// ─── Promo ───────────────────────────────────────────────────────────────────

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  discount: number;
  type: "flash" | "percent" | "end_of_series";
  endDate: string;
  image: string;
  productIds: string[];
  isActive: boolean;
}

// ─── Form types ──────────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface ProductForm {
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  originalPrice: number;
  reference: string;
  isNew: boolean;
  isPromo: boolean;
  isEndOfSeries: boolean;
  isActive: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isPromo?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "discount";
}
