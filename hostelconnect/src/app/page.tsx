
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { User, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12">
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-bold text-primary tracking-tight">Hostel Connect</h1>
        <p className="text-xl text-muted-foreground italic">"Simplifying Hostel Life"</p>
        <p className="text-foreground max-w-lg mx-auto">
          A centralized hub for college residents and management. Manage meals, requests, and stay updated with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="group hover:shadow-2xl transition-all duration-300 border-primary/20 bg-white/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl pt-4">Student Login</CardTitle>
            <CardDescription>Access your meal plans, requests, and announcements.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button asChild size="lg" className="w-full font-bold group-hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
              <Link href="/auth/login?role=student">Access Student Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-2xl transition-all duration-300 border-secondary/20 bg-white/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-secondary/10 p-4 rounded-full w-fit group-hover:bg-secondary/20 transition-colors">
              <ShieldCheck className="h-12 w-12 text-secondary" />
            </div>
            <CardTitle className="text-2xl pt-4">Employee Login</CardTitle>
            <CardDescription>Manage hostel operations, services, and mess menus.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pt-4">
            <Button asChild size="lg" variant="secondary" className="w-full font-bold group-hover:scale-105 transition-transform shadow-lg">
              <Link href="/auth/login?role=employee">Access Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <footer className="text-sm text-muted-foreground pt-12">
        © {year ?? '...'} Hostel Connect. All rights reserved.
      </footer>
    </div>
  );
}
