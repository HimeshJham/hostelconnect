
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useSearchParams } from 'next/navigation';
import { ShieldAlert, Send, BadgeCheck, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeComplaint } from '@/ai/flows/analyze-complaint';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData } from '@/components/dashboard-provider';

export default function ComplaintsPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  const isAdmin = role === 'employee';
  const { toast } = useToast();
  const { complaints, addComplaint, updateComplaintStatus } = useDashboardData();

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const analysis = await analyzeComplaint({ complaintDescription: description });
      
      addComplaint({
        category: category === "Other" ? (analysis.suggestedCategories[0] || "Other") : category,
        summary: analysis.summary,
        desc: description,
        status: "Pending",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });

      setSubmitted(true);
      toast({
        title: "Complaint Submitted Anonymously",
        description: "Your feedback has been recorded securely.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your complaint.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = (id: number, newStatus: string) => {
    updateComplaintStatus(id, newStatus);
    toast({
      title: "Status Updated",
      description: `Complaint #${id} is now ${newStatus}.`,
    });
  };

  if (isAdmin) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Anonymous Complaints</h2>
          <p className="text-muted-foreground">Monitor student feedback and address sensitive hostel issues.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {complaints.map((c) => (
            <Card key={c.id} className="border-none shadow-md overflow-hidden bg-white">
              <div className={`h-1.5 ${
                c.status === 'Resolved' ? 'bg-green-500' : 
                c.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
              }`} />
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {c.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {c.status}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium ml-2">{c.date}</span>
                    </div>
                    <CardTitle className="text-xl pt-2">{c.summary}</CardTitle>
                  </div>
                  <Select value={c.status} onValueChange={(v) => handleStatusUpdate(c.id, v)}>
                    <SelectTrigger className="w-[140px] h-9 text-xs font-bold border-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed text-foreground/80">{c.desc}</p>
              </CardContent>
              <CardFooter className="bg-blue-50/50 py-3 flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-bold text-blue-600 uppercase">AI Categorized & Summarized</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Anonymous Feedback</h2>
        <p className="text-muted-foreground">Report issues safely. Your identity is never stored or shown.</p>
      </div>

      {submitted ? (
        <Card className="text-center p-12 shadow-xl border-green-100 bg-white">
          <div className="mx-auto bg-green-100 p-6 rounded-full w-fit mb-6">
            <BadgeCheck className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-4">Complaint Received!</CardTitle>
          <p className="text-muted-foreground mb-8">
            Thank you for helping improve our hostel. We've received your feedback anonymously. 
            Administrators will review it shortly.
          </p>
          <Button onClick={() => { setSubmitted(false); setDescription(""); }} className="bg-primary">
            Submit Another Feedback
          </Button>
        </Card>
      ) : (
        <Card className="shadow-2xl border-none">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Safe Submission Portal</CardTitle>
                <CardDescription>All submissions are processed through our privacy layer.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category">Problem Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-background border-muted text-foreground">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Food Quality">Food Quality</SelectItem>
                    <SelectItem value="Behavior">Behavior</SelectItem>
                    <SelectItem value="Harassment">Harassment</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> AI will automatically categorize your text if left as 'Other'.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Describe the Issue</Label>
                <Textarea 
                  id="description" 
                  placeholder="Tell us what's happening. Please do not include your name or room number if you want to remain truly anonymous." 
                  className="min-h-[200px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg flex gap-3 border border-yellow-100">
                <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
                <p className="text-xs text-yellow-700 leading-relaxed">
                  <strong>Warning:</strong> Intentional false reporting or harassment through this portal is a punishable offense under campus discipline codes.
                </p>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Securely...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Anonymously
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-muted/30 py-4 justify-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              End-to-End Encrypted Submission
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
