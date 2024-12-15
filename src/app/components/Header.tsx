'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Tilmeld.online
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/events" 
              className="text-gray-600 hover:text-gray-900"
            >
              Events
            </Link>
            <Link 
              href="/booking" 
              className="text-gray-600 hover:text-gray-900"
            >
              Booking
            </Link>
            <Link 
              href="/donations" 
              className="text-gray-600 hover:text-gray-900"
            >
              Donations
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => logout()}
                >
                  Log out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

