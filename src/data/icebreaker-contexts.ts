import { type CommunityGroup } from "@/lib/community-groups";
import { type EventItem } from "@/lib/events";
import { type MemberProfile } from "@/lib/icebreaker-engine";

export const SELF_ICEBREAKER_PROFILE: MemberProfile = {
  id: "you",
  name: "You",
  interests: ["sunrise hikes", "third-wave coffee", "maker nights", "gospel reggae"],
  musicInterests: ["gospel reggae", "alt-soul"],
  humorStyles: ["observational", "warm"],
  eventsAttended: ["Summit Social", "Blue Ridge sunrise hike", "Riverside Coding Meetup"],
  personalityTraits: ["curious connector", "low-pressure host"],
  recentActivity: ["shared a playlist in DMs", "co-led a maker night"],
};

export const DIRECT_ICEBREAKER_PROFILES: Record<string, MemberProfile> = {
  "alex-doe": {
    id: "alex-doe",
    name: "Alex Doe",
    interests: ["latte art", "urban hikes", "maker nights"],
    musicInterests: ["gospel reggae", "lofi study mixes"],
    humorStyles: ["dry", "observational"],
    eventsAttended: ["Summit Social", "Local espresso crawl"],
    personalityTraits: ["thoughtful", "curious connector"],
    recentActivity: ["shared a gospel reggae playlist", "posted latte art wins"],
  },
  "casey-wells": {
    id: "casey-wells",
    name: "Casey Wells",
    interests: ["community choirs", "coffee tastings", "trail running"],
    musicInterests: ["gospel reggae", "neo-soul"],
    humorStyles: ["playful"],
    eventsAttended: ["Summit Social", "Blue Ridge sunrise hike"],
    personalityTraits: ["warm", "encourager"],
    recentActivity: ["asked for running buddies", "shared choir rehearsal bloopers"],
  },
  "renee-soto": {
    id: "renee-soto",
    name: "Renee Soto",
    interests: ["travel", "sunrise hikes", "language exchange"],
    musicInterests: ["acoustic covers"],
    humorStyles: ["gentle"],
    eventsAttended: ["Blue Ridge sunrise hike"],
    personalityTraits: ["listener", "planner"],
    recentActivity: ["planning a spring meetup", "sharing travel photos"],
  },
};

const defaultMusicByInterest: Record<string, string[]> = {
  Music: ["indie jazz", "gospel reggae"],
  Outdoors: ["acoustic inspiration"],
  Food: ["bossa nova"],
  Tech: ["lofi beats"],
};

export const buildGroupProfilesFromEvent = (
  event: EventItem,
  selfProfile: MemberProfile = SELF_ICEBREAKER_PROFILE,
): MemberProfile[] => {
  const baseMusic = defaultMusicByInterest[event.interest] ?? ["lofi beats"];
  const attendees = event.participants.map<MemberProfile>((participant) => ({
    id: participant.id,
    name: participant.name,
    interests: [event.interest, `${event.title} attendee`],
    musicInterests: baseMusic,
    humorStyles: ["warm"],
    eventsAttended: [event.title],
    personalityTraits: ["curious"],
    recentActivity: [`RSVP’d to ${event.title}`],
  }));

  return [selfProfile, ...attendees];
};

export const buildGroupProfilesFromCommunity = (
  group: CommunityGroup,
  selfProfile: MemberProfile = SELF_ICEBREAKER_PROFILE,
): MemberProfile[] => {
  const categoryInterest = group.category.toLowerCase();
  const attendees = group.participants.map<MemberProfile>((participant) => ({
    id: participant.id,
    name: participant.name,
    interests: [categoryInterest, `${group.name} regulars`],
    musicInterests: ["lofi", "indie"],
    humorStyles: ["light"],
    eventsAttended: [group.name],
    personalityTraits: ["friendly"],
    recentActivity: ["active in group chat"],
  }));

  return [selfProfile, ...attendees];
};
