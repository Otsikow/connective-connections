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
import { 
  Calendar, 
  Users, 
  DollarSign, 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventManagement from "@/components/host/EventManagement";
import AttendeeApproval from "@/components/host/AttendeeApproval";
import DepositManagement from "@/components/host/DepositManagement";
import Analytics from "@/components/host/Analytics";
import { Badge } from "@/components/ui/badge";

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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-8">
      {/* Professional Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <Crown className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Host Dashboard
                    </h1>
                    <Badge variant="outline" className="border-primary/50 text-primary font-medium">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage your events and grow your community
                  </p>
                </div>
              </div>
            </div>
            <Button variant="default" size="lg" className="shadow-md">
              <Calendar className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 max-w-[1600px] mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8 h-auto p-1 bg-muted/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Events</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="attendees" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Attendees</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="deposits" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Deposits</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Overview Section */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">+2 from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Attendees</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">248</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">+18% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$4,850</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">+12% from last month</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.8</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600 font-medium">+0.2 from last month</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Approvals</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Upcoming Events</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Deposits</p>
                      <p className="text-2xl font-bold">$125</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Manage your most common host tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => setActiveTab("events")}
                  className="group flex items-center gap-3 p-5 rounded-xl border-2 border-border/50 bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">New Event</span>
                    <span className="text-xs text-muted-foreground">Create event</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("attendees")}
                  className="group flex items-center gap-3 p-5 rounded-xl border-2 border-border/50 bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 flex items-center justify-center transition-colors">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Attendees</span>
                    <span className="text-xs text-muted-foreground">Review & approve</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("deposits")}
                  className="group flex items-center gap-3 p-5 rounded-xl border-2 border-border/50 bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 flex items-center justify-center transition-colors">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Deposits</span>
                    <span className="text-xs text-muted-foreground">Track payments</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("analytics")}
                  className="group flex items-center gap-3 p-5 rounded-xl border-2 border-border/50 bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="h-12 w-12 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 flex items-center justify-center transition-colors">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold block">Analytics</span>
                    <span className="text-xs text-muted-foreground">View insights</span>
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
