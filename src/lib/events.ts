import { generateAvatarUrl } from "./avatar";

const avatar = (seed: string) => generateAvatarUrl(`event-${seed}`);

export type EventInterest =
  | "Tech"
  | "Fitness"
  | "Music"
  | "Art"
  | "Outdoors"
  | "Food"
  | "Networking";

export type EventPriceTier = "Free" | "Standard" | "Premium";

export type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  bannerUrl: string;
  host: {
    name: string;
    avatarUrl: string;
  };
  interest: EventInterest;
  distanceKm: number;
  priceTier: EventPriceTier;
  fee: number; // in USD
  deposit?: number; // in USD
  location: {
    address: string;
    lat: number;
    lng: number;
    city?: string;
  };
  participants: Array<{
    id: string;
    name: string;
    avatarUrl: string;
  }>;
  rules: string[];
  refundPolicy: string;
};

export const sampleEvents: EventItem[] = [
  {
    id: "evt-001",
    title: "Sunrise Hike at Blue Ridge",
    description:
      "Join us for a refreshing sunrise hike with scenic views. Beginner-friendly with plenty of breaks.",
    date: new Date().toISOString().slice(0, 10),
    startTime: "06:00",
    endTime: "09:00",
    bannerUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    host: { name: "Lena Park", avatarUrl: avatar("Lena Park") },
    interest: "Outdoors",
    distanceKm: 8.4,
    priceTier: "Free",
    fee: 0,
    location: {
      address: "Blue Ridge Trailhead, Asheville, NC",
      lat: 35.5951,
      lng: -82.5515,
      city: "Asheville",
    },
    participants: [
      { id: "u1", name: "Ava", avatarUrl: avatar("Ava hike") },
      { id: "u2", name: "Noah", avatarUrl: avatar("Noah hike") },
      { id: "u3", name: "Mia", avatarUrl: avatar("Mia hike") },
    ],
    rules: [
      "Be on time at the trailhead",
      "Bring water and comfortable shoes",
      "Respect nature and leave no trace",
    ],
    refundPolicy: "No payment required. If you RSVP and cannot attend, please cancel 12h prior.",
  },
  {
    id: "evt-002",
    title: "Latte Art Workshop",
    description:
      "Hands-on session to learn basic latte art pours. Equipment provided, includes one free drink.",
    date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10),
    startTime: "14:00",
    bannerUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80",
    host: { name: "Cafe Mondo", avatarUrl: avatar("Cafe Mondo") },
    interest: "Food",
    distanceKm: 2.1,
    priceTier: "Standard",
    fee: 15,
    deposit: 5,
    location: { address: "123 Bean St, Portland, OR", lat: 45.5152, lng: -122.6784, city: "Portland" },
    participants: [
      { id: "u4", name: "Liam", avatarUrl: avatar("Liam latte") },
      { id: "u5", name: "Emma", avatarUrl: avatar("Emma latte") },
    ],
    rules: ["No-shows forfeit deposit", "Arrive 10 minutes early"],
    refundPolicy:
      "Full refund 24h before start. Within 24h, deposit is non-refundable; fee refundable.",
  },
  {
    id: "evt-003",
    title: "Riverside Coding Meetup",
    description:
      "Casual outdoor coding hangout. Bring your laptop; power banks recommended. Lightning talks welcome!",
    date: new Date().toISOString().slice(0, 10),
    startTime: "17:30",
    bannerUrl:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1200&q=80",
    host: { name: "Tech Crew", avatarUrl: avatar("Tech Crew") },
    interest: "Tech",
    distanceKm: 5.7,
    priceTier: "Premium",
    fee: 25,
    deposit: 10,
    location: { address: "Riverside Park, Austin, TX", lat: 30.2672, lng: -97.7431, city: "Austin" },
    participants: [
      { id: "u6", name: "Olivia", avatarUrl: avatar("Olivia tech") },
      { id: "u7", name: "Ethan", avatarUrl: avatar("Ethan tech") },
      { id: "u8", name: "Sophia", avatarUrl: avatar("Sophia tech") },
      { id: "u9", name: "Jack", avatarUrl: avatar("Jack tech") },
    ],
    rules: ["Be respectful", "Keep talks under 5 minutes", "Clean up after"],
    refundPolicy: "Refunds up to 12h before start. After that, deposit is non-refundable.",
  },
];

export function formatPriceUSD(amount: number): string {
  if (amount <= 0) return "Free";
  return `$${amount.toFixed(0)}`;
}
