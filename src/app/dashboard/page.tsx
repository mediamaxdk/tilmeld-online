'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/app/components/Header";
// Assuming the correct path for EventsList and AddEventForm is under the app directory
import EventsList from "@/app/dashboard/components/EventsList";
import AddEventForm from "@/app/dashboard/components/AddEventForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddEventForm userId={user.uid} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Events</CardTitle>
            </CardHeader>
            <CardContent>
              <EventsList userId={user.uid} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 