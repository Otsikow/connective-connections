import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, Star, Calendar } from "lucide-react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");

  // Mock data for earnings over time
  const earningsData = [
    { month: "May", earnings: 3200, events: 8 },
    { month: "Jun", earnings: 3800, events: 10 },
    { month: "Jul", earnings: 4200, events: 11 },
    { month: "Aug", earnings: 3900, events: 9 },
    { month: "Sep", earnings: 4500, events: 12 },
    { month: "Oct", earnings: 4850, events: 12 },
  ];

  // Mock data for attendance rate
  const attendanceData = [
    { event: "Wine Tasting", attended: 22, registered: 25, rate: 88 },
    { event: "Cooking Class", attended: 18, registered: 20, rate: 90 },
    { event: "Yacht Party", attended: 45, registered: 50, rate: 90 },
    { event: "Art Gallery", attended: 28, registered: 30, rate: 93 },
    { event: "Hiking Trip", attended: 15, registered: 20, rate: 75 },
  ];

  // Mock data for ratings distribution
  const ratingsData = [
    { rating: "5 Stars", count: 145, percentage: 58 },
    { rating: "4 Stars", count: 75, percentage: 30 },
    { rating: "3 Stars", count: 20, percentage: 8 },
    { rating: "2 Stars", count: 7, percentage: 3 },
    { rating: "1 Star", count: 3, percentage: 1 },
  ];

  // Mock data for event type distribution
  const eventTypeData = [
    { name: "Social", value: 35 },
    { name: "Learning", value: 25 },
    { name: "Outdoor", value: 20 },
    { name: "Entertainment", value: 20 },
  ];

  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

  const calculateTrend = (data: any[], key: string) => {
    const current = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  const earningsTrend = calculateTrend(earningsData, "earnings");
  const avgAttendanceRate =
    attendanceData.reduce((sum, item) => sum + item.rate, 0) / attendanceData.length;
  const avgRating =
    ratingsData.reduce((sum, item, index) => sum + (5 - index) * item.count, 0) /
    ratingsData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Analytics Dashboard
              </h2>
              <p className="text-muted-foreground mt-1">Track your performance metrics and insights</p>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 3 months</SelectItem>
                <SelectItem value="year">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${earningsData[earningsData.length - 1].earnings}</div>
            <div className="flex items-center text-xs text-green-600 font-medium mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{earningsTrend.toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgAttendanceRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600 font-medium mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgRating.toFixed(1)}/5.0</div>
            <div className="flex items-center text-xs text-green-600 font-medium mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{earningsData[earningsData.length - 1].events}</div>
            <div className="flex items-center text-xs text-muted-foreground font-medium mt-2">
              Same as last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Earnings Over Time
              </CardTitle>
              <CardDescription className="mt-1">Your monthly revenue from events</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", r: 4 }}
                name="Earnings ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Attendance Rate Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Attendance Rate by Event
            </CardTitle>
            <CardDescription className="mt-1">Percentage of confirmed attendees who showed up</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="event" className="text-xs" angle={-45} textAnchor="end" height={100} />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === "rate") return [`${value}%`, "Attendance Rate"];
                    return [value, name];
                  }}
                />
                <Bar dataKey="rate" fill="#10b981" radius={[4, 4, 0, 0]} name="Attendance Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Type Distribution */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Event Type Distribution
            </CardTitle>
            <CardDescription className="mt-1">Breakdown of your events by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ratings Distribution */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Ratings Distribution
          </CardTitle>
          <CardDescription className="mt-1">How attendees have rated your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratingsData.map((rating) => (
              <div key={rating.rating} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{rating.rating}</span>
                  <span className="text-muted-foreground">
                    {rating.count} ratings ({rating.percentage}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="border-border/50 shadow-sm bg-gradient-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Summary
          </CardTitle>
          <CardDescription className="mt-1">Key insights from your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center ring-4 ring-green-500/10">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-lg">Strong Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Your earnings have increased by {earningsTrend.toFixed(1)}% this month. Keep up the
                  great work!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center ring-4 ring-blue-500/10">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-lg">High Attendance</h4>
                <p className="text-sm text-muted-foreground">
                  Your average attendance rate of {avgAttendanceRate.toFixed(1)}% is excellent. Attendees
                  are consistently showing up to your events.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors">
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center ring-4 ring-yellow-500/10">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1 text-lg">Excellent Ratings</h4>
                <p className="text-sm text-muted-foreground">
                  With an average rating of {avgRating.toFixed(1)}/5.0, your events are highly rated.{" "}
                  {ratingsData[0].percentage}% of attendees gave you 5 stars!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
