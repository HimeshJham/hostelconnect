
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Megaphone, Plus, Calendar, Pin, Trash2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useDashboardData } from '@/components/dashboard-provider';

export default function AnnouncementsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'employee';
  const { announcements, addAnnouncement, deleteAnnouncement } = useDashboardData();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("Normal");

  const handleCreate = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    addAnnouncement({
      title: newTitle,
      desc: newDesc,
      priority: newPriority,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      pinned: false
    });
    setIsAdding(false);
    setNewTitle("");
    setNewDesc("");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Announcements</h2>
          <p className="text-muted-foreground">Stay informed about the latest hostel events and notices.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setIsAdding(!isAdding)} className="bg-primary text-white font-bold">
            <Plus className="mr-2 h-4 w-4" /> New Announcement
          </Button>
        )}
      </div>

      {isAdding && isAdmin && (
        <Card className="animate-in slide-in-from-top-4 duration-300 shadow-xl border-primary/20">
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
            <CardDescription>Post a notice for all residents to see.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Water Tank Cleaning" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Detailed Description</Label>
              <Textarea id="desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Provide full details here..." className="min-h-[100px]" />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-primary">Post Announcement</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {announcements.map((item) => (
          <Card key={item.id} className={`border-none shadow-md overflow-hidden transition-all hover:shadow-xl ${item.pinned ? 'ring-2 ring-primary/20' : ''}`}>
            <div className={`h-1.5 ${item.priority === 'High' ? 'bg-red-500' : 'bg-primary'}`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.pinned && <Pin className="h-3 w-3 text-primary fill-primary" />}
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                      {item.priority} Priority
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold pt-1">{item.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">{item.date}</span>
                  {isAdmin && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 ml-2" onClick={() => deleteAnnouncement(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </CardContent>
            <CardFooter className="pt-0 pb-4 bg-muted/20 mt-4 h-10 flex items-center px-6">
              <Megaphone className="h-3 w-3 text-muted-foreground mr-2" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Posted by Warden's Office</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
