
import { Document, ChartData, Task } from './types';

export const MOCK_COMPANY_DATA = {
  name: "TechSolutions Adam Kowalski",
  nip: "1234567890",
  taxType: "Ryczałt 12%",
  vatPayer: true,
  currentMonthVat: 3450.50,
  currentMonthIncome: 12500.00,
  currentMonthCosts: 4200.00,
  projectedIncome: 14000.00,
  bankBalance: 45200.00
};

export const MOCK_CHART_DATA: ChartData[] = [
  { month: 'Sty', income: 10500, costs: 3800, balance: 6700 },
  { month: 'Lut', income: 11200, costs: 4100, balance: 7100 },
  { month: 'Mar', income: 10800, costs: 3900, balance: 6900 },
  { month: 'Kwi', income: 12500, costs: 4200, balance: 8300 },
  { month: 'Maj', income: 13100, costs: 4500, balance: 8600 },
  { month: 'Cze', income: 11800, costs: 4000, balance: 7800 },
];

export const MOCK_EXPENSE_BREAKDOWN = [
  { name: 'Podatki/ZUS', value: 4500, fill: '#10b981' }, // Emerald
  { name: 'Leasingi', value: 2200, fill: '#f59e0b' },   // Amber
  { name: 'Oprogramowanie', value: 800, fill: '#ef4444' }, // Rose
  { name: 'Biuro', value: 1200, fill: '#8b5cf6' },      // Violet
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'F/2024/05/01',
    contractor: 'Cloud Services Sp. z o.o.',
    type: 'Faktura',
    category: 'Koszt',
    source: 'KSeF',
    status: 'Nieopłacone',
    amountNet: 1200.00,
    amountGross: 1476.00,
    dueDate: '2024-05-25',
    date: '2024-05-11',
    sharedWith: ['Księgowa Anna'],
    aiSummary: "Faktura za usługi chmurowe AWS/Azure. Wydatek standardowy, zgodny z historią. Pamiętaj o terminie 25 maja, aby uniknąć odsetek."
  },
  {
    id: 'P/2024/003',
    contractor: 'Urząd Skarbowy',
    type: 'Pismo urzędowe',
    category: 'Urzędowe',
    source: 'e-Doręczenia',
    status: 'Oczekuje',
    amountNet: 0,
    amountGross: 0,
    dueDate: '2024-05-20',
    date: '2024-05-10',
    aiSummary: "Wezwanie do złożenia wyjaśnień w sprawie deklaracji VAT-7 za marzec. Urząd prosi o przesłanie skanów ewidencji zakupów. Masz na to 7 dni."
  },
  {
    id: 'FV/X-99',
    contractor: 'Biuro Plus',
    type: 'Faktura',
    category: 'Koszt',
    source: 'Email',
    status: 'Opłacone',
    amountNet: 150.00,
    amountGross: 184.50,
    dueDate: '2024-05-15',
    date: '2024-05-08',
    sharedWith: ['Księgowa Anna', 'Wspólnik Marek'],
    aiSummary: "Drobny zakup materiałów biurowych. Faktura została już opłacona kartą firmową. Dokument poprawny merytorycznie."
  },
  {
    id: 'F/2024/05/02',
    contractor: 'Marketing Master',
    type: 'Faktura',
    category: 'Przychód',
    source: 'KSeF',
    status: 'Opłacone',
    amountNet: 2500.00,
    amountGross: 3075.00,
    dueDate: '2024-05-14',
    date: '2024-05-05',
    aiSummary: "Twoja faktura sprzedażowa za usługi marketingowe. Klient opłacił ją terminowo. Przychód zakwalifikowany do ryczałtu 12%."
  }
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Opłać fakturę Cloud Services', completed: false },
  { id: '2', title: 'Wyślij odpowiedź na e-Doręczenie z US', completed: false },
  { id: '3', title: 'Zaktualizuj grafik na czerwiec', completed: true },
  { id: '4', title: 'Zweryfikuj limity VAT na Q2', completed: false }
];
