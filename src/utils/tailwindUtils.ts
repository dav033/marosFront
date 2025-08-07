export function mergeWidthHeightClasses(base: string, extra: string): string {
  const pattern = /^(?:w|min-w|max-w|h|min-h|max-h)-/;

  const filteredBase = base
    .split(/\s+/)
    .filter(cls => !pattern.test(cls));

  const extras = extra.split(/\s+/).filter(Boolean);

  return [...filteredBase, ...extras].join(" ");
}
