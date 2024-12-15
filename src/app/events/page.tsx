import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Event Management</h1>
        <div className="prose max-w-none">
          <p className="text-xl mb-6">
            Create and manage events with ease. Perfect for any organization looking to host:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Conferences and seminars</li>
            <li>Workshops and training sessions</li>
            <li>Social gatherings and meetups</li>
            <li>Corporate events</li>
            <li>Community activities</li>
          </ul>
          <p className="mb-6">
            Each event gets a unique code that attendees can use to register. Track registrations, 
            manage attendance, and communicate with participants all in one place.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 