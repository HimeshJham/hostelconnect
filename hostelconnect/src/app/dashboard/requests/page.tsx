
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Wrench, Lightbulb, Trash2, Home as HomeIcon, Clock, CheckCircle2, MoreVertical, Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/dashboard-provider';

export default function ServiceRequestsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'employee';
  const { requests, addRequest, updateRequestStatus } = useDashboardData();

  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState("Electrician");
  const [newRoom, setNewRoom] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const categories = [
    { label: "Electrician", icon: Lightbulb, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Cleaner", icon: Trash2, color: "text-green-500", bg: "bg-green-50" },
    { label: "House Help", icon: HomeIcon, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Carpenter", icon: Wrench, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const handleSubmit = () => {
    if (!newDesc.trim()) return;
    addRequest({
      category: newCat,
      desc: newDesc,
      room: newRoom,
      status: "Pending",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
    setIsAdding(false);
    setNewRoom("");
    setNewDesc("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Service Requests</h2>
          <p className="text-muted-foreground">{isAdmin ? "Manage and track hostel maintenance tasks." : "Submit requests for room repairs and maintenance."}</p>
        </div>
        {!isAdmin && (
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white font-bold">
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        )}
      </div>

      {isAdding && !isAdmin && (
        <Card className="animate-in slide-in-from-top-4 duration-300 shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle>Submit New Request</CardTitle>
            <CardDescription>Our maintenance team will address your issue within 24-48 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="req-cat">Service Category</Label>
                <Select value={newCat} onValueChange={setNewCat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.label} value={c.label}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room Number</Label>
                <Input id="room" value={newRoom} onChange={(e) => setNewRoom(e.target.value)} placeholder="e.g., 302-B" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-desc">Issue Description</Label>
              <Textarea id="req-desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Describe the problem in detail..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-primary">Submit Request</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {requests.map((req) => {
          const cat = categories.find(c => c.label === req.category) || categories[0];
          return (
            <Card key={req.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`${cat.bg} p-4 rounded-xl`}>
                    <cat.icon className={`h-6 w-6 ${cat.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{req.category}</h4>
                    <p className="text-sm text-muted-foreground">{req.desc}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 uppercase font-bold tracking-wider">
                      <Clock className="h-3 w-3" /> Room {req.room} • Requested {req.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Status</p>
                    <p className={`text-sm font-bold ${
                      req.status === 'Completed' ? 'text-green-500' : 
                      req.status === 'In Progress' ? 'text-blue-500' : 'text-orange-500'
                    }`}>
                      {req.status}
                    </p>
                  </div>
                  {isAdmin ? (
                    <Select value={req.status} onValueChange={(v) => updateRequestStatus(req.id, v)}>
                      <SelectTrigger className="w-[140px] h-9 text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-muted">
                      {req.status === 'Completed' ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Clock className="h-6 w-6 text-orange-400" />}
                    </div>
                  )}
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
