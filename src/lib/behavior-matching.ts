export interface BehaviorSignals {
  eventParticipation: string[];
  likes: string[];
  postReactions: string[];
  topicsFollowed: string[];
  workoutHabits: string[];
  creativeInterests: string[];
  sharedRoutines: string[];
  faithActivity: string[];
  activityTimes: string[];
}

export interface BehaviorProfile {
  id: string;
  name: string;
  actions: BehaviorSignals;
}

export interface BehaviorMatch {
  id: string;
  name: string;
  score: number;
  sharedSignals: string[];
  insight: string;
}

export interface BehaviorCluster {
  id: string;
  label: string;
  description: string;
  members: BehaviorProfile[];
  topSignals: string[];
}

const normalize = (value: string) => value.toLowerCase();

const buildFeatureSet = (profile: BehaviorProfile) => {
  const { actions } = profile;
  const featureBuckets = [
    actions.eventParticipation,
    actions.likes,
    actions.postReactions,
    actions.topicsFollowed,
    actions.workoutHabits,
    actions.creativeInterests,
    actions.sharedRoutines,
    actions.faithActivity,
    actions.activityTimes,
  ];

  return new Set(featureBuckets.flat().map(normalize));
};

const similarityScore = (
  anchor: BehaviorProfile,
  candidate: BehaviorProfile,
) => {
  const anchorFeatures = buildFeatureSet(anchor);
  const candidateFeatures = buildFeatureSet(candidate);

  const intersection = [...anchorFeatures].filter((feature) =>
    candidateFeatures.has(feature),
  );
  const union = new Set([
    ...anchorFeatures,
    ...candidateFeatures,
  ]);

  if (union.size === 0) return 0;

  const baseScore = intersection.length / union.size;
  const timeOverlap = candidate.actions.activityTimes.some((slot) =>
    anchorFeatures.has(normalize(slot)),
  )
    ? 0.1
    : 0;

  const faithOverlap =
    candidate.actions.faithActivity.length > 0 &&
    candidate.actions.faithActivity.some((item) =>
      anchorFeatures.has(normalize(item)),
    )
      ? 0.05
      : 0;

  return Math.min(1, baseScore + timeOverlap + faithOverlap);
};

const summarizeSignals = (
  anchor: BehaviorProfile,
  candidate: BehaviorProfile,
) => {
  const { actions: anchorActions } = anchor;
  const { actions: candidateActions } = candidate;

  const overlaps = {
    events: candidateActions.eventParticipation.filter((item) =>
      anchorActions.eventParticipation.map(normalize).includes(normalize(item)),
    ),
    topics: candidateActions.topicsFollowed.filter((item) =>
      anchorActions.topicsFollowed.map(normalize).includes(normalize(item)),
    ),
    workouts: candidateActions.workoutHabits.filter((item) =>
      anchorActions.workoutHabits.map(normalize).includes(normalize(item)),
    ),
    creative: candidateActions.creativeInterests.filter((item) =>
      anchorActions.creativeInterests.map(normalize).includes(normalize(item)),
    ),
    routines: candidateActions.sharedRoutines.filter((item) =>
      anchorActions.sharedRoutines.map(normalize).includes(normalize(item)),
    ),
    faith: candidateActions.faithActivity.filter((item) =>
      anchorActions.faithActivity.map(normalize).includes(normalize(item)),
    ),
    times: candidateActions.activityTimes.filter((item) =>
      anchorActions.activityTimes.map(normalize).includes(normalize(item)),
    ),
  };

  const sharedSignals = [
    ...overlaps.events.map((item) => `attend ${item} events`),
    ...overlaps.topics.map((item) => `follow ${item} topics`),
    ...overlaps.workouts.map((item) => `do ${item}`),
    ...overlaps.creative.map((item) => `create around ${item}`),
    ...overlaps.routines.map((item) => `share ${item}`),
    ...overlaps.faith.map((item) => `serve in ${item}`),
    ...overlaps.times.map((item) => `active at ${item}`),
  ];

  const insightParts: string[] = [];

  if (overlaps.events.length > 0) {
    insightParts.push(`both attend ${overlaps.events.join(" and ")} events`);
  }
  if (overlaps.topics.length > 0) {
    insightParts.push(`enjoy ${overlaps.topics.join(" and ")} content`);
  }
  if (overlaps.workouts.length > 0) {
    insightParts.push(`keep up ${overlaps.workouts.join(" and ")}`);
  }
  if (overlaps.creative.length > 0) {
    insightParts.push(`share creative time with ${overlaps.creative.join(" and ")}`);
  }
  if (overlaps.routines.length > 0) {
    insightParts.push(`sync on routines like ${overlaps.routines.join(" and ")}`);
  }
  if (overlaps.faith.length > 0) {
    insightParts.push(`show up for ${overlaps.faith.join(" and ")} gatherings`);
  }
  if (overlaps.times.length > 0) {
    insightParts.push(`tend to be active around ${overlaps.times.join(" and ")}`);
  }

  const insight =
    insightParts.length > 0
      ? `You and ${candidate.name} ${insightParts.join(", ")}.`
      : `${candidate.name} shows compatible engagement patterns even without bio overlap.`;

  return { sharedSignals, insight };
};

export const buildBehaviorMatches = (
  anchor: BehaviorProfile,
  candidates: BehaviorProfile[],
): BehaviorMatch[] =>
  candidates
    .map((candidate) => {
      const score = similarityScore(anchor, candidate);
      const { sharedSignals, insight } = summarizeSignals(anchor, candidate);

      return {
        id: candidate.id,
        name: candidate.name,
        score: Math.round(score * 100),
        sharedSignals,
        insight,
      };
    })
    .sort((a, b) => b.score - a.score);

const featureFrequency = (profiles: BehaviorProfile[]) => {
  const counter = new Map<string, number>();

  profiles.forEach((profile) => {
    buildFeatureSet(profile).forEach((feature) => {
      counter.set(feature, (counter.get(feature) || 0) + 1);
    });
  });

  return counter;
};

const deriveClusterLabel = (signals: string[]) => {
  if (signals.length === 0) return "Generalists";
  if (signals.length === 1) return signals[0];
  return `${signals[0]} + ${signals[1]} cohort`;
};

export const clusterBehaviorProfiles = (
  profiles: BehaviorProfile[],
  similarityThreshold = 0.35,
): BehaviorCluster[] => {
  const clusters: BehaviorCluster[] = [];

  profiles.forEach((profile) => {
    const match = clusters.find((cluster) => {
      const centroidFeatures = featureFrequency(cluster.members);

      const centroidSet = new Set<string>();
      centroidFeatures.forEach((_, key) => centroidSet.add(key));

      const union = new Set([
        ...centroidSet,
        ...buildFeatureSet(profile),
      ]);
      const intersection = [...buildFeatureSet(profile)].filter((item) =>
        centroidSet.has(item),
      );
      const score =
        union.size === 0 ? 0 : intersection.length / union.size;
      return score >= similarityThreshold;
    });

    if (match) {
      match.members.push(profile);
    } else {
      clusters.push({
        id: `cluster-${clusters.length + 1}`,
        label: "",
        description: "",
        members: [profile],
        topSignals: [],
      });
    }
  });

  return clusters.map((cluster) => {
    const frequencies = featureFrequency(cluster.members);
    const rankedSignals = [...frequencies.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([signal]) => signal);

    const label = deriveClusterLabel(rankedSignals);
    const description = `Shared patterns: ${rankedSignals.join(", ") || "varied"}`;

    return {
      ...cluster,
      label,
      description,
      topSignals: rankedSignals,
    };
  });
};
