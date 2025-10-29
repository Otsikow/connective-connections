import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { LucideIcon } from "lucide-react";
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  User,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Crown,
  Sparkles,
  X,
  ShieldCheck,
  PhoneCall,
  Navigation,
  AlertTriangle,
} from "lucide-react";
import BackButton from "@/components/BackButton";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumReminder, setShowPremiumReminder] = useState(true);

  const premiumBenefits = [
    {
      title: "Priority matching",
      description: "Be featured to the most compatible connections first.",
    },
    {
      title: "Unlimited introductions",
      description: "Start as many conversations as you like every day.",
    },
    {
      title: "Exclusive experiences",
      description: "Unlock premium-only events and curated community drops.",
    },
  ];

  const matches = [
    { name: "Jessica", age: 28, interests: "Hiking, Painting", avatar: "/placeholder.svg", distance: "2 miles away" },
    { name: "Alex", age: 26, interests: "Music, Traveling", avatar: "/placeholder.svg", distance: "1.5 miles away" },
    { name: "Sarah", age: 30, interests: "Yoga, Photography", avatar: "/placeholder.svg", distance: "3 miles away" },
    { name: "Michael", age: 29, interests: "Gaming, Cooking", avatar: "/placeholder.svg", distance: "2.5 miles away" },
    { name: "Emma", age: 27, interests: "Reading, Dancing", avatar: "/placeholder.svg", distance: "4 miles away" },
  ];

  const events = [
    {
      id: "1",
      title: "Coffee & Chat",
      date: "Sat, Nov 25",
      time: "10:00 AM",
      location: "The Grind Café",
      attendees: 12,
      image: "/event-placeholder.svg",
    },
    {
      id: "2",
      title: "Book Club",
      date: "Sun, Nov 26",
      time: "3:00 PM",
      location: "Central Library",
      attendees: 8,
      image: "/event-placeholder.svg",
    },
    {
      id: "3",
      title: "Sunrise Hike",
      date: "Mon, Nov 27",
      time: "6:00 AM",
      location: "Ridge Trailhead",
      attendees: 15,
      image: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Art Workshop",
      date: "Tue, Nov 28",
      time: "2:00 PM",
      location: "Community Center",
      attendees: 10,
      image: "/placeholder.svg",
    },
  ];

  const communities = [
    {
      name: "Board Game Enthusiasts",
      description: "From Catan to modern classics.",
      members: "1.2k members",
      image: "/community-placeholder.svg",
    },
    {
      name: "Local Foodies",
      description: "Exploring the best eats in town.",
      members: "2.5k members",
      image: "/community-placeholder.svg",
    },
    {
      name: "Creative Writers Circle",
      description: "Share your stories and get feedback.",
      members: "850 members",
      image: "/community-placeholder.svg",
    },
    {
      name: "City Runners",
      description: "Weekly 5k and training tips.",
      members: "3.1k members",
      image: "/placeholder.svg",
    },
    {
      name: "Photography Club",
      description: "Capture moments and learn together.",
      members: "1.8k members",
      image: "/placeholder.svg",
    },
  ];

  const safetyTips: { icon: LucideIcon; title: string; description: string }[] = [
    {
      icon: ShieldCheck,
      title: "Meet in public",
      description: "Choose busy, well-lit public places for the first few meetups.",
    },
    {
      icon: PhoneCall,
      title: "Share your plans",
      description: "Let a trusted friend know who you're meeting and when you'll be back.",
    },
    {
      icon: Navigation,
      title: "Plan your own ride",
      description: "Use your own transportation so you can leave whenever you need to.",
    },
    {
      icon: AlertTriangle,
      title: "Trust your instincts",
      description: "If something feels off, step away and report the behavior to our team.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-28">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <BackButton fallbackPath="/" size="icon" className="h-10 w-10" />
          <h1 className="text-xl font-bold">Connective</h1>
          <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search interests, events, or people…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-muted border-0"
          />
        </div>
      </div>

      {/* Premium Banner */}
      {showPremiumReminder && (
        <div className="px-4 sm:px-6 pt-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-r from-[#3b1d59] via-[#5b2c83] to-[#8c4fcf] text-white shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_55%)]" />
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs uppercase tracking-wide">
                      Premium Perks
                    </Badge>
                    <Crown className="h-5 w-5 text-amber-200" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Elevate your connections experience
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 mt-1">
                    Subscribe to unlock the full suite of features designed to help you find meaningful relationships faster.
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {premiumBenefits.map((benefit) => (
                      <li key={benefit.title} className="flex items-start gap-2 text-sm text-white/80">
                        <Sparkles className="mt-1 h-4 w-4 flex-shrink-0 text-amber-200" />
                        <span>
                          <span className="font-semibold text-white">{benefit.title}:</span> {benefit.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Button
                    size="lg"
                    className="bg-white text-[#3b1d59] hover:bg-white/90 rounded-full px-6"
                    onClick={() => navigate("/profile")}
                  >
                    Explore Premium
                  </Button>
                  <button
                    onClick={() => setShowPremiumReminder(false)}
                    className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white sm:text-sm"
                  >
                    <X className="h-3.5 w-3.5" /> Dismiss reminder
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="matches" className="w-full px-4 sm:px-6 py-6 space-y-6">
        <TabsList className="w-full grid grid-cols-3 h-11 bg-muted rounded-full">
          <TabsTrigger value="matches" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">Matches</TabsTrigger>
          <TabsTrigger value="groups" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">Groups</TabsTrigger>
          <TabsTrigger value="events" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">Events</TabsTrigger>
        </TabsList>

        {/* Content for matches, groups, events — unchanged */}
        {/* (Keep same as before — matches carousel, groups list, events cards) */}
      </Tabs>

      {/* Safety Tips */}
      <section className="px-4 sm:px-6 pb-32">
        <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8B956]/15 text-[#E8B956]">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Safety tips for meeting up</h2>
              <p className="text-sm text-muted-foreground">
                Keep these guidelines in mind whenever you plan to meet someone in person.
              </p>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <li key={index} className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8B956]/10 text-[#E8B956]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Floating Button */}
      <Button
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-lg flex items-center gap-2 h-12 sm:h-auto px-4 sm:px-6 text-sm sm:text-base"
        onClick={() => navigate("/host/create-event")}
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">Host Event</span>
        <span className="xs:hidden">Host</span>
      </Button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-6 py-3 flex items-center justify-around z-10">
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <HomeIcon size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/events")}>
          <CalendarIcon size={24} />
          <span className="text-xs">Events</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/messages")}>
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/community")}>
          <Users size={24} />
          <span className="text-xs">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/profile")}>
          <User size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;
