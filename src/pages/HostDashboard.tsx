import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Calendar, Users, DollarSign, BarChart3 } from "lucide-react";
import EventManagement from "@/components/host/EventManagement";
import AttendeeApproval from "@/components/host/AttendeeApproval";
import DepositManagement from "@/components/host/DepositManagement";
import Analytics from "@/components/host/Analytics";

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
  const [activeTab, setActiveTab] = useState("overview");
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    location: "",
    capacity: "",
    deposit: "",
    type: "in_person",
  });

  const queryClient = useQueryClient();
  const { data: pendingApprovals = [
    { id: 1, user: "User #1", event: "Coffee & Chat" },
    { id: 2, user: "User #2", event: "Coffee & Chat" },
  ] } = useQuery({
    queryKey: ["host", "approvals"],
    queryFn: async () => [
      { id: 1, user: "User #1", event: "Coffee & Chat" },
      { id: 2, user: "User #2", event: "Coffee & Chat" },
    ],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["host", "approvals"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: number) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["host", "approvals"] }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-6">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold">Host Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage events, attendees, deposits, and performance analytics.
        </p>
      </div>

      <div className="px-6 pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap gap-2 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Section */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,850</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your most common host tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <button
                  onClick={() => setActiveTab("events")}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Create New Event</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span className="font-medium">Review Attendees</span>
                  </div>
                </button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Section */}
          <TabsContent value="events">
            <EventManagement />
          </TabsContent>

          {/* Attendees Section */}
          <TabsContent value="attendees">
            <AttendeeApproval />
          </TabsContent>

          {/* Deposits Section */}
          <TabsContent value="deposits">
            <DepositManagement />
          </TabsContent>

          {/* Analytics Section */}
          <TabsContent value="analytics">
            <Analytics />
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Attendance Rate</h2>
                  <ChartContainer
                    config={{ attendance: { label: "Attendance", color: "hsl(var(--primary))" } }}
                    className="h-64"
                  >
                    <AreaChart data={mockAttendance}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area
                        dataKey="attendance"
                        type="natural"
                        fill="var(--color-attendance)"
                        stroke="var(--color-attendance)"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">Earnings</h2>
                  <ChartContainer
                    config={{ earnings: { label: "Earnings", color: "hsl(var(--primary))" } }}
                    className="h-64"
                  >
                    <AreaChart data={mockEarnings}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area
                        dataKey="earnings"
                        type="natural"
                        fill="var(--color-earnings)"
                        stroke="var(--color-earnings)"
                        fillOpacity={0.2}
                      />
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
