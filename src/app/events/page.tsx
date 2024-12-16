'use client';

import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';
import pagesContent from '@/app/content/pages';

export default function EventsPage() {
  const lang = useLanguage();
  const content = pagesContent[lang as keyof typeof pagesContent].events;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{content.title}</h1>
        <div className="prose max-w-none">
          <p className="text-xl mb-6">
            {content.description}
          </p>
          <ul className="list-disc pl-6 mb-6">
            {content.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <p className="mb-6">
            {content.bottomText}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
} 