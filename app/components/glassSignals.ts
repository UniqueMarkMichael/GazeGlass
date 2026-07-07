export const GLASS_SCROLL_OMEN_KEY = "gaze-glass.scroll-omen.v1";
export const GLASS_SCROLL_OMEN_EVENT = "gaze-glass:scroll-omen";

export type GlassScrollOmen = {
  id: string;
  href: string;
  label: string;
  message: string;
  progress: number;
  seenAt: number;
};
