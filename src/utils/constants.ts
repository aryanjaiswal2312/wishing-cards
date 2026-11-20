import type { OccasionId, RelationshipId, SealColor } from '@/types';

export const LIMITS = {
  photos: 8,
  reasons: 5,
  promises: 5,
  letter: 500,
  voiceSeconds: 45,
  caption: 80,
  reason: 100,
  promise: 100,
  opening: 300,
  name: 40,
} as const;

export const STEPS = [
  { label: 'Details', title: 'Who is this gift for?', subtitle: 'Start with the names and the first words they will read.' },
  { label: 'Style', title: 'Set the mood', subtitle: 'Pick the occasion, your relationship and a theme that feels like them.' },
  { label: 'Gallery', title: 'Hang your memories', subtitle: 'Add up to eight photographs. Each one becomes a framed piece in the gallery.' },
  { label: 'Letter', title: 'Reasons and a letter', subtitle: 'Tell them why, in a few lines and in your own words.' },
  { label: 'Voice', title: 'Say it out loud', subtitle: 'A short voice note makes the letter feel closer. It is optional.' },
  { label: 'Promises', title: 'Make some promises', subtitle: 'Choose a few or write your own. They get to tick each one off.' },
] as const;

export const OCCASIONS: ReadonlyArray<{ id: OccasionId; label: string; blurb: string }> = [
  { id: 'birthday', label: 'Birthday', blurb: 'Another year, celebrated' },
  { id: 'anniversary', label: 'Anniversary', blurb: 'Looking back together' },
  { id: 'valentine', label: 'Valentine’s Day', blurb: 'Say it with a little more' },
  { id: 'apology', label: 'Apology', blurb: 'Make it right, gently' },
  { id: 'thank-you', label: 'Thank you', blurb: 'For everything you did' },
  { id: 'just-because', label: 'Just because', blurb: 'No reason needed' },
];

export const RELATIONSHIPS: ReadonlyArray<{ id: RelationshipId; label: string }> = [
  { id: 'partner', label: 'Partner' },
  { id: 'spouse', label: 'Spouse' },
  { id: 'best-friend', label: 'Best friend' },
  { id: 'family', label: 'Family' },
  { id: 'crush', label: 'Crush' },
  { id: 'other', label: 'Someone special' },
];

export const SEAL_COLORS: Record<SealColor, { label: string; base: string; dark: string; light: string }> = {
  crimson: { label: 'Crimson', base: '#b3203a', dark: '#7a1226', light: '#e4546b' },
  gold: { label: 'Gold', base: '#c9962b', dark: '#8a6414', light: '#f0cf7a' },
  navy: { label: 'Navy', base: '#27407a', dark: '#16254d', light: '#6585cf' },
  emerald: { label: 'Emerald', base: '#1f7a5a', dark: '#0f4a35', light: '#55c29a' },
  plum: { label: 'Plum', base: '#7a2f78', dark: '#4b1749', light: '#b96fb7' },
};
export const SEAL_COLOR_IDS = Object.keys(SEAL_COLORS) as SealColor[];

export const PROMISE_TEMPLATES: readonly string[] = [
  'I will always listen before I judge.',
  'I will make time for us, even on busy days.',
  'I will never go to bed angry without a hug.',
  'I will cheer louder than anyone for your dreams.',
  'I will plan a surprise just for you.',
  'I will remember the small things that matter to you.',
  'I will be honest, even when it is hard.',
  'I will keep laughing with you, always.',
];

export const REASON_PLACEHOLDERS: readonly string[] = [
  'The way you laugh at your own jokes',
  'You remember the tiny details',
  'You make ordinary days feel special',
  'Your kindness to everyone you meet',
  'How safe I feel next to you',
];
