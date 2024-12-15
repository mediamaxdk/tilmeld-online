import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CardSection() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/events">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Create and manage events for your organization. Perfect for conferences, meetups, workshops, and social gatherings. Let attendees easily register with a simple code.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/booking">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Streamline your appointment scheduling. Ideal for professionals like barbers, tattoo artists, and consultants. Let clients book their preferred time slots effortlessly.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/donations">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Support charitable causes and fundraising campaigns. Create donation pages for your projects and let supporters contribute easily to your cause.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}

