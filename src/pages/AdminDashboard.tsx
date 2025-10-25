import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, DollarSign, Star, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  maxAttendees: number;
  currentAttendees: number;
  status: 'draft' | 'published' | 'completed';
  depositRequired: boolean;
  depositAmount: number;
  totalEarnings: number;
  rating: number;
  attendanceRate: number;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  depositPaid: boolean;
  joinedAt: string;
}

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Weekend Hiking Adventure',
      date: '2024-01-15',
      location: 'Mountain Trail Park',
      maxAttendees: 20,
      currentAttendees: 15,
      status: 'published',
      depositRequired: true,
      depositAmount: 25,
      totalEarnings: 375,
      rating: 4.8,
      attendanceRate: 85
    },
    {
      id: '2',
      title: 'City Food Tour',
      date: '2024-01-20',
      location: 'Downtown District',
      maxAttendees: 12,
      currentAttendees: 8,
      status: 'published',
      depositRequired: true,
      depositAmount: 15,
      totalEarnings: 120,
      rating: 4.6,
      attendanceRate: 67
    }
  ]);

  const [attendees, setAttendees] = useState<Attendee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      status: 'pending',
      depositPaid: false,
      joinedAt: '2024-01-10'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      status: 'approved',
      depositPaid: true,
      joinedAt: '2024-01-09'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    maxAttendees: '',
    depositRequired: false,
    depositAmount: ''
  });

  const handleCreateEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      location: newEvent.location,
      maxAttendees: parseInt(newEvent.maxAttendees),
      currentAttendees: 0,
      status: 'draft',
      depositRequired: newEvent.depositRequired,
      depositAmount: parseFloat(newEvent.depositAmount) || 0,
      totalEarnings: 0,
      rating: 0,
      attendanceRate: 0
    };
    setEvents([...events, event]);
    setNewEvent({ title: '', date: '', location: '', maxAttendees: '', depositRequired: false, depositAmount: '' });
  };

  const handleApproveAttendee = (attendeeId: string) => {
    setAttendees(attendees.map(attendee => 
      attendee.id === attendeeId 
        ? { ...attendee, status: 'approved' as const }
        : attendee
    ));
  };

  const handleRejectAttendee = (attendeeId: string) => {
    setAttendees(attendees.map(attendee => 
      attendee.id === attendeeId 
        ? { ...attendee, status: 'rejected' as const }
        : attendee
    ));
  };

  const totalEarnings = events.reduce((sum, event) => sum + event.totalEarnings, 0);
  const averageRating = events.reduce((sum, event) => sum + event.rating, 0) / events.length;
  const totalAttendees = events.reduce((sum, event) => sum + event.currentAttendees, 0);
  const averageAttendanceRate = events.reduce((sum, event) => sum + event.attendanceRate, 0) / events.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your events and track analytics</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalEarnings}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Based on {events.length} events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAttendees}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageAttendanceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Average across events</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Event Management</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new event.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        placeholder="Enter location"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxAttendees">Max Attendees</Label>
                      <Input
                        id="maxAttendees"
                        type="number"
                        value={newEvent.maxAttendees}
                        onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                        placeholder="Enter max attendees"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                      <Input
                        id="depositAmount"
                        type="number"
                        value={newEvent.depositAmount}
                        onChange={(e) => setNewEvent({...newEvent, depositAmount: e.target.value})}
                        placeholder="Enter deposit amount"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateEvent} className="w-full">
                    Create Event
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {event.date} • {event.location}
                        </CardDescription>
                      </div>
                      <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Attendees</p>
                        <p className="text-lg font-semibold">{event.currentAttendees}/{event.maxAttendees}</p>
                        <Progress value={(event.currentAttendees / event.maxAttendees) * 100} className="mt-1" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Earnings</p>
                        <p className="text-lg font-semibold">${event.totalEarnings}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-lg font-semibold">{event.rating}/5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Attendance Rate</p>
                        <p className="text-lg font-semibold">{event.attendanceRate}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-6">
            <h2 className="text-2xl font-semibold">Attendee Management</h2>
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve event attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Deposit</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendees.map((attendee) => (
                      <TableRow key={attendee.id}>
                        <TableCell className="font-medium">{attendee.name}</TableCell>
                        <TableCell>{attendee.email}</TableCell>
                        <TableCell>
                          <Badge variant={attendee.status === 'approved' ? 'default' : 'secondary'}>
                            {attendee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={attendee.depositPaid ? 'default' : 'destructive'}>
                            {attendee.depositPaid ? 'Paid' : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>{attendee.joinedAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApproveAttendee(attendee.id)}
                              disabled={attendee.status === 'approved'}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectAttendee(attendee.id)}
                              disabled={attendee.status === 'rejected'}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                  <CardDescription>Overview of your events' performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{events.length}</div>
                      <p className="text-sm text-gray-600">Total Events</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{totalAttendees}</div>
                      <p className="text-sm text-gray-600">Total Attendees</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">${totalEarnings}</div>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Performance of your recent events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-lg font-semibold">{event.attendanceRate}%</div>
                            <p className="text-xs text-gray-600">Attendance</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">{event.rating}/5</div>
                            <p className="text-xs text-gray-600">Rating</p>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold">${event.totalEarnings}</div>
                            <p className="text-xs text-gray-600">Earnings</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
