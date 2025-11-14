import { generateAvatarUrl } from "@/lib/avatar";

export interface EventHost {
  name: string;
  avatar: string;
  role?: string;
  experiencesHosted?: number;
}

export interface EventReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface EventRatingSummary {
  average: number;
  count: number;
}

export interface EventData {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
  tags: string[];
  host?: EventHost;
  featured?: boolean;
  rating?: EventRatingSummary;
  reviews?: EventReview[];
}

const createSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const events: EventData[] = [
  {
    id: "101",
    slug: createSlug("Sunset Rooftop Social"),
    title: "Sunset Rooftop Social",
    description:
      "Unwind with curated connections, live acoustic music, and locally sourced bites as the sun sets over the skyline.",
    startDateTime: "2024-11-30T18:00:00-05:00",
    endDateTime: "2024-11-30T21:00:00-05:00",
    location: "Skyline Loft, Downtown",
    category: "Social Mixers",
    attendees: 36,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&fit=crop",
    tags: ["Premium", "Social", "Live Music"],
    host: {
      name: "Alicia Gomez",
      avatar: generateAvatarUrl("Alicia Gomez host"),
      role: "Community curator",
      experiencesHosted: 24,
    },
    featured: true,
    rating: {
      average: 4.9,
      count: 182,
    },
    reviews: [
      {
        id: "101-1",
        reviewerName: "Maya L.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "The host created such a welcoming atmosphere. I left with three new friends and plans for next week!",
        createdAt: "2024-05-12T18:30:00-05:00",
      },
      {
        id: "101-2",
        reviewerName: "Darius H.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Perfect balance of guided activities and free conversation. The skyline views were unforgettable.",
        createdAt: "2024-05-08T20:45:00-05:00",
      },
      {
        id: "101-3",
        reviewerName: "Sophie R.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Loved the live music and curated guest list. I wish it had lasted just a little longer!",
        createdAt: "2024-05-02T19:15:00-05:00",
      },
    ],
  },
  {
    id: "1",
    slug: createSlug("Neighborhood Coffee Crawl"),
    title: "Neighborhood Coffee Crawl",
    description:
      "Discover hidden gem cafés with fellow coffee lovers and enjoy curated tastings at every stop.",
    startDateTime: "2024-11-29T09:00:00-05:00",
    endDateTime: "2024-11-29T11:30:00-05:00",
    location: "Riverfront District",
    category: "Food & Drink",
    attendees: 18,
    image: "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?w=1600&h=900&fit=crop",
    tags: ["Casual", "Coffee Lovers"],
    rating: {
      average: 4.8,
      count: 96,
    },
    reviews: [
      {
        id: "1-1",
        reviewerName: "Jordan P.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Incredible mix of cafés and conversation prompts. Highly recommend for coffee lovers new to the city.",
        createdAt: "2024-04-28T10:05:00-05:00",
      },
      {
        id: "1-2",
        reviewerName: "Priya S.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Great variety of roasts and the group was so friendly. One stop was a bit crowded but still fun!",
        createdAt: "2024-04-20T09:45:00-05:00",
      },
    ],
  },
  {
    id: "2",
    slug: createSlug("Cooking Class: Italian Cuisine"),
    title: "Cooking Class: Italian Cuisine",
    description:
      "Learn authentic Italian cooking techniques with Chef Marco. Includes a 3-course meal tasting.",
    startDateTime: "2024-11-16T15:00:00-05:00",
    endDateTime: "2024-11-16T18:00:00-05:00",
    location: "Downtown Toronto",
    category: "Food & Drink",
    attendees: 22,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop",
    tags: ["Food", "Hands-on", "Chef-led"],
    rating: {
      average: 4.7,
      count: 143,
    },
    reviews: [
      {
        id: "2-1",
        reviewerName: "Miguel A.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Chef Marco makes complex dishes so approachable. Learned a ton and bonded with my table mates.",
        createdAt: "2024-05-01T18:50:00-05:00",
      },
      {
        id: "2-2",
        reviewerName: "Alex K.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Delicious recipes and great pacing. Would love a follow-up class focused on desserts!",
        createdAt: "2024-04-18T17:30:00-05:00",
      },
    ],
  },
  {
    id: "3",
    slug: createSlug("Mindful Morning Yoga"),
    title: "Mindful Morning Yoga",
    description:
      "Start your day with a calm, energizing yoga flow and guided meditation session led by Sarah Johnson.",
    startDateTime: "2024-11-30T08:30:00-05:00",
    endDateTime: "2024-11-30T10:00:00-05:00",
    location: "Harbor Park",
    category: "Wellness",
    attendees: 24,
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1600&h=900&fit=crop",
    tags: ["Wellness", "Outdoors"],
    rating: {
      average: 4.9,
      count: 88,
    },
    reviews: [
      {
        id: "3-1",
        reviewerName: "Taylor B.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "The sunrise stretch was magical. Sarah's guidance made everyone feel comfortable regardless of experience.",
        createdAt: "2024-05-10T08:15:00-05:00",
      },
      {
        id: "3-2",
        reviewerName: "Omar N.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Great blend of movement and meditation. Left feeling energized and grounded for the day.",
        createdAt: "2024-04-29T08:40:00-05:00",
      },
    ],
  },
  {
    id: "4",
    slug: createSlug("Creative Coding Jam"),
    title: "Creative Coding Jam",
    description:
      "Collaborate with other makers to build playful prototypes in an evening of guided creative coding prompts.",
    startDateTime: "2024-12-01T16:00:00-05:00",
    endDateTime: "2024-12-01T19:00:00-05:00",
    location: "Makerspace Studio",
    category: "Creative",
    attendees: 14,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&h=900&fit=crop",
    tags: ["Tech", "Collaboration"],
    rating: {
      average: 4.6,
      count: 57,
    },
    reviews: [
      {
        id: "4-1",
        reviewerName: "Casey R.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Met two collaborators for a side project! Loved the creative prompts and relaxed vibe.",
        createdAt: "2024-04-26T16:45:00-05:00",
      },
      {
        id: "4-2",
        reviewerName: "Hannah C.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Great energy and facilitation. Would have loved a bit more time for open collaboration at the end.",
        createdAt: "2024-04-12T18:05:00-05:00",
      },
    ],
  },
  {
    id: "5",
    slug: createSlug("Friendsgiving Potluck"),
    title: "Friendsgiving Potluck",
    description:
      "Share family recipes, connect with new friends, and celebrate gratitude with a cozy communal dinner.",
    startDateTime: "2024-12-01T18:30:00-05:00",
    endDateTime: "2024-12-01T21:30:00-05:00",
    location: "The Collective Kitchen",
    category: "Food & Drink",
    attendees: 28,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=900&fit=crop",
    tags: ["Food", "Community"],
    rating: {
      average: 4.8,
      count: 72,
    },
    reviews: [
      {
        id: "5-1",
        reviewerName: "Sarah M.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Felt like celebrating with family. Amazing dishes and thoughtful conversation prompts.",
        createdAt: "2024-05-05T18:20:00-05:00",
      },
      {
        id: "5-2",
        reviewerName: "Lena Q.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Loved the potluck format and cozy atmosphere. Bring a dish you're excited to share!",
        createdAt: "2024-04-21T19:10:00-05:00",
      },
    ],
  },
  {
    id: "6",
    slug: createSlug("Trailblazers Hiking Crew"),
    title: "Trailblazers Hiking Crew",
    description:
      "Hit the trails with fellow adventurers for a sunrise hike followed by a guided mindfulness cool-down.",
    startDateTime: "2024-12-02T07:00:00-05:00",
    endDateTime: "2024-12-02T10:30:00-05:00",
    location: "Pine Ridge Trailhead",
    category: "Outdoors",
    attendees: 22,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=900&fit=crop",
    tags: ["Adventure", "Outdoors"],
    rating: {
      average: 4.9,
      count: 64,
    },
    reviews: [
      {
        id: "6-1",
        reviewerName: "Miguel A.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "The guide kept everyone safe and energized. Sunrise views were worth the early wake-up!",
        createdAt: "2024-05-11T07:30:00-05:00",
      },
      {
        id: "6-2",
        reviewerName: "Omar N.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Great pace and conversation along the trail. Will definitely join the next hike!",
        createdAt: "2024-04-30T08:25:00-05:00",
      },
    ],
  },
  {
    id: "7",
    slug: createSlug("Pitch & Pint Night"),
    title: "Pitch & Pint Night",
    description:
      "Meet founders, investors, and developers at this monthly networking event for tech professionals.",
    startDateTime: "2024-12-03T17:30:00-05:00",
    endDateTime: "2024-12-03T20:00:00-05:00",
    location: "Founders Hub",
    category: "Professional",
    attendees: 31,
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1600&h=900&fit=crop",
    tags: ["Networking", "Startups"],
    rating: {
      average: 4.5,
      count: 118,
    },
    reviews: [
      {
        id: "7-1",
        reviewerName: "Luca F.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "High-energy networking with thoughtful facilitation. Ideal for startup founders looking for collaborators.",
        createdAt: "2024-04-16T18:10:00-05:00",
      },
      {
        id: "7-2",
        reviewerName: "Anika V.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "Loved the pitch feedback circles. Walked away with new contacts and concrete next steps.",
        createdAt: "2024-04-10T19:40:00-05:00",
      },
    ],
  },
  {
    id: "8",
    slug: createSlug("Community Brunch & Networking"),
    title: "Community Brunch & Networking",
    description:
      "Connect with local creators and entrepreneurs over a curated brunch experience and facilitated conversations.",
    startDateTime: "2024-12-03T11:00:00-05:00",
    endDateTime: "2024-12-03T13:30:00-05:00",
    location: "Market Square, Austin",
    category: "Professional",
    attendees: 34,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&h=900&fit=crop",
    tags: ["Networking", "Brunch"],
    rating: {
      average: 4.7,
      count: 103,
    },
    reviews: [
      {
        id: "8-1",
        reviewerName: "Nia J.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=200&q=80",
        rating: 5,
        comment:
          "The brunch menu was incredible and the facilitated introductions made it easy to connect.",
        createdAt: "2024-04-27T11:20:00-05:00",
      },
      {
        id: "8-2",
        reviewerName: "Samira D.",
        reviewerAvatar:
          "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80",
        rating: 4,
        comment:
          "Loved the mix of creatives and entrepreneurs. Would enjoy a longer post-event hangout next time.",
        createdAt: "2024-04-19T12:05:00-05:00",
      },
    ],
  },
];

export const featuredEvent = events.find((event) => event.featured) ?? events[0];

export const upcomingEvents = events.filter((event) => !event.featured);

export const getEventById = (identifier: string) => {
  const normalizedIdentifier = createSlug(identifier);

  return events.find((event) => {
    if (event.id === identifier || event.slug === identifier) {
      return true;
    }

    const normalizedId = createSlug(event.id);
    const normalizedSlug = createSlug(event.slug);
    const normalizedTitle = createSlug(event.title);

    return (
      normalizedIdentifier === normalizedId ||
      normalizedIdentifier === normalizedSlug ||
      normalizedIdentifier === normalizedTitle
    );
  });
};
