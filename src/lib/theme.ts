export type Theme = "system" | "light" | "dark";

const CYCLE: Theme[] = ["system", "light", "dark"];

/** Anything unrecognized — including a missing key — means "follow the OS". */
export function parseTheme(raw: string | null): Theme {
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}

export function nextTheme(current: Theme): Theme {
  return CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
}

export function resolveTheme(
  theme: Theme,
  prefersDark: boolean,
): "light" | "dark" {
  if (theme === "system") return prefersDark ? "dark" : "light";
  return theme;
}
