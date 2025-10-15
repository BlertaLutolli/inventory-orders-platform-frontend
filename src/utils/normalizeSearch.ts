export function normalizeSearch(input: string): string {
  // Convert underscores and hyphens to spaces; collapse whitespace
  return input.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}
