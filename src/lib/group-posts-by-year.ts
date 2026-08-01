interface Dated {
  data: { pubDate: Date };
}

export interface YearGroup<T> {
  year: number;
  posts: T[];
}

// getUTCFullYear, not getFullYear: frontmatter dates are date-only, so a
// January 1st post reads as the previous year west of UTC. Same trap as
// formatDate's pinned timeZone.
export function groupPostsByYear<T extends Dated>(posts: T[]): YearGroup<T>[] {
  return posts.reduce<YearGroup<T>[]>((groups, post) => {
    const year = post.data.pubDate.getUTCFullYear();
    const current = groups.at(-1);
    if (current?.year === year) {
      current.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
    return groups;
  }, []);
}
