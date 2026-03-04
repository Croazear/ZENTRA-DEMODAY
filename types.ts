
export type ViewType = 'dashboard' | 'documents' | 'ai-assistant' | 'calendar' | 'start-company' | 'settings' | 'finances';

export interface Document {
  id: string;
  contractor: string;
  type: 'Faktura' | 'Rachunek' | 'Pismo urzędowe';
  category: 'Przychód' | 'Koszt' | 'Urzędowe';
  source: 'KSeF' | 'e-Doręczenia' | 'Email';
  status: 'Opłacone' | 'Nieopłacone' | 'Oczekuje';
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
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  action?: {
    label: string;
    type: 'download' | 'link';
  };
}
