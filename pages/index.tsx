import Link from 'next/link';


export default function HomePage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Merchant Services App</h1>
      <Link href="/sign-in">Sign In</Link>
    </div>
  );
}
