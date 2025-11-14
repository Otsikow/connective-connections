import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Plus,
  Star,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import VideoRecorder from "@/components/VideoRecorder";

const HostDashboard = () => {
  const navigate = useNavigate();
  usePageTitle("Host Dashboard");

  const stats = [
    {
      title: "Total Events",
      value: 14,
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      change: "+2 this month",
    },
    {
      title: "Total Attendees",
      value: 238,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      change: "+18 new signups",
    },
    {
      title: "Total Earnings",
      value: "$4,820",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      change: "+12% vs last month",
    },
    {
      title: "Average Rating",
      value: "4.7 / 5",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      change: "Based on 124 reviews",
    },
  ];

  const recentEvents = [
    {
      id: 1,
      title: "Wine Tasting Evening",
      date: "Oct 18, 2025",
      attendees: 24,
      earnings: "$580",
      status: "Completed",
    },
    {
      id: 2,
      title: "Cooking Class: Italian Cuisine",
      date: "Oct 21, 2025",
      attendees: 16,
      earnings: "$400",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Morning Yoga & Meditation",
      date: "Nov 3, 2025",
      attendees: 12,
      earnings: "$250",
      status: "Upcoming",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BackButton
              fallbackPath="/home"
              ariaLabel="Go back"
            />
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              Host Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground mt-1">
            Overview of your events, performance, and earnings
          </p>
        </div>
        <Button
          className="rounded-full bg-primary text-white hover:bg-primary/80 dark:text-black gap-2"
          onClick={() => navigate("/host/create-experience")}
        >
          <Plus className="h-4 w-4" /> Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className={`h-1 bg-gradient-to-r ${stat.color}`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Recent Events
          </CardTitle>
          <CardDescription>Manage your latest hosted events</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-left border-t border-border/50">
            <thead className="bg-muted/30">
              <tr className="text-muted-foreground">
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Attendees</th>
                <th className="px-4 py-3 font-medium">Earnings</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event, i) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-muted/10"
                >
                  <td className="px-4 py-3 font-semibold">{event.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{event.date}</td>
                  <td className="px-4 py-3">{event.attendees}</td>
                  <td className="px-4 py-3 font-medium text-green-600">
                    {event.earnings}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        event.status === "Upcoming" ? "secondary" : "outline"
                      }
                      className={
                        event.status === "Completed"
                          ? "text-green-600 bg-green-500/10"
                          : "text-[hsl(var(--highlight-text))] bg-yellow-500/10"
                      }
                    >
                      {event.status}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Record a Video Message
          </CardTitle>
          <CardDescription>
            Record a video message for your attendees.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VideoRecorder />
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-background shadow-sm">
        <CardContent className="p-6 text-center space-y-4">
          <h3 className="text-xl font-semibold">Ready to Host Your Next Event?</h3>
          <p className="text-muted-foreground text-sm">
            Create an event and start earning today — share your passion with others.
          </p>
          <Button
            className="rounded-full bg-primary text-white hover:bg-primary/80 dark:text-black"
            onClick={() => navigate("/host/create-event")}
          >
            Create New Event
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HostDashboard;
