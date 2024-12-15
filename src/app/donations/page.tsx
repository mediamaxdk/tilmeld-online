import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function DonationsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Donation Platform</h1>
        <div className="prose max-w-none">
          <p className="text-xl mb-6">
            Create and manage donation campaigns for various causes:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Charitable organizations</li>
            <li>Community projects</li>
            <li>Emergency relief</li>
            <li>Educational initiatives</li>
            <li>Environmental causes</li>
          </ul>
          <p className="mb-6">
            Set up donation pages quickly, track contributions, and keep supporters 
            updated on the impact of their generosity. Payment processing coming soon!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 