
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Home,
  Utensils,
  Wrench,
  Users,
  Search,
  MessageSquare,
  Megaphone,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [role, setRole] = useState('student');

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'employee') {
      setRole('employee');
    }
  }, [searchParams]);

  const menuItems = [
    { title: 'Dashboard Home', icon: Home, url: `/dashboard/home?role=${role}` },
    { title: 'Mess Menu', icon: Utensils, url: `/dashboard/mess?role=${role}` },
    { title: 'Service Requests', icon: Wrench, url: `/dashboard/requests?role=${role}` },
    { title: 'Floor Rep & Authority', icon: Users, url: `/dashboard/reps?role=${role}` },
    { title: 'Lost & Found', icon: Search, url: `/dashboard/lost-found?role=${role}` },
    { title: 'Anonymous Complaint', icon: AlertCircle, url: `/dashboard/complaints?role=${role}` },
    { title: 'General Chat', icon: MessageSquare, url: `/dashboard/chat?role=${role}` },
    { title: 'Announcements', icon: Megaphone, url: `/dashboard/announcements?role=${role}` },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border shadow-xl">
      <SidebarHeader className="p-6 bg-sidebar-background">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-primary font-bold text-xl shadow-inner">
            HC
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Hostel Connect</h2>
            <p className="text-[10px] uppercase tracking-widest text-white/70 font-bold">{role} Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-background px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50 font-bold px-2 py-4">MAIN MENU</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.url.split('?')[0];
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200 h-11 px-4 rounded-lg",
                      isActive 
                        ? "bg-white text-primary font-bold shadow-md hover:bg-white hover:text-primary" 
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-white/80")} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
