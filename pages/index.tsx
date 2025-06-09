import useSWR from 'swr';
import Layout from '../components/Layout';
import DashboardCard from '../components/DashboardCard';
import TransactionTable from '../components/TransactionTable';
import { Transaction } from '../data/mockTransactions';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  const { data } = useSWR<{ transactions: Transaction[] }>('/api/transactions', fetcher);
  const transactions = data?.transactions || [];

  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DashboardCard title="Total Sales" value={`$${totalSales}`} />
        <DashboardCard title="Transactions" value={transactions.length} />
      </div>
      <TransactionTable transactions={transactions} />
    </Layout>
  );
}
