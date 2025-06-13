import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <h1 className="text-lg font-bold">Merchant Dashboard</h1>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
