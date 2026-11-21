const SITE_HOST = "dannybrown.dev";

export function opensInNewTab(href: string): boolean {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  return url.hostname !== SITE_HOST;
}
