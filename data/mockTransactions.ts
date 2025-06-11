export interface Transaction {
  id: string;
  amount: number;
  date: string;
  method: string;
  status: string;
}

export const mockTransactions: Transaction[] = [
  { id: 'txn_1', amount: 100, date: '2023-01-01', method: 'card', status: 'succeeded' },
  { id: 'txn_2', amount: 50, date: '2023-01-05', method: 'crypto', status: 'pending' },
  { id: 'txn_3', amount: 75, date: '2023-01-10', method: 'card', status: 'failed' },
  { id: 'txn_4', amount: 125, date: '2023-01-15', method: 'card', status: 'succeeded' },
  { id: 'txn_5', amount: 200, date: '2023-01-20', method: 'crypto', status: 'succeeded' },
];
