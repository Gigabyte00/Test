interface DashboardCardProps {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-sm text-gray-500">{title}</h2>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
