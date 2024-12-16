'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import Image from "next/image";
import { useLanguage } from "@/hooks/useLanguage";

const content = {
  da: {
    events: 'Begivenheder',
    booking: 'Booking',
    donations: 'Donationer',
    dashboard: 'Dashboard',
    login: 'Log ind',
    signup: 'Opret konto',
    logout: 'Log ud'
  },
  en: {
    events: 'Events',
    booking: 'Booking',
    donations: 'Donations',
    dashboard: 'Dashboard',
    login: 'Login',
    signup: 'Sign up',
    logout: 'Log out'
  }
};

export default function Header() {
  const { user, logout } = useAuth();
  const lang = useLanguage();
  const t = content[lang as keyof typeof content];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="hidden md:inline text-xl font-bold">Tilmeld.online</span>
          </Link>

          <nav className="flex space-x-6">
            <Link href="/events" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Image src="/tickets-perforated-regular.svg" alt="Events" width={16} height={16} />
              <span className="hidden lg:inline">{t.events}</span>
            </Link>
            <Link href="/booking" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Image src="/calendar-check-light.svg" alt="Booking" width={16} height={16} />
              <span className="hidden lg:inline">{t.booking}</span>
            </Link>
            <Link href="/donations" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <Image src="/hand-holding-heart-light.svg" alt="Donations" width={16} height={16} />
              <span className="hidden lg:inline">{t.donations}</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Image src="/grid-horizontal-light.svg" alt="Dashboard" width={16} height={16} />
                    <span className="hidden md:inline">{t.dashboard}</span>
                  </Button>
                </Link>
                <Button variant="ghost" onClick={() => logout()} className="flex items-center gap-2">
                  <Image src="/arrow-right-from-bracket-regular.svg" alt="Logout" width={16} height={16} />
                  <span className="hidden md:inline">{t.logout}</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Image src="/user-plus-regular.svg" alt="Sign up" width={16} height={16} />
                    <span className="hidden md:inline">{t.signup}</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Image src="/arrow-right-from-bracket-regular.svg" alt="Login" width={16} height={16} />
                    <span className="hidden md:inline">{t.login}</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

