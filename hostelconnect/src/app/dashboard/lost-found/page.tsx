
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, MapPin, Calendar, Phone, Trash2, Camera, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function LostFoundPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [items, setItems] = useState([
    { id: 1, type: "Lost", title: "Black Laptop Charger", desc: "Dell 65W charger, lost in Library 2nd floor.", loc: "Main Library", date: "May 20, 2024", contact: "9876543210", img: "https://picsum.photos/seed/lost1/400/300" },
    { id: 2, type: "Found", title: "Set of Keys", desc: "Honda bike key with a red keychain.", loc: "Basketball Court", date: "May 21, 2024", contact: "Hostel Warden", img: "https://picsum.photos/seed/lost2/400/300" },
    { id: 3, type: "Lost", title: "Blue Water Bottle", desc: "Milton steel bottle, blue color.", loc: "Mess Hall", date: "May 19, 2024", contact: "8882223334", img: "https://picsum.photos/seed/lost3/400/300" },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    type: "Lost",
    title: "",
    desc: "",
    loc: "",
    contact: "",
  });

  const filteredItems = items
    .filter(i => filter === "all" || i.type.toLowerCase() === filter)
    .filter(i => 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.loc.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleClaim = (item: any) => {
    const action = item.type === 'Lost' ? 'Found' : 'Claimed';
    toast({
      title: `Item ${action}!`,
      description: `You have successfully reported this item. Our team will contact the owner.`,
    });
    // Simulating item being removed/marked as resolved
    setItems(items.filter(i => i.id !== item.id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.loc || !newItem.contact) return;

    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      img: `https://picsum.photos/seed/${Date.now()}/400/300`
    };
    
    setItems([itemToAdd, ...items]);
    setIsAdding(false);
    setNewItem({ type: "Lost", title: "", desc: "", loc: "", contact: "" });
    
    toast({
      title: "Post Successful",
      description: `Your ${newItem.type.toLowerCase()} item post is now live.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Lost & Found</h2>
          <p className="text-muted-foreground">Report and recover items within the hostel premises.</p>
        </div>
        
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white font-bold">
              <Plus className="mr-2 h-4 w-4" /> Post New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Post Lost/Found Item</DialogTitle>
              <DialogDescription>
                Provide details about the item to help it reach its owner.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddItem} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Post Type</Label>
                <Select value={newItem.type} onValueChange={(v) => setNewItem({...newItem, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lost">Lost Item</SelectItem>
                    <SelectItem value="Found">Found Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Item Title</Label>
                <Input 
                  id="title" 
                  value={newItem.title} 
                  onChange={(e) => setNewItem({...newItem, title: e.target.value})} 
                  placeholder="e.g., Wallet, Keys, Umbrella" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc">Location</Label>
                <Input 
                  id="loc" 
                  value={newItem.loc} 
                  onChange={(e) => setNewItem({...newItem, loc: e.target.value})} 
                  placeholder="e.g., Block 1 Lobby" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Info</Label>
                <Input 
                  id="contact" 
                  value={newItem.contact} 
                  onChange={(e) => setNewItem({...newItem, contact: e.target.value})} 
                  placeholder="Your phone number or room" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  value={newItem.desc} 
                  onChange={(e) => setNewItem({...newItem, desc: e.target.value})} 
                  placeholder="Provide color, brand, or specific marks..." 
                  required 
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">Post Item</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            className="pl-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
          <TabsList className="bg-primary/10">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="lost">Lost</TabsTrigger>
            <TabsTrigger value="found">Found</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-none shadow-md overflow-hidden group hover:shadow-2xl transition-all h-full flex flex-col">
            <div className="relative h-48 w-full overflow-hidden">
              <Image 
                src={item.img} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                data-ai-hint="lost object"
              />
              <span className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg ${item.type === 'Lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                {item.type}
              </span>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">{item.title}</CardTitle>
              <CardDescription className="line-clamp-2">{item.desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                <span>{item.loc}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 text-primary" />
                <span>{item.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Phone className="h-3 w-3 text-primary" />
                <span>{item.contact}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                onClick={() => handleClaim(item)}
                variant="outline" 
                className="w-full font-bold border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                {item.type === 'Lost' ? 'I Found This' : 'This is Mine'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-24 bg-white rounded-xl shadow-inner border border-dashed border-muted">
          <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">No items found matching your criteria.</p>
          <Button variant="link" onClick={() => {setFilter('all'); setSearchQuery('')}} className="text-primary mt-2">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
