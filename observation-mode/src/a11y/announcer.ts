export function createAnnouncer(root: HTMLElement): (message: string) => void {
  const region = document.createElement("div");
  region.className = "om-sr-only";
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  root.append(region);

  return (message: string) => {
    region.textContent = "";
    window.setTimeout(() => {
      region.textContent = message;
    }, 0);
  };
}
