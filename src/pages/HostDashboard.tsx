import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const mockAttendance = [
  { month: "Jan", attendance: 42 },
  { month: "Feb", attendance: 48 },
  { month: "Mar", attendance: 51 },
  { month: "Apr", attendance: 62 },
  { month: "May", attendance: 58 },
  { month: "Jun", attendance: 70 },
];

const mockEarnings = [
  { month: "Jan", earnings: 320 },
  { month: "Feb", earnings: 480 },
  { month: "Mar", earnings: 520 },
  { month: "Apr", earnings: 740 },
  { month: "May", earnings: 680 },
  { month: "Jun", earnings: 910 },
];

const HostDashboard = () => {
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    deposit: "",
    type: "in_person",
  });

  // Placeholder React Query hooks (stubbed)
  const queryClient = useQueryClient();
  const { data: pendingApprovals = [
    { id: 1, user: "User #1", event: "Coffee & Chat" },
    { id: 2, user: "User #2", event: "Coffee & Chat" },
  ] } = useQuery({
    queryKey: ["host", "approvals"],
    queryFn: async () => {
      // Replace with supabase query later
      return [
        { id: 1, user: "User #1", event: "Coffee & Chat" },
        { id: 2, user: "User #2", event: "Coffee & Chat" },
      ];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      // Replace with supabase update later
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["host", "approvals"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      // Replace with supabase update later
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["host", "approvals"] }),
  });

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">Host Dashboard</h1>
        <p className="text-sm text-muted-foreground">Create events, approve attendees, manage deposits, and view analytics.</p>
      </div>

      <div className="px-6 pt-6">
        <Tabs defaultValue="events">
          <TabsList className="mb-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold">Create Event</h2>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="Coffee & Chat" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date & Time</Label>
                      <Input id="date" type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="The Grind Café" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input id="capacity" type="number" placeholder="20" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="deposit">Deposit ($)</Label>
                        <Input id="deposit" type="number" placeholder="10" value={eventForm.deposit} onChange={(e) => setEventForm({ ...eventForm, deposit: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={eventForm.type} onValueChange={(v) => setEventForm({ ...eventForm, type: v })}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_person">In-person</SelectItem>
                          <SelectItem value="virtual">Virtual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full rounded-full bg-primary" onClick={() => alert("Stub: create event")}>Create Event</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Your Events</h2>
                  <div className="space-y-4">
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center justify-between border rounded-lg p-4">
                        <div>
                          <p className="font-medium">Coffee & Chat #{i}</p>
                          <p className="text-sm text-muted-foreground">Sat, 10:00 AM · 18/24 attending</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline">Edit</Button>
                          <Button variant="destructive">Cancel</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="approvals">
            <Card className="border-border">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Pending Approvals</h2>
                <div className="space-y-3">
                  {pendingApprovals.map((row) => (
                    <div key={row.id} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{row.user}</p>
                        <p className="text-sm text-muted-foreground">Requested to join {row.event}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => rejectMutation.mutate(row.id)}>Reject</Button>
                        <Button onClick={() => approveMutation.mutate(row.id)}>Approve</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deposits">
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Deposits</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Held Deposits</p>
                    <p className="text-2xl font-bold">$420</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Released This Month</p>
                    <p className="text-2xl font-bold">$390</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1,2,3].map((i) => (
                    <div key={i} className="flex items-center justify-between border rounded-lg p-4">
                      <div>
                        <p className="font-medium">Deposit #{i} · $10</p>
                        <p className="text-sm text-muted-foreground">Coffee & Chat · Jane D.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Refund</Button>
                        <Button>Release</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Attendance Rate</h2>
                  <p className="text-sm text-muted-foreground mb-4">Percent of RSVPs that attended</p>
                  <ChartContainer
                    config={{ attendance: { label: "Attendance", color: "hsl(var(--primary))" } }}
                    className="h-64"
                  >
                    <AreaChart data={mockAttendance}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area dataKey="attendance" type="natural" fill="var(--color-attendance)" stroke="var(--color-attendance)" fillOpacity={0.2} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Earnings</h2>
                  <p className="text-sm text-muted-foreground mb-4">Total earnings from deposits</p>
                  <ChartContainer
                    config={{ earnings: { label: "Earnings", color: "hsl(var(--primary))" } }}
                    className="h-64"
                  >
                    <AreaChart data={mockEarnings}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area dataKey="earnings" type="natural" fill="var(--color-earnings)" stroke="var(--color-earnings)" fillOpacity={0.2} />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;
