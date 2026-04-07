
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Utensils, Save, Table as TableIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["breakfast", "lunch", "snacks", "dinner"];

const MESS_OPTIONS = [
  "Rassense Mess (Boys: Block 1)",
  "Mayuri Mess (Boys: Block 2-5,7)",
  "Safal Mess (Boys: Block 6, 8)",
  "JMB Mess (Boys)",
  "AB Caterers (Girls: Block 1)",
  "Mayuri Mess (Girls: Block 2 + Special Block)"
];

const MOCK_MENU: Record<string, any> = {
  "Monday": { breakfast: "Idli, Sambhar, Chutney", lunch: "Tawa Roti, Aloo Mutter", snacks: "Bhelpuri", dinner: "Kadhai Mix Veg" },
  "Tuesday": { breakfast: "Poha, Pongal Chutney", lunch: "Mix Dal, Mint Rice", snacks: "Dahi Vada", dinner: "Mix Veg, Dal Tadka" },
  "Wednesday": { breakfast: "Pav Bhaji, Upma", lunch: "Dal Tadka, Mutter Pulao", snacks: "Panipuri", dinner: "Paneer Masala" },
  "Thursday": { breakfast: "Rava Khichdi, Pongal", lunch: "Rajma, Jeera Rice", snacks: "Noodles", dinner: "Egg Gravy, Green Peas" },
  "Friday": { breakfast: "Daliya, Poha", lunch: "Lauki Chana, Dal Fry", snacks: "Black Channa", dinner: "Chicken Masala, Kadai Paneer" },
  "Saturday": { breakfast: "Uthappam, Sambhar", lunch: "Aloo Palak, Garlic Dal", snacks: "Sweet Corn Salad", dinner: "Veg Pulao, Lobia Gravy" },
  "Sunday": { breakfast: "Uthappam, Sambhar", lunch: "Veg Biryani, Chicken Biryani", snacks: "White Sauce Pasta", dinner: "Dal Makhani, Halwa" },
};

export default function MessMenuPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'employee';
  const { toast } = useToast();

  const [activeMess, setActiveMess] = useState(MESS_OPTIONS[0]);
  const [activeDay, setActiveDay] = useState("Monday");
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState(MOCK_MENU["Monday"]);

  useEffect(() => {
    setFormData(MOCK_MENU[activeDay] || { breakfast: '', lunch: '', snacks: '', dinner: '' });
  }, [activeDay]);

  const handleSave = () => {
    toast({
      title: "Menu Updated",
      description: `Menu for ${activeDay} in ${activeMess} has been saved.`,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Mess Menu</h2>
          <p className="text-muted-foreground">Manage and view meal schedules across all messes.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary font-bold">
                <TableIcon className="mr-2 h-4 w-4" /> Full Timetable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] flex flex-col p-0 overflow-hidden">
              <DialogHeader className="p-6 border-b bg-primary/5">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Utensils className="h-6 w-6 text-primary" /> Full Mess Timetable - {activeMess}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-auto p-6">
                <Table>
                  <TableHeader className="bg-primary text-primary-foreground">
                    <TableRow>
                      <TableHead className="text-white font-bold w-[100px]">Day</TableHead>
                      <TableHead className="text-white font-bold">Breakfast</TableHead>
                      <TableHead className="text-white font-bold">Lunch</TableHead>
                      <TableHead className="text-white font-bold">Snacks</TableHead>
                      <TableHead className="text-white font-bold">Dinner</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DAYS.map((day) => (
                      <TableRow key={day} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-bold text-primary">{day}</TableCell>
                        <TableCell className="text-xs">{MOCK_MENU[day]?.breakfast}</TableCell>
                        <TableCell className="text-xs">{MOCK_MENU[day]?.lunch}</TableCell>
                        <TableCell className="text-xs">{MOCK_MENU[day]?.snacks}</TableCell>
                        <TableCell className="text-xs">{MOCK_MENU[day]?.dinner}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>

          <Select value={activeMess} onValueChange={setActiveMess}>
            <SelectTrigger className="w-[300px] bg-white font-bold border-primary/20 text-primary">
              <SelectValue placeholder="Select Mess" />
            </SelectTrigger>
            <SelectContent>
              {MESS_OPTIONS.map((mess) => (
                <SelectItem key={mess} value={mess}>{mess}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isAdmin && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="border-primary text-primary font-bold">
              Edit Menu
            </Button>
          )}
          {isAdmin && isEditing && (
            <Button onClick={handleSave} className="bg-primary text-white font-bold">
              <Save className="mr-2 h-4 w-4" /> Save All
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Tabs value={activeDay} onValueChange={setActiveDay} className="w-full">
          <TabsList className="flex flex-wrap h-auto bg-primary/10 p-1 mb-8 overflow-x-auto justify-start">
            {DAYS.map(day => (
              <TabsTrigger key={day} value={day} className="px-6 py-2.5 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeDay} className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MEAL_TYPES.map((mealType) => (
                <Card key={mealType} className="border-none shadow-md overflow-hidden group hover:shadow-xl transition-all h-full">
                  <div className="h-2 bg-primary" />
                  <CardHeader className="bg-primary/5 pb-2">
                    <CardTitle className="capitalize text-primary flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      {mealType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isEditing ? (
                      <Input 
                        value={formData[mealType]} 
                        onChange={(e) => setFormData({...formData, [mealType]: e.target.value})}
                        placeholder={`Enter ${mealType} menu...`}
                        className="font-bold"
                      />
                    ) : (
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                          {formData[mealType] || "Not Scheduled"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-4 uppercase font-bold tracking-widest border-t pt-2">
                          {mealType === 'breakfast' ? '07:30 - 09:30' : 
                           mealType === 'lunch' ? '12:30 - 14:30' : 
                           mealType === 'snacks' ? '16:30 - 17:30' : '19:30 - 21:30'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="bg-blue-50 border-none shadow-inner p-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Utensils className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary">Dining Hall Guidelines</h4>
            <p className="text-sm text-primary/70">Ensure you scan your QR code for daily tracking. All meals are served at designated timings only.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
