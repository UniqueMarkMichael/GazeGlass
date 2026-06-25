import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "observation-mode": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        "manifest-src"?: string;
        "data-flag-second-gaze"?: "off" | "on";
        "data-flag-change-lens"?: "off" | "on";
      };
    }
  }
}
