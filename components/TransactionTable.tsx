import { Transaction } from '../data/mockTransactions';

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  return (
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="p-2 text-left">ID</th>
          <th className="p-2 text-left">Amount</th>
          <th className="p-2 text-left">Date</th>
          <th className="p-2 text-left">Method</th>
          <th className="p-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id} className="border-t">
            <td className="p-2">{tx.id}</td>
            <td className="p-2">${'{'}tx.amount{'}'}</td>
            <td className="p-2">{tx.date}</td>
            <td className="p-2">{tx.method}</td>
            <td className="p-2">{tx.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
