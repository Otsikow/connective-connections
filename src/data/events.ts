export interface EventHost {
  name: string;
  avatar: string;
  role?: string;
  experiencesHosted?: number;
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
      avatar: "/placeholder.svg",
      role: "Community curator",
      experiencesHosted: 24,
    },
    featured: true,
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
