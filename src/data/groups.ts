import type { Tables } from "@/integrations/supabase/types";

export type GroupWithMembers = Tables<"groups"> & {
  memberCount: number;
};

export const fallbackGroups: GroupWithMembers[] = [
  {
    id: "local-book-club",
    name: "Downtown Book Club",
    description:
      "A welcoming space for readers of all genres. We meet bi-weekly to discuss a new title and share recommendations over coffee.",
    category: "Books & Literature",
    location: "Downtown Library",
    image_url:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    next_meeting: new Date().toISOString(),
    is_premium: false,
    creator_id: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memberCount: 18,
  },
  {
    id: "local-hiking-group",
    name: "Weekend Hiking Crew",
    description:
      "Join fellow outdoor enthusiasts for moderate hikes every Saturday morning. All experience levels are welcome!",
    category: "Outdoor & Adventure",
    location: "Trailhead Park",
    image_url:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    next_meeting: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_premium: false,
    creator_id: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memberCount: 32,
  },
  {
    id: "local-language-swap",
    name: "Global Language Exchange",
    description:
      "Practice new languages with friendly locals and travelers in a relaxed cafe setting. Rotating conversation partners each week.",
    category: "Language & Culture",
    location: "Riverside Cafe",
    image_url:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    next_meeting: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    is_premium: false,
    creator_id: "system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    memberCount: 24,
  },
];
