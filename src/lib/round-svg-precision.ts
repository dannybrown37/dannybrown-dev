// ccgarden emits full float64 coordinates (649.7402325794993) into an 800px
// viewBox, which is ~40% of the file for precision no display can resolve.
// Only numbers *above* the target precision are touched, so human-readable
// figures in <title> tooltips ($469.43, 3.2 turns/session) are never rewritten.
export function roundSvgPrecision(svg: string, decimals = 2): string {
  const overPrecise = new RegExp(`\\d+\\.\\d{${decimals + 1},}`, "g");

  return svg.replace(overPrecise, (match) => {
    const rounded = Number(match).toFixed(decimals);
    const trimmed = rounded.replace(/\.?0+$/, "");

    return trimmed.length < match.length ? trimmed : match;
  });
}
