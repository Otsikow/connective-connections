import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";

interface MemberProfile {
  name: string;
  role: string;
  hobbies: string[];
  rhythm: string;
  creative: string;
  faith: string;
  meetupWindows: string[];
  anchorActivity: string;
}

interface Preferences {
  hobbies: string[];
  rhythm: string;
  creative: string;
  faith: string;
  meetupWindow: string;
}

const hobbyOptions = [
  "Trail runs & hikes",
  "Board games",
  "Coffee tasting",
  "Studio art nights",
  "Volunteering",
  "Book swaps",
  "Live music",
  "Faith + brunch",
];

const rhythmOptions = ["Early mornings", "After work", "Weekend mornings", "Late evenings"];

const creativeOptions = [
  "Photo + film",
  "Writing & zines",
  "Design & no-code",
  "Music & jam sessions",
  "Maker builds",
  "Spoken word",
];

const faithOptions = [
  "Church meetup",
  "Interfaith discussion",
  "Meditation circle",
  "Community service",
  "Open to faith-based",
];

const meetupOptions = [
  "Weeknight 6-8 PM",
  "Saturday 9-11 AM",
  "Sunday 9-11 AM",
  "Remote-friendly",
  "Post-work 7-9 PM",
];

const memberProfiles: MemberProfile[] = [
  {
    name: "Lina Park",
    role: "Host-level connector",
    hobbies: ["Trail runs & hikes", "Coffee tasting"],
    rhythm: "Early mornings",
    creative: "Photo + film",
    faith: "Interfaith discussion",
    meetupWindows: ["Saturday 9-11 AM", "Weeknight 6-8 PM"],
    anchorActivity: "Sunrise trail + café recap",
  },
  {
    name: "Marcus Hale",
    role: "Calm community builder",
    hobbies: ["Board games", "Volunteering"],
    rhythm: "After work",
    creative: "Design & no-code",
    faith: "Open to faith-based",
    meetupWindows: ["Weeknight 6-8 PM", "Post-work 7-9 PM"],
    anchorActivity: "Board games + prototype swap",
  },
  {
    name: "Priya Desai",
    role: "Creative producer",
    hobbies: ["Studio art nights", "Book swaps"],
    rhythm: "Weekend mornings",
    creative: "Writing & zines",
    faith: "Meditation circle",
    meetupWindows: ["Saturday 9-11 AM", "Remote-friendly"],
    anchorActivity: "Zine circle + slow brunch",
  },
  {
    name: "Ethan Cole",
    role: "Logistics-friendly host",
    hobbies: ["Live music", "Board games"],
    rhythm: "After work",
    creative: "Music & jam sessions",
    faith: "Open to faith-based",
    meetupWindows: ["Weeknight 6-8 PM", "Post-work 7-9 PM"],
    anchorActivity: "Listening session + venue scouting",
  },
  {
    name: "Noor Rahman",
    role: "Mindful motivator",
    hobbies: ["Trail runs & hikes", "Volunteering"],
    rhythm: "Early mornings",
    creative: "Maker builds",
    faith: "Community service",
    meetupWindows: ["Sunday 9-11 AM", "Remote-friendly"],
    anchorActivity: "Sunrise walk + service pairing",
  },
  {
    name: "Julian Ortiz",
    role: "Social catalyst",
    hobbies: ["Live music", "Coffee tasting"],
    rhythm: "Late evenings",
    creative: "Spoken word",
    faith: "Interfaith discussion",
    meetupWindows: ["Post-work 7-9 PM", "Remote-friendly"],
    anchorActivity: "Storytelling mic + café hop",
  },
  {
    name: "Sofia Martins",
    role: "Hospitality-first host",
    hobbies: ["Faith + brunch", "Book swaps"],
    rhythm: "Weekend mornings",
    creative: "Design & no-code",
    faith: "Church meetup",
    meetupWindows: ["Sunday 9-11 AM", "Saturday 9-11 AM"],
    anchorActivity: "Brunch table + reflection prompts",
  },
  {
    name: "Caleb Moore",
    role: "Steady organiser",
    hobbies: ["Board games", "Book swaps"],
    rhythm: "After work",
    creative: "Writing & zines",
    faith: "Community service",
    meetupWindows: ["Weeknight 6-8 PM", "Post-work 7-9 PM"],
    anchorActivity: "Cozy board game café night",
  },
  {
    name: "Harper Lin",
    role: "Supportive planner",
    hobbies: ["Studio art nights", "Volunteering"],
    rhythm: "After work",
    creative: "Maker builds",
    faith: "Meditation circle",
    meetupWindows: ["Remote-friendly", "Weeknight 6-8 PM"],
    anchorActivity: "Workshop + impact micro-donation",
  },
  {
    name: "Zara Malik",
    role: "Rhythm keeper",
    hobbies: ["Faith + brunch", "Trail runs & hikes"],
    rhythm: "Early mornings",
    creative: "Photo + film",
    faith: "Church meetup",
    meetupWindows: ["Saturday 9-11 AM", "Sunday 9-11 AM"],
    anchorActivity: "Dawn walk + shared breakfast",
  },
];

const toggleSelection = (current: string[], value: string) =>
  current.includes(value) ? current.filter(item => item !== value) : [...current, value];

const findCommonValue = (values: string[], fallback: string) => {
  const frequency = values.reduce<Record<string, number>>((map, value) => {
    map[value] = (map[value] || 0) + 1;
    return map;
  }, {});

  const [topValue] = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0] ?? [];
  return topValue || fallback;
};

const buildMeetup = (
  primaryActivity: string,
  faith: string,
  meetWindow: string,
): { title: string; detail: string; idealTime: string } => {
  const meetTime = meetWindow || "Saturday 9:00 AM";

  if (primaryActivity === "Trail runs & hikes") {
    return {
      title: "Dawn trail + coffee finish",
      detail: "2.8-mile loop with a café cooldown and open invite for newcomers.",
      idealTime: meetTime,
    };
  }

  if (primaryActivity === "Board games") {
    return {
      title: "Board game café takeover",
      detail: "Reserve a cozy table, rotate co-op games, and leave with two next steps scheduled.",
      idealTime: meetTime || "Weeknight 7:00 PM",
    };
  }

  if (primaryActivity === "Faith + brunch" || faith === "Church meetup") {
    return {
      title: "Service + brunch walkover",
      detail: "Sit together, share reflection prompts, then stroll to a nearby brunch spot.",
      idealTime: meetTime || "Sunday 9:30 AM",
    };
  }

  return {
    title: "Creative jam + light bites",
    detail: "Bring one work-in-progress, pair-share for 15 minutes, then plan the follow-up meetup.",
    idealTime: meetTime,
  };
};

const AIGroupBuilder = () => {
  usePageTitle("Auto-Form Micro-Groups");

  const [preferences, setPreferences] = useState<Preferences>({
    hobbies: ["Trail runs & hikes", "Faith + brunch"],
    rhythm: "Weekend mornings",
    creative: "Photo + film",
    faith: "Church meetup",
    meetupWindow: "Sunday 9-11 AM",
  });

  const scoredMembers = useMemo(() => {
    return memberProfiles
      .map(member => {
        let score = 0;

        score += member.hobbies.some(hobby => preferences.hobbies.includes(hobby)) ? 3 : 0;
        score += member.rhythm === preferences.rhythm ? 2 : 0;
        score += member.creative === preferences.creative ? 2 : 0;
        score += member.faith === preferences.faith ? 2 : 0;
        score += member.meetupWindows.includes(preferences.meetupWindow) ? 2 : 0;

        if (preferences.hobbies.some(hobby => member.anchorActivity.toLowerCase().includes(hobby.split(" ")[0].toLowerCase()))) {
          score += 1;
        }

        return { ...member, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [preferences]);

  const selectedMembers = scoredMembers.slice(0, 6);
  const fallbackMembers = selectedMembers.length >= 3 ? selectedMembers : scoredMembers.slice(0, 3);

  const allHobbies = preferences.hobbies.length ? preferences.hobbies : fallbackMembers.flatMap(member => member.hobbies);
  const primaryActivity = allHobbies[0] || fallbackMembers[0]?.anchorActivity || "Creative hang";
  const creativeAnchor = preferences.creative || fallbackMembers[0]?.creative || "Creative mix";
  const groupRhythm = preferences.rhythm || fallbackMembers[0]?.rhythm || "Flexible";
  const sharedFaith = preferences.faith || findCommonValue(fallbackMembers.map(member => member.faith), "Open to faith-based");
  const timePreference = preferences.meetupWindow || findCommonValue(fallbackMembers.flatMap(member => member.meetupWindows), "Saturday 9-11 AM");

  const meetupPlan = buildMeetup(primaryActivity, sharedFaith, timePreference);

  const groupName = `${groupRhythm.includes("morning") ? "Sunrise" : "Evening"} ${
    creativeAnchor.split(" ")[0]
  } ${primaryActivity.split(" ")[0]} Crew`;

  const groupDescription = `3–6 people who love ${primaryActivity.toLowerCase()}, share a ${groupRhythm.toLowerCase()} rhythm, and keep ${
    creativeAnchor.toLowerCase()
  } energy flowing. Includes a ${sharedFaith.toLowerCase()} option for anyone who wants it.`;

  const handlePreferenceToggle = (
    key: keyof Preferences,
    value: string,
  ) => {
    setPreferences(prev =>
      key === "hobbies"
        ? { ...prev, hobbies: toggleSelection(prev.hobbies, value) }
        : { ...prev, [key]: prev[key] === value ? "" : value },
    );
  };

  return (
    <div className="space-y-8 pb-16">
      <BackButton fallbackPath="/home">Home</BackButton>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">AI Group Builder</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Auto-form micro-groups that actually meet</h1>
          <p className="max-w-3xl text-muted-foreground">
            The engine clusters 3–6 people who share hobbies, lifestyle rhythms, creative interests, faith activities, and meetup times—then ships a ready-to-launch group with an intro plan.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Matches in seconds
            </Badge>
            <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600">
              Invite-ready output
            </Badge>
            <Badge variant="secondary" className="bg-amber-500/15 text-amber-700">
              Logistics included
            </Badge>
          </div>
        </div>
        <Sparkles className="hidden h-12 w-12 text-primary sm:block" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-primary/15 bg-gradient-to-br from-primary/5 via-background to-background">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Compass className="h-5 w-5 text-primary" />
              Input the vibe
            </CardTitle>
            <CardDescription>Pick hobbies, rhythms, creative focus, faith activities, and meetup windows. The engine clusters the best 3–6 stack.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Hobbies</p>
                <Badge variant="outline" className="text-xs">Pick a few</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {hobbyOptions.map(option => (
                  <Button
                    key={option}
                    variant={preferences.hobbies.includes(option) ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "rounded-full",
                      preferences.hobbies.includes(option)
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/60"
                    )}
                    onClick={() => handlePreferenceToggle("hobbies", option)}
                  >
                    {preferences.hobbies.includes(option) && <Check className="mr-1.5 h-4 w-4" />}
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Lifestyle rhythm</p>
                <div className="flex flex-wrap gap-2">
                  {rhythmOptions.map(option => (
                    <Button
                      key={option}
                      variant={preferences.rhythm === option ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handlePreferenceToggle("rhythm", option)}
                    >
                      {preferences.rhythm === option && <Check className="mr-1.5 h-4 w-4" />}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Creative interest</p>
                <div className="flex flex-wrap gap-2">
                  {creativeOptions.map(option => (
                    <Button
                      key={option}
                      variant={preferences.creative === option ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handlePreferenceToggle("creative", option)}
                    >
                      {preferences.creative === option && <Check className="mr-1.5 h-4 w-4" />}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Faith activity</p>
                <div className="flex flex-wrap gap-2">
                  {faithOptions.map(option => (
                    <Button
                      key={option}
                      variant={preferences.faith === option ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handlePreferenceToggle("faith", option)}
                    >
                      {preferences.faith === option && <Check className="mr-1.5 h-4 w-4" />}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Preferred meetup time</p>
                <div className="flex flex-wrap gap-2">
                  {meetupOptions.map(option => (
                    <Button
                      key={option}
                      variant={preferences.meetupWindow === option ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handlePreferenceToggle("meetupWindow", option)}
                    >
                      {preferences.meetupWindow === option && <Check className="mr-1.5 h-4 w-4" />}
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-card/60 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-emerald-500" />
              Ready-to-create group
            </CardTitle>
            <CardDescription>AI outputs the full micro-community spec in one click.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Group name</p>
                  <h3 className="text-xl font-semibold leading-tight">{groupName}</h3>
                </div>
                <Badge className="bg-emerald-500 text-emerald-50">3–6 people</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{groupDescription}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4 text-emerald-500" />
                Member lineup
              </div>
              <div className="space-y-2">
                {fallbackMembers.map(member => (
                  <div
                    key={member.name}
                    className="flex flex-col gap-1 rounded-lg border border-border/60 bg-card/70 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700">
                        Score {member.score}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                      {[member.rhythm, member.creative, member.faith, ...member.hobbies.slice(0, 2)].map(tag => (
                        <Badge key={tag} variant="outline" className="rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-emerald-500" />
                First meetup
              </div>
              <div className="rounded-lg border border-border/60 bg-card/70 p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold">{meetupPlan.title}</p>
                    <p className="text-sm text-muted-foreground">{meetupPlan.detail}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {meetupPlan.idealTime}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {timePreference}
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">
                    {sharedFaith}
                  </Badge>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-700">
                    {creativeAnchor}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-700">
              <p className="font-semibold">Momentum built-in</p>
              <ul className="mt-1 space-y-1 text-emerald-800">
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5" />
                  Auto-matched rhythm + meetup window so confirmations land faster.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5" />
                  Ready-to-send invite copy paired to hobbies and faith preferences.
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="mt-0.5 h-3.5 w-3.5" />
                  Follow-up cadence: nudge at T-24h and a low-pressure check-in.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-card/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-rose-500" />
            How the engine decides
          </CardTitle>
          <CardDescription>Signals it weighs for a 3–6 person micro-community.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[{
            title: "Overlap signals",
            detail: "Hobbies, creative focus, and faith activities rank candidates and keep the vibe coherent.",
          }, {
            title: "Rhythm fit",
            detail: "Morning vs. evening people are matched so arrival energy stays aligned and flake risk drops.",
          }, {
            title: "Meetup momentum",
            detail: "Common meetup windows and an anchor activity yield a first gathering that’s easy to say yes to.",
          }].map(item => (
            <div key={item.title} className="rounded-lg border border-border/60 bg-card/60 p-4">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGroupBuilder;
