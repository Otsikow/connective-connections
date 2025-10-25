import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Calendar as CalendarIcon, MapPin, DollarSign, Users, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  deposit: number;
  attendees: number;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

const EventManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    capacity: "",
    deposit: "",
  });

  // Mock data - in a real app, this would come from Supabase
  const [events] = useState<Event[]>([
    {
      id: "1",
      title: "Wine Tasting Evening",
      description: "An exclusive wine tasting event featuring premium selections",
      date: new Date(2025, 10, 28),
      location: "Downtown Wine Bar",
      capacity: 30,
      deposit: 25,
      attendees: 22,
      status: "upcoming",
    },
    {
      id: "2",
      title: "Cooking Class: Italian Cuisine",
      description: "Learn to make authentic Italian pasta from scratch",
      date: new Date(2025, 10, 30),
      location: "Culinary Studio",
      capacity: 20,
      deposit: 35,
      attendees: 18,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Sunset Yacht Party",
      description: "Enjoy the sunset with music and cocktails on the bay",
      date: new Date(2025, 9, 15),
      location: "Marina Bay",
      capacity: 50,
      deposit: 50,
      attendees: 45,
      status: "completed",
    },
  ]);

  const handleCreateEvent = () => {
    // In a real app, this would submit to Supabase
    console.log("Creating event:", { ...formData, date });
    setIsCreateDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      location: "",
      capacity: "",
      deposit: "",
    });
    setDate(undefined);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "ongoing":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "completed":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calendar className="h-6 w-6 text-primary" />
              Event Management
            </CardTitle>
            <CardDescription className="mt-2">Create and manage your hosted events</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-md">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new event for your attendees
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-5 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Wine Tasting Evening"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what makes your event special..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Event Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-semibold">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown Wine Bar"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity" className="text-sm font-semibold">Max Capacity *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deposit" className="text-sm font-semibold">Deposit Amount ($) *</Label>
                    <Input
                      id="deposit"
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.deposit}
                      onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} size="lg">
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} size="lg" className="shadow-md">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Attendees</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div>
                        <div className="font-semibold text-base">{event.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {event.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {format(event.date, "MMM dd, yyyy")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {event.attendees}/{event.capacity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        ${event.deposit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(event.status) + " font-medium"}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventManagement;
