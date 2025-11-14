import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Deposit {
  id: string;
  event: string;
  host: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "refunded";
}

const DepositManagement = () => {
  const [filter, setFilter] = useState("all");

  const deposits: Deposit[] = [
    {
      id: "1",
      event: "Wine Tasting Evening",
      host: "Sarah Johnson",
      date: "Oct 20, 2025",
      amount: 250,
      status: "paid",
    },
    {
      id: "2",
      event: "Cooking Class: Italian Cuisine",
      host: "Michael Chen",
      date: "Oct 21, 2025",
      amount: 350,
      status: "pending",
    },
    {
      id: "3",
      event: "Hiking Trip",
      host: "James Wilson",
      date: "Oct 22, 2025",
      amount: 150,
      status: "refunded",
    },
  ];

  const getStatusBadge = (status: Deposit["status"]) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <DollarSign className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-[hsl(var(--highlight-text))] hover:bg-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">
            <TrendingDown className="mr-1 h-3 w-3" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredDeposits =
    filter === "all"
      ? deposits
      : deposits.filter((d) => d.status === filter);

  const totalEarnings = deposits
    .filter((d) => d.status === "paid")
    .reduce((sum, d) => sum + d.amount, 0);

  const pendingTotal = deposits
    .filter((d) => d.status === "pending")
    .reduce((sum, d) => sum + d.amount, 0);

  const refundedTotal = deposits
    .filter((d) => d.status === "refunded")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <DollarSign className="h-6 w-6 text-primary" />
                Deposit Management
              </CardTitle>
              <CardDescription className="mt-2">
                Manage deposits, payouts, and refunds
              </CardDescription>
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[220px] h-11">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deposits</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-green-500/5 border border-green-500/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-green-700 text-sm">Total Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-700">${totalEarnings}</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-500/5 border border-yellow-500/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[hsl(var(--highlight-text))] text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-[hsl(var(--highlight-text))]">${pendingTotal}</p>
              </CardContent>
            </Card>
            <Card className="bg-red-500/5 border border-red-500/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-700 text-sm">Refunded</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-700">${refundedTotal}</p>
              </CardContent>
            </Card>
          </div>

          {/* Deposits Table */}
          <div className="rounded-lg border border-border/50 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                      No deposits found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell>{deposit.event}</TableCell>
                      <TableCell>{deposit.host}</TableCell>
                      <TableCell>{deposit.date}</TableCell>
                      <TableCell>${deposit.amount}</TableCell>
                      <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary/10"
                        >
                          <Calendar className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepositManagement;
