const EMAIL = "tinker@dannybrown.dev";

export function commentMailto(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return `mailto:${EMAIL}`;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(`Re: ${trimmed}`)}`;
}
