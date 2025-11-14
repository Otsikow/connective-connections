export const generateAvatarUrl = (seed: string, size: number = 256) =>
  `https://i.pravatar.cc/${size}?u=${encodeURIComponent(seed)}`;
