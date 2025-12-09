// src/components/mood/moodConfig.js

export const MOODS = ["chill", "focus", "workout", "sad", "party"];

export const moodTheme = {
  chill: {
    bg: "from-sky-950 via-slate-950 to-slate-900",
    badge: "badge-info",
    accent: "text-sky-300",
  },
  focus: {
    bg: "from-slate-950 via-slate-900 to-slate-800",
    badge: "badge-warning",
    accent: "text-yellow-300",
  },
  workout: {
    bg: "from-rose-950 via-rose-900 to-slate-900",
    badge: "badge-error",
    accent: "text-rose-300",
  },
  sad: {
    bg: "from-indigo-950 via-slate-950 to-slate-900",
    badge: "badge-secondary",
    accent: "text-indigo-300",
  },
  party: {
    bg: "from-emerald-950 via-emerald-900 to-slate-900",
    badge: "badge-success",
    accent: "text-emerald-300",
  },
};
