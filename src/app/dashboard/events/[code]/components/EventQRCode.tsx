'use client';

import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

interface EventQRCodeProps {
  eventCode: string;
}

export default function EventQRCode({ eventCode }: EventQRCodeProps) {
  const eventUrl = `${window.location.origin}/event/${eventCode}`;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 inline-block rounded-lg">
        <QRCodeSVG
          value={eventUrl}
          size={200}
          level="H"
          includeMargin
        />
      </div>
      <Link 
        href={`/event/${eventCode}`}
        className="text-sm text-blue-500 hover:text-blue-700 text-center break-all block transition-colors"
      >
        {eventUrl}
      </Link>
    </div>
  );
} 