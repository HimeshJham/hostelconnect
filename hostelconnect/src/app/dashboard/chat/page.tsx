
"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile, Paperclip, MoreHorizontal, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function GeneralChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, user: "Sarah K.", text: "Anyone knows if Mess 2 is serving special dinner today?", time: "11:30 AM", isMe: false },
    { id: 2, user: "Mike T.", text: "Yeah, it's Paneer Tikka night! 🥳", time: "11:32 AM", isMe: false },
    { id: 3, user: "Alex J. (Me)", text: "Awesome! I'll be there around 8 PM.", time: "11:35 AM", isMe: true },
    { id: 4, user: "John D.", text: "Is there any extra bus for the outing this Sunday?", time: "12:05 PM", isMe: false },
    { id: 5, user: "Warden Office", text: "Yes, we have added one more bus due to high demand. Check announcements.", time: "12:10 PM", isMe: false, isAdmin: true },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      user: "Alex J. (Me)",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Common Room Chat</h2>
        <p className="text-muted-foreground">The digital hangout for all hostel residents.</p>
      </div>

      <Card className="flex-1 border-none shadow-2xl flex flex-col overflow-hidden bg-white">
        <CardHeader className="border-b bg-primary/5 px-6 py-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">General Room</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> 142 students online
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full px-6 py-8" viewportRef={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={`https://picsum.photos/seed/${msg.user}/40`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                        {msg.user.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`space-y-1 ${msg.isMe ? 'items-end' : ''}`}>
                      <div className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                        msg.isMe 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : msg.isAdmin 
                            ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none font-bold'
                            : 'bg-muted rounded-tl-none text-foreground'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{msg.user}</span>
                        <span className="text-[10px] text-muted-foreground/60">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4 bg-background">
          <form onSubmit={sendMessage} className="w-full flex items-center gap-3">
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Smile className="h-5 w-5" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Paperclip className="h-5 w-5" />
              </Button>
            </div>
            <Input 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 border-muted bg-muted/30 focus-visible:ring-primary h-11"
            />
            <Button type="submit" className="bg-primary h-11 w-11 p-0 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              <Send className="h-5 w-5 text-white" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
