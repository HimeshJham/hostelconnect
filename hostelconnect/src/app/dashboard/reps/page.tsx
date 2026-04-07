
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Shield, Trash2, Edit2, Plus, Building2, UserCheck, GraduationCap, Briefcase, Filter } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/components/dashboard-provider';

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

const HOSTEL_BLOCKS = [
  "BH-1", "BH-2", "BH-3", "BH-4", "BH-5", "BH-6", "BH-7", "BH-8",
  "GH-1", "GH-2", "Special Block"
];

const OFFICIAL_AUTHORITIES: Representative[] = [
  { id: 'auth1', name: 'Dr. Jastin Samuel R', type: 'General', school: 'SBET', floorOrBlock: 'Member Secretary (MS)', email: 'hac@vitbhopal.ac.in', phoneNumber: '7024159592', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth2', name: 'Dr. Neha Choubey', type: 'General', school: 'SASL-Maths', floorOrBlock: 'Member Secretary (MS)', email: 'hac@vitbhopal.ac.in', phoneNumber: '9384822363', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth3', name: 'Dr. Ranjitha Kumar', type: 'General', school: 'SASL-Maths', floorOrBlock: 'FR Discipline (Boys Hostel)', email: 'fr.disciplineboys@vitbhopal.ac.in', phoneNumber: '7024111640', responsibility: "Boys' Hostel", userId: 'official' },
  { id: 'auth4', name: 'Dr. Indhumathi S', type: 'General', school: 'SEEE', floorOrBlock: 'FR Discipline (Girls Hostel)', email: 'fr.disciplinegirls@vitbhopal.ac.in', phoneNumber: '7024240867', responsibility: "Girls' Hostel", userId: 'official' },
  { id: 'auth5', name: 'Dr. Ashfaq Ahmad Najar', type: 'General', school: 'SCOPE', floorOrBlock: 'FR Attendance', email: 'fr.attendance@vitbhopal.ac.in', phoneNumber: '7024240866', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth6', name: 'Dr. Velmurugan L', type: 'General', school: 'SCOPE', floorOrBlock: 'FR Food', email: 'fr.food@vitbhopal.ac.in', phoneNumber: '7024267807', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth7', name: 'Dr. Nella Anveshkumar', type: 'General', school: 'SEEE', floorOrBlock: 'FR Maintenance', email: 'fr.maintenance@vitbhopal.ac.in', phoneNumber: '7024111635', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth8', name: 'Dr. Abha Sharma', type: 'General', school: 'SCAI', floorOrBlock: 'FR Health', email: 'fr.health@vitbhopal.ac.in', phoneNumber: '7024267805', responsibility: 'All Hostels', userId: 'official' },
  { id: 'auth9', name: 'Dr. Saurav Prasad', type: 'General', school: 'SASL-Chemistry', floorOrBlock: 'FR Events', email: 'fr.events@vitbhopal.ac.in', phoneNumber: 'Not Provided', responsibility: 'All Hostels', userId: 'official' },
];

const OFFICIAL_FACULTY_LIST: Representative[] = [
  { id: 'fac1', name: 'Dr. R. Senthilkumar', type: 'Faculty', school: 'SCOPE', floorOrBlock: 'BH-1', email: 'fr.block1a@vitbhopal.ac.in', phoneNumber: '7024267806', responsibility: 'Faculty in Residence (FR) - Block 1A', userId: 'official' },
  { id: 'fac2', name: 'Dr. Komarasamy G', type: 'Faculty', school: 'SCAI', floorOrBlock: 'BH-1', email: 'fr.block1a@vitbhopal.ac.in', phoneNumber: '7024267806', responsibility: 'Faculty in Residence (FR) - Block 1A', userId: 'official' },
  { id: 'fac18', name: 'Dr. Sreevani Maddukuri', type: 'Faculty', school: 'SCSE', floorOrBlock: 'GH-1', email: 'fr.girlshostel1@vitbhopal.ac.in', phoneNumber: '7024244552', responsibility: "Girls' Hostel Block 1", userId: 'official' },
];

const OFFICIAL_STUDENT_LIST: Representative[] = [
  { id: 'bh1stud1', name: 'Parth Mulik', type: 'Student', floorOrBlock: 'BH-1', email: 'parth.mulik24@vitbhopal.ac.in', phoneNumber: 'Not Provided', responsibility: 'Floor 1, Room B-107', userId: 'official' },
  { id: 'gh1stud1', name: 'Ananya jain', type: 'Student', floorOrBlock: 'GH-1', email: 'ananya.jain23@vitbhopal.ac.in', phoneNumber: 'Not Provided', responsibility: 'Floor 1, Room A114', userId: 'official' },
];

export default function FloorRepsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'employee';
  const { user } = useUser();
  const { toast } = useToast();
  const { representatives: customReps, addRepresentative, updateRepresentative, deleteRepresentative } = useDashboardData();

  const [isOpen, setIsOpen] = useState(false);
  const [editingRep, setEditingRep] = useState<Representative | null>(null);
  const [selectedBlock, setSelectedBlock] = useState("All Blocks");
  const [formData, setFormData] = useState<Partial<Representative>>({
    name: '',
    type: 'Student',
    floorOrBlock: 'BH-1',
    email: '',
    phoneNumber: '',
  });

  const handleOpenDialog = (rep?: Representative) => {
    if (rep) {
      setEditingRep(rep);
      setFormData(rep);
    } else {
      setEditingRep(null);
      setFormData({
        name: '',
        type: 'Student',
        floorOrBlock: HOSTEL_BLOCKS[0],
        email: '',
        phoneNumber: '',
      });
    }
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.floorOrBlock) {
      toast({ title: "Missing Fields", variant: "destructive" });
      return;
    }

    const finalRep = {
      ...(formData as Representative),
      id: editingRep ? editingRep.id : Date.now().toString(),
      userId: user?.uid || 'anonymous'
    };

    if (editingRep) {
      updateRepresentative(finalRep);
    } else {
      addRepresentative(finalRep);
    }
    
    toast({ title: editingRep ? "Updated" : "Added", description: `Success!` });
    setIsOpen(false);
  };

  const allGeneral = [...OFFICIAL_AUTHORITIES, ...customReps.filter(r => r.type === 'General')];
  const allStudents = [...OFFICIAL_STUDENT_LIST, ...customReps.filter(r => r.type === 'Student')];
  const allFaculty = [...OFFICIAL_FACULTY_LIST, ...customReps.filter(r => r.type === 'Faculty')];

  const filteredStudents = allStudents.filter(r => selectedBlock === "All Blocks" || r.floorOrBlock === selectedBlock);
  const filteredFaculty = allFaculty.filter(r => selectedBlock === "All Blocks" || r.floorOrBlock === selectedBlock);

  const RepCard = ({ rep }: { rep: Representative }) => (
    <Card key={rep.id} className="border-none shadow-md overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group">
      <CardHeader className={`pb-2 ${rep.type === 'Faculty' ? 'bg-primary/5' : rep.type === 'General' ? 'bg-blue-50' : 'bg-secondary/5'}`}>
        <div className="flex justify-between items-start">
          <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm border">
            {rep.type === 'Faculty' ? <GraduationCap className="h-6 w-6" /> : rep.type === 'General' ? <Shield className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
          </div>
          <Badge variant={rep.type === 'General' ? 'default' : rep.type === 'Faculty' ? 'outline' : 'secondary'} className="font-bold">
            {rep.type}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold pt-4">{rep.name}</CardTitle>
        <CardDescription className="flex flex-col gap-1 font-bold text-primary mt-1">
          <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {rep.floorOrBlock}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-3 flex-1">
        {rep.responsibility && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 p-2 bg-muted/20 rounded border-l-4 border-primary/30">
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>{rep.responsibility}</span>
          </div>
        )}
        <Button variant="outline" className="w-full justify-start font-medium text-xs bg-muted/30 border-none" asChild>
          <a href={rep.email !== 'Not Provided' ? `mailto:${rep.email}` : '#'}>
            <Mail className="h-3.5 w-3.5 mr-2" />
            <span className="truncate">{rep.email}</span>
          </a>
        </Button>
        <Button variant="outline" disabled={rep.phoneNumber === 'Not Provided'} className="w-full justify-start font-medium text-xs bg-muted/30 border-none" asChild>
          <a href={rep.phoneNumber !== 'Not Provided' ? `tel:${rep.phoneNumber}` : '#'}>
            <Phone className="h-3.5 w-3.5 mr-2" />
            <span>{rep.phoneNumber}</span>
          </a>
        </Button>
      </CardContent>
      {isAdmin && rep.userId !== 'official' && (
        <CardFooter className="bg-muted/10 border-t flex gap-2 justify-end py-3">
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(rep)} className="h-8">
            <Edit2 className="h-3 w-3 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 h-8" onClick={() => deleteRepresentative(rep.id)}>
            <Trash2 className="h-3 w-3 mr-1" /> Remove
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Representatives & Authorities</h2>
          <p className="text-muted-foreground">Official leads for hostel help and guidance.</p>
        </div>
        {isAdmin && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="bg-primary text-white font-bold">
                <Plus className="mr-2 h-4 w-4" /> Add Personnel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRep ? 'Edit' : 'Add'} Personnel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v: any) => setFormData({...formData, type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Faculty">Faculty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-primary/10 p-1 h-12 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGeneral.map(rep => <RepCard key={rep.id} rep={rep} />)}
          </div>
        </TabsContent>

        <TabsContent value="students">
          <div className="flex justify-end mb-4">
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Blocks">All Blocks</SelectItem>
                {HOSTEL_BLOCKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(rep => <RepCard key={rep.id} rep={rep} />)}
          </div>
        </TabsContent>

        <TabsContent value="faculty">
          <div className="flex justify-end mb-4">
            <Select value={selectedBlock} onValueChange={setSelectedBlock}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Blocks">All Blocks</SelectItem>
                {HOSTEL_BLOCKS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFaculty.map(rep => <RepCard key={rep.id} rep={rep} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
