const WORDS_PER_MINUTE = 200;

export function getReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return wordCount === 0 ? 0 : Math.ceil(wordCount / WORDS_PER_MINUTE);
}
