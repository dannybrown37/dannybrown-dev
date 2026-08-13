import { describe, expect, it } from "vitest";
import { featuredProjects, projects, type Project } from "./projects";

const stub = (name: string, featured?: boolean): Project => ({
  name,
  description: name,
  url: `https://example.com/${name}`,
  tech: [],
  ...(featured ? { featured } : {}),
});

describe("featuredProjects", () => {
  it("keeps only the featured ones, in source order", () => {
    const all = [stub("a", true), stub("b"), stub("c", true)];
    expect(featuredProjects(all).map((project) => project.name)).toEqual(["a", "c"]);
  });

  it("returns nothing when none are featured", () => {
    expect(featuredProjects([stub("a"), stub("b")])).toEqual([]);
  });
});

describe("projects data", () => {
  // The home page shows the featured set and links out to the rest, so a
  // fourth flag silently makes that section taller than a phone screen again.
  it("features exactly four", () => {
    expect(featuredProjects()).toHaveLength(4);
  });

  it.each(projects)("$name has a unique name and an https url", ({ name, url }) => {
    expect(projects.filter((project) => project.name === name)).toHaveLength(1);
    expect(url).toMatch(/^https:\/\//);
  });
});
