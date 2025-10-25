import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DollarSign, Download, Search, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Deposit {
  id: string;
  attendeeName: string;
  event: string;
  amount: number;
  status: "pending" | "received" | "refunded";
  method: string;
  date: string;
  transactionId: string;
}

const DepositManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");

  // Mock data - in a real app, this would come from Supabase
  const deposits: Deposit[] = [
    {
      id: "1",
      attendeeName: "Sarah Johnson",
      event: "Wine Tasting Evening",
      amount: 25,
      status: "received",
      method: "Credit Card",
      date: "Oct 20, 2025",
      transactionId: "TXN-001-2025",
    },
    {
      id: "2",
      attendeeName: "Michael Chen",
      event: "Wine Tasting Evening",
      amount: 25,
      status: "pending",
      method: "Pending",
      date: "Oct 21, 2025",
      transactionId: "TXN-002-2025",
    },
    {
      id: "3",
      attendeeName: "Emily Davis",
      event: "Cooking Class: Italian Cuisine",
      amount: 35,
      status: "received",
      method: "PayPal",
      date: "Oct 18, 2025",
      transactionId: "TXN-003-2025",
    },
    {
      id: "4",
      attendeeName: "James Wilson",
      event: "Cooking Class: Italian Cuisine",
      amount: 35,
      status: "received",
      method: "Credit Card",
      date: "Oct 22, 2025",
      transactionId: "TXN-004-2025",
    },
    {
      id: "5",
      attendeeName: "Lisa Anderson",
      event: "Sunset Yacht Party",
      amount: 50,
      status: "refunded",
      method: "Credit Card",
      date: "Sep 15, 2025",
      transactionId: "TXN-005-2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "received":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Received
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <AlertCircle className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    const matchesSearch =
      deposit.attendeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = selectedEvent === "all" || deposit.event === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const filterByStatus = (status: string) => {
    if (status === "all") return filteredDeposits;
    return filteredDeposits.filter((d) => d.status === status);
  };

  const totalReceived = deposits
    .filter((d) => d.status === "received")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPending = deposits
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);
  const totalRefunded = deposits
    .filter((d) => d.status === "refunded")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalReceived}</div>
            <p className="text-xs text-muted-foreground">
              {deposits.filter((d) => d.status === "received").length} transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending}</div>
            <p className="text-xs text-muted-foreground">
              {deposits.filter((d) => d.status === "pending").length} awaiting payment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalRefunded}</div>
            <p className="text-xs text-muted-foreground">
              {deposits.filter((d) => d.status === "refunded").length} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deposit Management</CardTitle>
          <CardDescription>Track and manage deposits for your events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Wine Tasting Evening">Wine Tasting Evening</SelectItem>
                <SelectItem value="Cooking Class: Italian Cuisine">Cooking Class: Italian Cuisine</SelectItem>
                <SelectItem value="Sunset Yacht Party">Sunset Yacht Party</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                All ({filteredDeposits.length})
              </TabsTrigger>
              <TabsTrigger value="received">
                Received ({filteredDeposits.filter((d) => d.status === "received").length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({filteredDeposits.filter((d) => d.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="refunded">
                Refunded ({filteredDeposits.filter((d) => d.status === "refunded").length})
              </TabsTrigger>
            </TabsList>

            {["all", "received", "pending", "refunded"].map((status) => (
              <TabsContent key={status} value={status}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Attendee</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filterByStatus(status).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No deposits found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filterByStatus(status).map((deposit) => (
                          <TableRow key={deposit.id}>
                            <TableCell className="font-mono text-sm">
                              {deposit.transactionId}
                            </TableCell>
                            <TableCell className="font-medium">{deposit.attendeeName}</TableCell>
                            <TableCell>{deposit.event}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 font-semibold">
                                <DollarSign className="h-4 w-4" />
                                {deposit.amount}
                              </div>
                            </TableCell>
                            <TableCell>{deposit.method}</TableCell>
                            <TableCell>{deposit.date}</TableCell>
                            <TableCell>{getStatusBadge(deposit.status)}</TableCell>
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
    </div>
  );
};

export default DepositManagement;
