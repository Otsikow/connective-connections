import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "@/components/SwipeCard";
import BackButton from "@/components/BackButton";
import { RatingStars } from "@/components/RatingStars";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  bio: string;
  trustBadge?: boolean;
  availability?: string;
  distance?: string;
  gallery?: string[];
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "Sarah M.",
    age: 28,
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1470707592410-7d79450eaf42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    bio: "Love exploring new coffee shops and finding hidden gems in the city. Always up for a good conversation over a cup of coffee!",
    trustBadge: true,
    availability: "Available now",
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "Alex K.",
    age: 31,
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1456327102063-fb5054efe647?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519340333755-56e9c77f5a47?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    bio: "Recently moved to the city and looking to make new friends. Love outdoor activities and discovering local bookstores.",
    trustBadge: false,
    availability: "Usually available evenings",
    distance: "1.5 miles away",
  },
  {
    id: "3",
    name: "Jordan L.",
    age: 26,
    photo:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506086679525-9fdbfc0b81e5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Foodie", "Photography", "Travel", "Music"],
    bio: "Passionate about food photography and trying new restaurants. Always looking for someone to share a meal with!",
    trustBadge: true,
    availability: "Weekends",
    distance: "3 miles away",
  },
  {
    id: "4",
    name: "Casey R.",
    age: 29,
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Fitness", "Cooking", "Gardening", "Volunteering"],
    bio: "Fitness enthusiast who loves cooking healthy meals and tending to my garden. Looking for like-minded friends!",
    trustBadge: false,
    availability: "Mornings",
    distance: "4 miles away",
  },
  {
    id: "5",
    name: "Priya S.",
    age: 27,
    photo:
      "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Food Truck Explorer", "Live Music", "Pop Culture", "Skating"],
    bio: "Marketing professional who loves discovering new live music venues and foodie spots. Always ready for a trivia night!",
    trustBadge: true,
    availability: "Weeknights",
    distance: "0.8 miles away",
  },
  {
    id: "6",
    name: "Miguel A.",
    age: 33,
    photo:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Cycling", "Coffee Roasting", "Tech Meetups", "Board Games"],
    bio: "Engineer by day, amateur coffee roaster by night. Looking for friends to join weekend bike rides and board game sessions.",
    trustBadge: false,
    availability: "Early mornings and weekends",
    distance: "5 miles away",
  },
  {
    id: "7",
    name: "Taylor B.",
    age: 25,
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Indie Films", "Street Photography", "Thrifting", "City Walks"],
    bio: "Documentary filmmaker capturing everyday stories. Let’s explore flea markets and share photo walks across the city.",
    trustBadge: true,
    availability: "Flexible schedule",
    distance: "2.3 miles away",
  },
  {
    id: "8",
    name: "Hannah C.",
    age: 30,
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Community Theater", "Vegan Cooking", "Literary Salons", "Escape Rooms"],
    bio: "Event planner who loves organizing themed dinner parties and supporting local theater. Seeking collaborators for creative projects!",
    trustBadge: false,
    availability: "Evenings",
    distance: "1 mile away",
  },
  {
    id: "9",
    name: "Omar N.",
    age: 32,
    photo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519340333755-56e9c77f5a47?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Urban Gardening", "Podcasting", "Soccer", "Language Exchange"],
    bio: "Host of a local community podcast and coach for a pickup soccer league. Let’s swap stories and organize community events.",
    trustBadge: true,
    availability: "Weekends and late evenings",
    distance: "3.7 miles away",
  },
];

interface ConnectionFeedback {
  id: string;
  name: string;
  avatar: string;
  context: string;
  metAt: string;
  communityAverage: number;
  communityCount: number;
  yourRating?: number;
  yourComment?: string;
  submitted?: boolean;
}

const connectionFeedbackSeeds: ConnectionFeedback[] = [
  {
    id: "cf-1",
    name: "Sarah M.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    context: "Met through the Sunset Rooftop Social",
    metAt: "You matched after Alicia's rooftop social",
    communityAverage: 4.9,
    communityCount: 56,
  },
  {
    id: "cf-2",
    name: "Alex K.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    context: "Grabbed coffee during Neighborhood Crawl",
    metAt: "Introduced during the Riverfront coffee crawl",
    communityAverage: 4.7,
    communityCount: 42,
  },
  {
    id: "cf-3",
    name: "Priya S.",
    avatar:
      "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=200&q=80",
    context: "Partnered at Creative Coding Jam",
    metAt: "Paired during the creative coding workshop",
    communityAverage: 4.8,
    communityCount: 38,
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [connectionFeedback, setConnectionFeedback] = useState(connectionFeedbackSeeds);
  const { attemptConnection } = useSubscription();
  const { toast } = useToast();
  usePageTitle("Your Matches");

  // ...rest of logic and JSX remain unchanged from your last version
};

export default Matches;
