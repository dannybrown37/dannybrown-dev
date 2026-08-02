import { slugify } from "./slugify";

export function slugifyTag(tag: string): string {
  return slugify(tag);
}
