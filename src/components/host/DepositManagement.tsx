import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Download,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
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
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "received":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Received
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
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
    const matchesEvent =
      selectedEvent === "all" || deposit.event === selectedEvent;
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
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Received
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ${totalReceived}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-2">
              {deposits.filter((d) => d.status === "received").length} transactions
              completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              ${totalPending}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-2">
              {deposits.filter((d) => d.status === "pending").length} awaiting
              payment
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-pink-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Refunded
            </CardTitle>
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ${totalRefunded}
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-2">
              {deposits.filter((d) => d.status === "refunded").length} refunded
              transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Deposit Management Section */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <DollarSign className="h-6 w-6 text-primary" />
                Deposit Management
              </CardTitle>
              <CardDescription className="mt-2">
                Track and manage deposits for your events
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11"
              />
            </div>

            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[280px] h-11">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Wine Tasting Evening">
                  Wine Tasting Evening
                </SelectItem>
                <SelectItem value="Cooking Class: Italian Cuisine">
                  Cooking Class: Italian Cuisine
                </SelectItem>
                <SelectItem value="Sunset Yacht Party">
                  Sunset Yacht Party
                </SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="lg" className="shadow-sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
              {[
                { label: "All", value: "all" },
                { label: "Received", value: "received", icon: CheckCircle },
                { label: "Pending", value: "pending", icon: Clock },
                { label: "Refunded", value: "refunded", icon: AlertCircle },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all py-2.5"
                >
                  <div className="flex items-center gap-2">
                    {tab.icon && <tab.icon className="h-3 w-3" />}
                    <span>{tab.label}</span>
                    <Badge variant="secondary" className="ml-1">
                      {filterByStatus(tab.value).length}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {["all", "received", "pending", "refunded"].map((status) => (
              <TabsContent key={status} value={status} className="mt-4">
                <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
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
                          <TableCell
                            colSpan={7}
                            className="text-center text-muted-foreground py-8"
                          >
                            No deposits found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filterByStatus(status).map((deposit) => (
                          <TableRow key={deposit.id}>
                            <TableCell className="font-mono text-sm text-muted-foreground">
                              {deposit.transactionId}
                            </TableCell>
                            <TableCell className="font-semibold">
                              {deposit.attendeeName}
                            </TableCell>
                            <TableCell className="font-medium">
                              {deposit.event}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 font-bold text-lg">
                                <DollarSign className="h-5 w-5" />
                                {deposit.amount}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-medium">
                                {deposit.method}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {deposit.date}
                            </TableCell>
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
