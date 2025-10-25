import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home as HomeIcon, MessageSquare, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

const Home = () => {
  const navigate = useNavigate();

  const matches = [
    { name: "Jessica", interests: "Hiking, Painting", avatar: "/images/avatars/avatar-1.svg" },
    { name: "Alex", interests: "Music, Traveling", avatar: "/images/avatars/avatar-2.svg" },
  ];

  const events = [
    {
      title: "Coffee & Chat",
      date: "Sat, Nov 25, 10:00 AM",
      location: "The Grind Café",
      image: "/images/events/event-1.svg",
    },
    {
      title: "Book Club",
      date: "Sun, Nov 26, 3:00 PM",
      location: "Central Library",
      image: "/images/events/event-2.svg",
    },
  ];

  const communities = [
    {
      name: "Board Game Enthusiasts",
      description: "From Catan to modern classics.",
      members: "1.2k members",
      image: "/images/groups/group-1.svg",
    },
    {
      name: "Local Foodies",
      description: "Exploring the best eats in town.",
      members: "2.5k members",
      image: "/images/groups/group-2.svg",
    },
    {
      name: "Creative Writers Circle",
      description: "Share your stories and get feedback.",
      members: "850 members",
      image: "/images/groups/group-3.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <h1 className="text-xl font-bold">Connective</h1>
        </div>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src="/images/avatars/avatar-1.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Your Matches */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Matches</h2>
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match, index) => (
              <Card key={index} className="border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/matches")}>
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-3">
                    <AvatarImage src={match.avatar} />
                    <AvatarFallback>{match.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{match.name}</h3>
                  <p className="text-sm text-muted-foreground">{match.interests}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map((event, index) => (
              <Card key={index} className="border-border overflow-hidden">
                <img src={event.image} alt={event.title} className="h-40 w-full object-cover" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
                  <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
                  <Button className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
                    Join
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Discover Communities */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Discover Communities</h2>
          <div className="space-y-3">
            {communities.map((community, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4 flex items-center gap-4">
                  <img src={community.image} alt={community.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{community.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {community.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{community.members}</p>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[#E8B956] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl text-charcoal">+</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <HomeIcon size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/messages")}>
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/matches")}>
          <Search size={24} />
          <span className="text-xs">Search</span>
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
