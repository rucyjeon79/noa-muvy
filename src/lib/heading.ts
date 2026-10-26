export function splitHeading(raw: string): { ep: string; title: string } {
  const text = raw.trim();
  const matched = text.match(/^(EP\.?\s*\d+)\s*[|]?\s*(.*)$/i);
  if (!matched) return { ep: "", title: text };
  const num = matched[1].match(/\d+/)?.[0] ?? "";
  return { ep: num ? `EP.${num}` : matched[1].trim(), title: matched[2].trim() };
}
