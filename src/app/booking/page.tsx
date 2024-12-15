import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Professional Booking System</h1>
        <div className="prose max-w-none">
          <p className="text-xl mb-6">
            Streamline your appointment scheduling with our professional booking system. Perfect for:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Barbers and hairstylists</li>
            <li>Tattoo artists</li>
            <li>Consultants and coaches</li>
            <li>Therapists and healthcare providers</li>
            <li>Personal trainers</li>
          </ul>
          <p className="mb-6">
            Let clients book appointments at their convenience. Manage your schedule, 
            set availability, and reduce no-shows with automated reminders.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 