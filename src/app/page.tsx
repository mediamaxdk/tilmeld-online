import Hero from '@/app/components/Hero';
import PublicEvents from '@/app/components/PublicEvents';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import CardSection from './components/CardSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PublicEvents />
        <CardSection />
      </main>
      <Footer />
    </div>
  );
}

