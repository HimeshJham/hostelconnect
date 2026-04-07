
"use client";

import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useSearchParams } from 'next/navigation';
import { UserCircle, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import Link from 'next/link';
import { DashboardProvider } from '@/components/dashboard-provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [role, setRole] = useState('student');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const r = searchParams.get('role');
    if (r === 'employee') {
      setRole('employee');
    }
  }, [searchParams]);

  const fullName = user?.displayName || (role === 'employee' ? 'Hostel Admin' : 'Hostel Resident');
  const firstName = fullName.split(' ')[0];
  const welcomeName = mounted ? firstName : 'User';
  const roleLabel = mounted ? role : 'student';

  return (
    <DashboardProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background font-body">
          <DashboardSidebar />
          <SidebarInset className="flex flex-col flex-1 overflow-hidden">
            <header className="h-16 border-b bg-white/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-primary hover:bg-primary/10" />
                <h1 className="text-xl font-bold text-foreground">
                  Welcome Back, <span className="text-primary">{welcomeName}</span>
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </Button>
                <div className="h-8 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-foreground">{fullName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{roleLabel}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="h-8 w-px bg-border" />
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 transition-colors" asChild>
                  <Link href="/">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Link>
                </Button>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DashboardProvider>
  );
}
