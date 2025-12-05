export type IcebreakerFormat = "1-on-1" | "group";

export interface MemberProfile {
  id: string;
  name: string;
  interests: string[];
  musicInterests?: string[];
  humorStyles?: string[];
  eventsAttended?: string[];
  personalityTraits?: string[];
  recentActivity?: string[];
}

export interface IcebreakerContext {
  type: "direct" | "group";
  participants: MemberProfile[];
  eventName?: string;
  meetupPurpose?: string;
}

export interface IcebreakerSuggestion {
  text: string;
  format: IcebreakerFormat;
  rationale: string;
  tags: string[];
}

const dedupe = (items: string[] = []) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));

const intersectAll = (groups: string[][]): string[] => {
  if (!groups.length) return [];
  return groups.reduce<string[]>((acc, current) => acc.filter((item) => current.includes(item)), groups[0]);
};

const mostFrequent = (items: string[]): string | undefined => {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
};

const formatList = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
};

export function generateIcebreakerSuggestions(
  context: IcebreakerContext,
  options: { limit?: number } = {},
): IcebreakerSuggestion[] {
  const { participants, type, eventName, meetupPurpose } = context;
  const limit = options.limit ?? 5;
  const format: IcebreakerFormat = type === "direct" ? "1-on-1" : "group";

  if (!participants.length) return [];

  const interestSets = participants.map((person) => dedupe(person.interests));
  const musicSets = participants.map((person) => dedupe(person.musicInterests ?? []));
  const humorSets = participants.map((person) => dedupe(person.humorStyles ?? []));
  const sharedInterests = intersectAll(interestSets);
  const sharedMusic = intersectAll(musicSets);
  const sharedHumor = intersectAll(humorSets);

  const suggestions: IcebreakerSuggestion[] = [];

  if (format === "1-on-1") {
    if (sharedMusic.length) {
      const track = sharedMusic[0];
      suggestions.push({
        text: `You both love ${track.toLowerCase()} — ask about their favorite track or playlist for the week.`,
        rationale: "Shared music taste lowers friction and invites an easy, specific question.",
        format,
        tags: ["music", "shared-interest"],
      });
    }

    if (sharedInterests.length) {
      const interest = sharedInterests[0];
      suggestions.push({
        text: `Start with that mutual ${interest.toLowerCase()} streak and swap what pulled you in recently.`,
        rationale: "Grounding in a shared passion creates immediate rapport.",
        format,
        tags: ["interests", "rapport"],
      });
    }

    const sharedEvents = intersectAll(participants.map((p) => dedupe(p.eventsAttended ?? [])));
    if (sharedEvents.length) {
      const event = sharedEvents[0];
      suggestions.push({
        text: `Mention ${event} and ask their highlight—then propose a follow-up meetup in that vibe.`,
        rationale: "Revisiting a mutual experience makes the convo concrete.",
        format,
        tags: ["events", "follow-up"],
      });
    }

    const alignedHumor = sharedHumor[0];
    if (alignedHumor) {
      suggestions.push({
        text: `Lean into your shared ${alignedHumor.toLowerCase()} humor—try a light observation about the venue or playlist.`,
        rationale: "Matching humor style signals compatibility.",
        format,
        tags: ["tone", "humor"],
      });
    }

    const sharedTraits = intersectAll(participants.map((p) => dedupe(p.personalityTraits ?? [])));
    if (sharedTraits.length) {
      suggestions.push({
        text: `Name the shared ${sharedTraits[0].toLowerCase()} energy you both bring and ask what they’re hoping for today.`,
        rationale: "Acknowledging mirrored traits invites vulnerability.",
        format,
        tags: ["personality", "intentions"],
      });
    }
  } else {
    const allInterests = dedupe(interestSets.flat());
    const topInterest = mostFrequent(allInterests);
    if (topInterest) {
      suggestions.push({
        text: `Open with “Looks like ${formatList([topInterest])} brought us together—what’s everyone’s go-to rec in that lane lately?”`,
        rationale: "A shared theme anchors the group quickly.",
        format,
        tags: ["group", "interests"],
      });
    }

    if (sharedMusic.length) {
      suggestions.push({
        text: `Spin up a quick round: favorite ${sharedMusic[0].toLowerCase()} track to set today’s mood?`,
        rationale: "Music prompts are inclusive and low-pressure for groups.",
        format,
        tags: ["group", "music"],
      });
    }

    const sharedEvents = intersectAll(participants.map((p) => dedupe(p.eventsAttended ?? [])));
    if (sharedEvents.length) {
      suggestions.push({
        text: `Ask who else was at ${sharedEvents[0]} and what they’d repeat or skip for this meetup.`,
        rationale: "Shared history bonds the room and surfaces preferences.",
        format,
        tags: ["group", "events"],
      });
    }

    const voiceCheck = meetupPurpose ?? eventName;
    if (voiceCheck) {
      suggestions.push({
        text: `Set context: “We’re here for ${voiceCheck}—one thing you’re excited to learn or offer?”`,
        rationale: "Naming purpose helps groups self-organize fast.",
        format,
        tags: ["group", "purpose"],
      });
    }

    const humorBlends = mostFrequent(humorSets.flat());
    if (humorBlends) {
      suggestions.push({
        text: `Use a light ${humorBlends.toLowerCase()} prompt like “best near-miss story from this hobby?” to warm everyone up.`,
        rationale: "Shared humor keeps the opener playful without alienating anyone.",
        format,
        tags: ["group", "humor"],
      });
    }
  }

  if (!suggestions.length) {
    suggestions.push({
      text: "Lead with a quick personal win from this week and invite others to share theirs.",
      rationale: "Wins are universal and positive.",
      format,
      tags: ["fallback"],
    });
  }

  return suggestions.slice(0, limit);
}
