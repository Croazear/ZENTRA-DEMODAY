export type ViewType =
  | "dashboard"
  | "documents"
  | "ai-assistant"
  | "calendar"
  | "start-company"
  | "settings"
  | "finances"
  | "warehouse";

export interface Document {
  id: string;
  contractor: string;
  type: "Faktura" | "Rachunek" | "Pismo urzędowe";
  category: "Przychód" | "Koszt" | "Urzędowe";
  source: "KSeF" | "e-Doręczenia" | "Email";
  status: "Opłacone" | "Nieopłacone" | "Oczekuje";
  amountNet: number;
  amountGross: number;
  dueDate: string;
  date: string;
  sharedWith?: string[];
  aiSummary?: string;
}

export interface ChartData {
  month: string;
  income: number;
  costs: number;
  balance?: number;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
  action?: {
    label: string;
    type: "download" | "link";
  };
}

// Backend entity types (matching NestJS backend)
export interface Invoice {
  id: number;
  contractor: string;
  type: string;
  category: string;
  source: string;
  status: string;
  amountNet: number;
  amountGross: number;
  dueDate: string;
  date: string;
  aiSummary?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  type: string;
  time: string;
  priority: string;
  description?: string;
  status?: string;
  day: number;
  month: number;
  year: number;
}

export interface Company {
  id: number;
  name: string;
  nip: string;
  taxType: string;
  vatPayer: boolean;
  currentMonthVat: number;
  currentMonthIncome: number;
  currentMonthCosts: number;
  projectedIncome: number;
  bankBalance: number;
}

export interface BackendTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Contractor {
  id: number;
  name: string;
  nip?: string;
  email?: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
  usedCapacity: number;
  manager: string;
  status: "Aktywny" | "Nieaktywny" | "Konserwacja";
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  priceNet: number;
  warehouseId: number;
  warehouseName: string;
  lastRestocked: string;
}

export interface StockMovement {
  id: number;
  productName: string;
  sku: string;
  type: "Przyjęcie" | "Wydanie" | "Przesunięcie" | "Zwrot" | "Inwentaryzacja";
  quantity: number;
  warehouseFrom?: string;
  warehouseTo?: string;
  date: string;
  operator: string;
  note?: string;
}
