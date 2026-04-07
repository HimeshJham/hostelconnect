
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Announcement {
  id: number;
  title: string;
  desc: string;
  date: string;
  priority: string;
  pinned: boolean;
}

interface ServiceRequest {
  id: number;
  category: string;
  desc: string;
  room: string;
  status: string;
  date: string;
}

interface Complaint {
  id: number;
  category: string;
  summary: string;
  desc: string;
  status: string;
  date: string;
}

interface Representative {
  id: string;
  name: string;
  type: 'General' | 'Student' | 'Faculty';
  floorOrBlock: string;
  email: string;
  phoneNumber: string;
  userId: string;
  responsibility?: string;
  school?: string;
}

interface DashboardContextType {
  announcements: Announcement[];
  requests: ServiceRequest[];
  complaints: Complaint[];
  representatives: Representative[];
  addAnnouncement: (a: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: number) => void;
  addRequest: (r: Omit<ServiceRequest, 'id'>) => void;
  updateRequestStatus: (id: number, status: string) => void;
  addComplaint: (c: Omit<Complaint, 'id'>) => void;
  updateComplaintStatus: (id: number, status: string) => void;
  addRepresentative: (r: Representative) => void;
  updateRepresentative: (r: Representative) => void;
  deleteRepresentative: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: 1, title: "Water Tank Cleaning", desc: "Main water supply will be suspended from 10 AM to 2 PM this Sunday for routine cleaning.", date: "May 24, 2024", priority: "High", pinned: true },
    { id: 2, title: "Hostel Night 2024", desc: "Registrations are open for the annual hostel night. Contact block reps for more details.", date: "May 22, 2024", priority: "Normal", pinned: false },
    { id: 3, title: "New Gym Equipment", desc: "We have added new treadmills and weights to the hostel gym. Please maintain decorum.", date: "May 20, 2024", priority: "Normal", pinned: false },
  ]);

  const [requests, setRequests] = useState<ServiceRequest[]>([
    { id: 1, category: "Electrician", desc: "Fan in room 302-B is not working properly and making noise.", room: "302-B", status: "In Progress", date: "May 24" },
    { id: 2, category: "Cleaner", desc: "Common bathroom on 3rd floor needs urgent cleaning.", room: "Floor 3", status: "Pending", date: "May 25" },
    { id: 3, category: "Carpenter", desc: "Wardrobe door handle is broken.", room: "105-A", status: "Completed", date: "May 20" },
  ]);

  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 1, category: "Behavior", summary: "Loud music in Block 2 late at night.", desc: "Students are playing loud music past 11 PM on weeknights, disturbing our study time.", status: "Pending", date: "May 25" },
    { id: 2, category: "Maintenance", summary: "Persistent water leakage in GH-1.", desc: "The sink in the 2nd floor common washroom is leaking continuously.", status: "Resolved", date: "May 22" },
  ]);

  const [representatives, setRepresentatives] = useState<Representative[]>([]);

  const addAnnouncement = (a: Omit<Announcement, 'id'>) => {
    setAnnouncements([{ ...a, id: Date.now() }, ...announcements]);
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const addRequest = (r: Omit<ServiceRequest, 'id'>) => {
    setRequests([{ ...r, id: Date.now() }, ...requests]);
  };

  const updateRequestStatus = (id: number, status: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  const addComplaint = (c: Omit<Complaint, 'id'>) => {
    setComplaints([{ ...c, id: Date.now() }, ...complaints]);
  };

  const updateComplaintStatus = (id: number, status: string) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c));
  };

  const addRepresentative = (r: Representative) => {
    setRepresentatives([r, ...representatives]);
  };

  const updateRepresentative = (r: Representative) => {
    setRepresentatives(representatives.map(rep => rep.id === r.id ? r : rep));
  };

  const deleteRepresentative = (id: string) => {
    setRepresentatives(representatives.filter(rep => rep.id !== id));
  };

  return (
    <DashboardContext.Provider value={{
      announcements,
      requests,
      complaints,
      representatives,
      addAnnouncement,
      deleteAnnouncement,
      addRequest,
      updateRequestStatus,
      addComplaint,
      updateComplaintStatus,
      addRepresentative,
      updateRepresentative,
      deleteRepresentative
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboardData = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboardData must be used within DashboardProvider");
  return context;
}
