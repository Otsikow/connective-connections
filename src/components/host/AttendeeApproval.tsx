import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Clock, User, Mail, Phone, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  event: string;
  eventDate: string;
  depositPaid: boolean;
  depositAmount: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

const AttendeeApproval = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Mock data - in a real app, this would come from Supabase
  const [attendees, setAttendees] = useState<Attendee[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      phone: "+1 555-0123",
      event: "Wine Tasting Evening",
      eventDate: "Oct 28, 2025",
      depositPaid: true,
      depositAmount: 25,
      status: "pending",
      appliedDate: "Oct 20, 2025",
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@email.com",
      phone: "+1 555-0124",
      event: "Wine Tasting Evening",
      eventDate: "Oct 28, 2025",
      depositPaid: false,
      depositAmount: 25,
      status: "pending",
      appliedDate: "Oct 21, 2025",
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily.d@email.com",
      phone: "+1 555-0125",
      event: "Cooking Class: Italian Cuisine",
      eventDate: "Oct 30, 2025",
      depositPaid: true,
      depositAmount: 35,
      status: "approved",
      appliedDate: "Oct 18, 2025",
    },
    {
      id: "4",
      name: "James Wilson",
      email: "james.w@email.com",
      phone: "+1 555-0126",
      event: "Cooking Class: Italian Cuisine",
      eventDate: "Oct 30, 2025",
      depositPaid: true,
      depositAmount: 35,
      status: "pending",
      appliedDate: "Oct 22, 2025",
    },
  ]);

  const handleApprove = (attendeeId: string) => {
    setAttendees(attendees.map(a => 
      a.id === attendeeId ? { ...a, status: "approved" as const } : a
    ));
  };

  const handleReject = (attendeeId: string) => {
    setAttendees(attendees.map(a => 
      a.id === attendeeId ? { ...a, status: "rejected" as const } : a
    ));
  };

  const viewDetails = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setIsDetailsOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"><Clock className="mr-1 h-3 w-3" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20"><Check className="mr-1 h-3 w-3" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><X className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const filterByStatus = (status: string) => {
    if (status === "all") return attendees;
    return attendees.filter(a => a.status === status);
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendee Approval</CardTitle>
          <CardDescription>Review and approve attendees for your events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="wine">Wine Tasting Evening</SelectItem>
                <SelectItem value="cooking">Cooking Class: Italian Cuisine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All ({attendees.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({attendees.filter(a => a.status === "pending").length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({attendees.filter(a => a.status === "approved").length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({attendees.filter(a => a.status === "rejected").length})</TabsTrigger>
            </TabsList>

            {["all", "pending", "approved", "rejected"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="rounded-md border overflow-x-auto">
                  <Table className="min-w-[700px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Attendee</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Deposit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterByStatus(status).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No attendees found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filterByStatus(status).map((attendee) => (
                          <TableRow key={attendee.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage src={attendee.avatar} />
                                  <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{attendee.name}</div>
                                  <div className="text-sm text-muted-foreground">{attendee.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{attendee.event}</div>
                                <div className="text-sm text-muted-foreground">{attendee.eventDate}</div>
                              </div>
                            </TableCell>
                            <TableCell>{attendee.appliedDate}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {attendee.depositPaid ? (
                                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                    <DollarSign className="mr-1 h-3 w-3" />
                                    ${attendee.depositAmount} Paid
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                                    <DollarSign className="mr-1 h-3 w-3" />
                                    ${attendee.depositAmount} Pending
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(attendee.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => viewDetails(attendee)}
                                >
                                  View
                                </Button>
                                {attendee.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700"
                                      onClick={() => handleApprove(attendee.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleReject(attendee.id)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendee Details</DialogTitle>
            <DialogDescription>Complete information about the applicant</DialogDescription>
          </DialogHeader>
          {selectedAttendee && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedAttendee.avatar} />
                  <AvatarFallback className="text-lg">{getInitials(selectedAttendee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedAttendee.name}</h3>
                  {getStatusBadge(selectedAttendee.status)}
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedAttendee.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedAttendee.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Applied on {selectedAttendee.appliedDate}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Event Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-medium">{selectedAttendee.event}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedAttendee.eventDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit:</span>
                    <span className="font-medium">${selectedAttendee.depositAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="font-medium">
                      {selectedAttendee.depositPaid ? (
                        <span className="text-green-600">Paid</span>
                      ) : (
                        <span className="text-red-600">Pending</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {selectedAttendee.status === "pending" && (
                <div className="flex gap-2 border-t pt-4">
                  <Button
                    className="flex-1"
                    variant="default"
                    onClick={() => {
                      handleApprove(selectedAttendee.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedAttendee.id);
                      setIsDetailsOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendeeApproval;
