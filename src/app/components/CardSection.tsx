'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

const content = {
  da: {
    events: {
      title: 'Events',
      description: 'Opret og administrer events for din organisation. Perfekt til konferencer, meetups, workshops og sociale arrangementer. Lad deltagere nemt tilmelde sig med en simpel kode.',
      readMore: 'Læs mere'
    },
    booking: {
      title: 'Booking',
      description: 'Strømlin din tidsbestilling. Ideel til fagfolk som frisører, tatovører og konsulenter. Lad kunder booke deres foretrukne tidspunkter uden besvær.',
      readMore: 'Læs mere',
      comingSoon: 'Kommer snart'
    },
    donations: {
      title: 'Donationer',
      description: 'Støt velgørende formål og indsamlingskampagner. Opret donationssider til dine projekter og lad støtter nemt bidrage til din sag.',
      readMore: 'Læs mere',
      comingSoon: 'Kommer snart'
    }
  },
  en: {
    events: {
      title: 'Events',
      description: 'Create and manage events for your organization. Perfect for conferences, meetups, workshops, and social gatherings. Let attendees easily register with a simple code.',
      readMore: 'Read more'
    },
    booking: {
      title: 'Booking',
      description: 'Streamline your appointment scheduling. Ideal for professionals like barbers, tattoo artists, and consultants. Let clients book their preferred time slots effortlessly.',
      readMore: 'Read more',
      comingSoon: 'Coming soon'
    },
    donations: {
      title: 'Donations',
      description: 'Support charitable causes and fundraising campaigns. Create donation pages for your projects and let supporters contribute easily to your cause.',
      readMore: 'Read more',
      comingSoon: 'Coming soon'
    }
  }
};

export default function CardSection() {
  const [lang, setLang] = useState('da');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    setLang(browserLang === 'da' ? 'da' : 'en');
  }, []);

  const t = content[lang as keyof typeof content];

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/events">
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row p-6">
                <div className="w-full lg:w-1/4 flex items-center justify-center mb-4 lg:mb-0 p-8">
                  <Image
                    src="/tickets-perforated-regular.svg"
                    alt="Events"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="w-full lg:w-3/4">
                  <CardHeader className="p-0">
                    <CardTitle>{t.events.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-2">
                    <p className="text-sm text-gray-600 mb-4">{t.events.description}</p>
                    <Button variant="outline" size="sm">
                      {t.events.readMore}
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-2 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
              {t.booking.comingSoon}
            </div>
            <div className="flex flex-col lg:flex-row p-6">
              <div className="w-full lg:w-1/4 flex items-center justify-center mb-4 lg:mb-0 p-8">
                <Image
                  src="/calendar-check-light.svg"
                  alt="Booking"
                  width={48}
                  height={48}
                  className="opacity-50"
                />
              </div>
              <div className="w-full lg:w-3/4">
                <CardHeader className="p-0">
                  <CardTitle className="text-gray-500">{t.booking.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-sm text-gray-400 mb-4">{t.booking.description}</p>
                  <Button variant="outline" size="sm" disabled>
                    {t.booking.readMore}
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>

          <Card className="hover:shadow-lg transition-shadow relative">
            <div className="absolute -top-2 right-4 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
              {t.donations.comingSoon}
            </div>
            <div className="flex flex-col lg:flex-row p-6">
              <div className="w-full lg:w-1/4 flex items-center justify-center mb-4 lg:mb-0 p-8">
                <Image
                  src="/hand-holding-heart-light.svg"
                  alt="Donations"
                  width={48}
                  height={48}
                  className="opacity-50"
                />
              </div>
              <div className="w-full lg:w-3/4">
                <CardHeader className="p-0">
                  <CardTitle className="text-gray-500">{t.donations.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-2">
                  <p className="text-sm text-gray-400 mb-4">{t.donations.description}</p>
                  <Button variant="outline" size="sm" disabled>
                    {t.donations.readMore}
                  </Button>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

