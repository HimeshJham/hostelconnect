
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useSearchParams } from 'next/navigation';
import { Utensils, Wrench, MessageSquare, Megaphone, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useDashboardData } from '@/components/dashboard-provider';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DashboardHome() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const { announcements, requests, complaints } = useDashboardData();
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    setToday(DAYS[new Date().getDay()]);
  }, []);

  const activeRequestsCount = requests.filter(r => r.status !== 'Completed').length;
  const unresolvedComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  const stats = [
    { label: 'Today\'s Mess', value: 'Paneer Tikka', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: role === 'student' ? 'My Requests' : 'Pending Requests', value: `${activeRequestsCount} Active`, icon: Wrench, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Announcements', value: `${announcements.length} Recent`, icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Complaints', value: `${unresolvedComplaintsCount} Unresolved`, icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Quick access to your hostel statistics and activities.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-sm font-bold text-foreground leading-tight truncate">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-sm border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Stay updated with the latest from management.</CardDescription>
            </div>
            <Button asChild variant="ghost" className="text-primary font-bold">
              <Link href={`/dashboard/announcements?role=${role}`}>View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`${item.priority === 'High' ? 'text-red-500' : 'text-blue-500'} p-2`}>
                    {item.priority === 'High' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Mess Menu Today</CardTitle>
            <CardDescription>{today || "..."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-1 border-l-4 border-primary pl-4 py-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Breakfast</p>
              <p className="font-bold text-sm">Masala Dosa & Sambhar</p>
            </div>
            <div className="flex flex-col gap-1 border-l-4 border-primary pl-4 py-1">
              <p className="text-xs font-bold text-muted-foreground uppercase text-orange-500">Lunch</p>
              <p className="font-bold text-sm">Veg Biryani & Raita</p>
            </div>
            <div className="flex flex-col gap-1 border-l-4 border-primary pl-4 py-1">
              <p className="text-xs font-bold text-muted-foreground uppercase">Dinner</p>
              <p className="font-bold text-sm">Paneer Tikka & Roti</p>
            </div>
            <Button asChild className="w-full mt-4 bg-primary text-white">
              <Link href={`/dashboard/mess?role=${role}`}>Full Weekly Menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
