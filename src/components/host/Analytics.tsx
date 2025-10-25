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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Track your performance metrics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData[earningsData.length - 1].earnings}</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{earningsTrend.toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAttendanceRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}/5.0</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +0.2 from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsData[earningsData.length - 1].events}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              Same as last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Over Time</CardTitle>
          <CardDescription>Your monthly revenue from events</CardDescription>
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Attendance Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate by Event</CardTitle>
            <CardDescription>Percentage of confirmed attendees who showed up</CardDescription>
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
        <Card>
          <CardHeader>
            <CardTitle>Event Type Distribution</CardTitle>
            <CardDescription>Breakdown of your events by category</CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Ratings Distribution</CardTitle>
          <CardDescription>How attendees have rated your events</CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key insights from your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Strong Growth</h4>
                <p className="text-sm text-muted-foreground">
                  Your earnings have increased by {earningsTrend.toFixed(1)}% this month. Keep up the
                  great work!
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">High Attendance</h4>
                <p className="text-sm text-muted-foreground">
                  Your average attendance rate of {avgAttendanceRate.toFixed(1)}% is excellent. Attendees
                  are consistently showing up to your events.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Excellent Ratings</h4>
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
