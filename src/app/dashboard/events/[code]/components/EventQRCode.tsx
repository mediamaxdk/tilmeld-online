'use client';

import { QRCodeSVG } from 'qrcode.react';

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
      <p className="text-sm text-gray-500 text-center break-all">
        {eventUrl}
      </p>
    </div>
  );
} 