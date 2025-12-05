// supabase/functions/friendship-compatibility/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import { z } from "https://esm.sh/zod@3.25.76";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ProfileSchema = z.object({
  id: z.string(),
  personalityTraits: z.array(z.string()).default([]),
  humorStyle: z.string().default("balanced"),
  faithAlignment: z.string().optional().default(""),
  lifestylePatterns: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  memes: z.array(z.string()).default([]),
  eventsAttended: z.array(z.string()).default([]),
  musicTaste: z.array(z.string()).default([]),
  learningGoals: z.array(z.string()).default([]),
  dailyRoutines: z.array(z.string()).default([]),
  timezone: z.string().optional(),
});

const CalculateScoreSchema = z.object({
  user: ProfileSchema,
  candidate: ProfileSchema,
  weights: z
    .record(z.string(), z.number().min(0))
    .optional()
    .default({}),
});

const GetCompatibleUsersSchema = z.object({
  user: ProfileSchema,
  candidates: z.array(ProfileSchema).min(1),
  limit: z.number().int().min(1).max(50).optional().default(10),
});

const PersonalityClusteringSchema = z.object({
  candidates: z.array(ProfileSchema).min(2),
  similarityThreshold: z.number().min(0).max(1).optional().default(0.55),
  maxClusters: z.number().int().min(1).max(25).optional().default(8),
});

type Profile = z.infer<typeof ProfileSchema>;

type ScoreBreakdown = {
  category: string;
  score: number;
  weight: number;
  shared: string[];
};

const DEFAULT_WEIGHTS: Record<string, number> = {
  personalityTraits: 0.2,
  humorStyle: 0.08,
  faithAlignment: 0.08,
  lifestylePatterns: 0.12,
  interests: 0.15,
  memes: 0.07,
  eventsAttended: 0.08,
  musicTaste: 0.08,
  learningGoals: 0.07,
  dailyRoutines: 0.07,
};

const normalize = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim().toLowerCase()))).filter(
    Boolean,
  );

const jaccardScore = (a: string[], b: string[]) => {
  const setA = new Set(normalize(a));
  const setB = new Set(normalize(b));
  if (!setA.size && !setB.size) return 0;

  const intersection = [...setA].filter((item) => setB.has(item)).length;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
};

const categoryScore = (
  userValues: string[],
  candidateValues: string[],
  weight: number,
): ScoreBreakdown => {
  const shared = normalize(userValues).filter((value) =>
    normalize(candidateValues).includes(value)
  );
  const score = jaccardScore(userValues, candidateValues) * weight * 100;
  return { category: "list", score, weight, shared };
};

const humorSimilarity = (user: string, candidate: string) => {
  const a = user.toLowerCase();
  const b = candidate.toLowerCase();
  if (a === b) return 1;
  const playfulPairs: Record<string, string[]> = {
    dry: ["sarcastic", "deadpan"],
    witty: ["satirical", "clever"],
    wholesome: ["silly", "family-friendly"],
  };

  if (playfulPairs[a]?.includes(b) || playfulPairs[b]?.includes(a)) {
    return 0.65;
  }

  return 0.35;
};

const stringAffinity = (a?: string, b?: string) => {
  if (!a || !b) return 0;
  const normalized = (value: string) => value.trim().toLowerCase();
  return normalized(a) === normalized(b) ? 1 : 0.35;
};

const buildScore = (
  user: Profile,
  candidate: Profile,
  weights: Record<string, number>,
) => {
  const resolvedWeights = { ...DEFAULT_WEIGHTS, ...weights };
  const breakdown: ScoreBreakdown[] = [];

  const addBreakdown = (
    category: string,
    score: number,
    shared: string[],
    weight: number,
  ) => breakdown.push({ category, score, shared, weight });

  const trait = categoryScore(
    user.personalityTraits,
    candidate.personalityTraits,
    resolvedWeights.personalityTraits,
  );
  addBreakdown("personalityTraits", trait.score, trait.shared, trait.weight);

  const lifestyle = categoryScore(
    user.lifestylePatterns,
    candidate.lifestylePatterns,
    resolvedWeights.lifestylePatterns,
  );
  addBreakdown("lifestylePatterns", lifestyle.score, lifestyle.shared, lifestyle.weight);

  const interests = categoryScore(
    user.interests,
    candidate.interests,
    resolvedWeights.interests,
  );
  addBreakdown("interests", interests.score, interests.shared, interests.weight);

  const memes = categoryScore(
    user.memes,
    candidate.memes,
    resolvedWeights.memes,
  );
  addBreakdown("memes", memes.score, memes.shared, memes.weight);

  const events = categoryScore(
    user.eventsAttended,
    candidate.eventsAttended,
    resolvedWeights.eventsAttended,
  );
  addBreakdown("eventsAttended", events.score, events.shared, events.weight);

  const music = categoryScore(
    user.musicTaste,
    candidate.musicTaste,
    resolvedWeights.musicTaste,
  );
  addBreakdown("musicTaste", music.score, music.shared, music.weight);

  const learning = categoryScore(
    user.learningGoals,
    candidate.learningGoals,
    resolvedWeights.learningGoals,
  );
  addBreakdown("learningGoals", learning.score, learning.shared, learning.weight);

  const routines = categoryScore(
    user.dailyRoutines,
    candidate.dailyRoutines,
    resolvedWeights.dailyRoutines,
  );
  addBreakdown("dailyRoutines", routines.score, routines.shared, routines.weight);

  const humorScore = humorSimilarity(user.humorStyle, candidate.humorStyle);
  addBreakdown(
    "humorStyle",
    humorScore * resolvedWeights.humorStyle * 100,
    humorScore > 0.6 ? [candidate.humorStyle] : [],
    resolvedWeights.humorStyle,
  );

  const faithScore = stringAffinity(user.faithAlignment, candidate.faithAlignment);
  addBreakdown(
    "faithAlignment",
    faithScore * resolvedWeights.faithAlignment * 100,
    faithScore > 0.5 && user.faithAlignment && candidate.faithAlignment
      ? [candidate.faithAlignment]
      : [],
    resolvedWeights.faithAlignment,
  );

  const totalScore = breakdown.reduce((sum, item) => sum + item.score, 0);
  const sharedTraits = Object.fromEntries(
    breakdown
      .filter((item) => item.shared.length)
      .map((item) => [item.category, item.shared]),
  );

  return {
    score: Math.round(totalScore * 100) / 100,
    sharedTraits,
    breakdown,
  };
};

const verifyUser = async (authHeader: string | null) => {
  if (!authHeader) {
    return { userId: null, error: "Authorization header required" };
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    {
      global: { headers: { Authorization: authHeader } },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { userId: null, error: "Invalid or missing session" };
  }

  return { userId: user.id, error: null };
};

const clusterProfiles = (
  candidates: Profile[],
  similarityThreshold: number,
  maxClusters: number,
) => {
  const clusters: {
    label: string;
    centroid: Profile;
    members: Profile[];
    averageScore: number;
  }[] = [];

  for (const profile of candidates) {
    let bestMatchIndex = -1;
    let bestScore = 0;

    clusters.forEach((cluster, index) => {
      const { score } = buildScore(profile, cluster.centroid, {});
      if (score > bestScore) {
        bestScore = score;
        bestMatchIndex = index;
      }
    });

    if (bestScore >= similarityThreshold * 100 && bestMatchIndex >= 0) {
      const cluster = clusters[bestMatchIndex];
      cluster.members.push(profile);
      const { score } = buildScore(cluster.centroid, profile, {});
      cluster.averageScore =
        (cluster.averageScore * (cluster.members.length - 1) + score) /
        cluster.members.length;
    } else if (clusters.length < maxClusters) {
      clusters.push({
        label: `${profile.personalityTraits[0] || "aligned"}-${
          profile.humorStyle
        }`,
        centroid: profile,
        members: [profile],
        averageScore: 100,
      });
    }
  }

  return clusters;
};

const recommendConnections = (
  sharedTraits: Record<string, string[]>,
  candidate: Profile,
) => {
  const recommendations = [] as string[];

  if (sharedTraits.interests?.length) {
    recommendations.push(
      `Lean into ${sharedTraits.interests.slice(0, 2).join(" and ")}` +
        " with a shared activity or playlist.",
    );
  }

  if (sharedTraits.eventsAttended?.length) {
    recommendations.push(
      `Reconnect over ${sharedTraits.eventsAttended.join(", ")}` +
        " or plan a similar meetup.",
    );
  }

  if (sharedTraits.learningGoals?.length) {
    recommendations.push(
      `Pair on learning goal(s): ${sharedTraits.learningGoals.join(", ")}.`,
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      `Explore ${candidate.humorStyle} humor and favorite memes to spark a chat.`,
    );
  }

  return recommendations;
};

const respond = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, error } = await verifyUser(req.headers.get("Authorization"));
    if (!userId) {
      return respond(401, { error });
    }

    const url = new URL(req.url);
    const endpoint =
      url.pathname.split("/").pop() || url.searchParams.get("endpoint") || "";

    if (endpoint === "calculateScore") {
      const body = await req.json();
      const validation = CalculateScoreSchema.safeParse(body);
      if (!validation.success) {
        return respond(400, {
          error: "Invalid payload",
          details: validation.error.flatten().fieldErrors,
        });
      }

      const { user, candidate, weights } = validation.data;
      const result = buildScore(user, candidate, weights);

      return respond(200, {
        userId,
        score: result.score,
        sharedTraits: result.sharedTraits,
        breakdown: result.breakdown,
        recommendations: recommendConnections(result.sharedTraits, candidate),
      });
    }

    if (endpoint === "getCompatibleUsers") {
      const body = await req.json();
      const validation = GetCompatibleUsersSchema.safeParse(body);
      if (!validation.success) {
        return respond(400, {
          error: "Invalid payload",
          details: validation.error.flatten().fieldErrors,
        });
      }

      const { user, candidates, limit } = validation.data;
      const scored = candidates
        .map((candidate) => {
          const result = buildScore(user, candidate, {});
          return {
            userId: candidate.id,
            score: result.score,
            sharedTraits: result.sharedTraits,
            recommendations: recommendConnections(result.sharedTraits, candidate),
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

      return respond(200, {
        userId,
        results: scored,
        summary: {
          topMatch: scored[0]?.userId ?? null,
          averageScore:
            scored.reduce((sum, item) => sum + item.score, 0) /
              Math.max(scored.length, 1) || 0,
        },
      });
    }

    if (endpoint === "personalityClustering") {
      const body = await req.json();
      const validation = PersonalityClusteringSchema.safeParse(body);
      if (!validation.success) {
        return respond(400, {
          error: "Invalid payload",
          details: validation.error.flatten().fieldErrors,
        });
      }

      const { candidates, similarityThreshold, maxClusters } = validation.data;
      const clusters = clusterProfiles(
        candidates,
        similarityThreshold,
        maxClusters,
      );

      const formatted = clusters.map((cluster) => ({
        label: cluster.label,
        averageScore: Math.round(cluster.averageScore * 100) / 100,
        members: cluster.members.map((member) => member.id),
        anchorTraits: {
          personalities: cluster.centroid.personalityTraits.slice(0, 3),
          humorStyle: cluster.centroid.humorStyle,
          interests: cluster.centroid.interests.slice(0, 3),
        },
      }));

      return respond(200, { userId, clusters: formatted });
    }

    return respond(404, { error: `Unknown endpoint: ${endpoint}` });
  } catch (err) {
    console.error("[FRIENDSHIP_COMPATIBILITY_ERR]", err);
    return respond(500, { error: "Unable to process request" });
  }
});
