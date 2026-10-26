import type { Chapter, CinemaPack, Cut, ExtraCut } from "./types";

export function formatCut(cut: Cut | ExtraCut): string {
  const head = "label" in cut ? cut.label : `CUT ${cut.n}`;
  const blocks = [`${head}`, "대본", cut.script.trim()];
  if (cut.lyric.trim()) blocks.push("가사 구간", cut.lyric.trim());
  if (cut.gemini.trim()) {
    blocks.push("Gemini 프롬프트", "```", cut.gemini.trim(), "```");
  }
  if (cut.grok.trim()) {
    blocks.push("Grok 프롬프트", "```", cut.grok.trim(), "```");
  }
  return blocks.join("\n");
}

export function formatChapter(cuts: Array<Cut | ExtraCut>): string {
  return cuts.map(formatCut).join("\n\n");
}

export function formatPack(pack: CinemaPack): string {
  const { meta, publish } = pack;
  const lines = [
    `${pack.ep} ${pack.title}`,
    `타입: ${typeLabel(meta.songType)}`,
    `에디션: ${meta.edition}`,
    `장르: ${meta.genre}`,
    `감성 한줄: ${meta.emotionalLine}`,
    "",
    "1단계 대본",
    formatChapter(pack.cuts.map((c) => ({ ...c, gemini: "", grok: "" }))),
  ];
  for (const chapter of [1, 2, 3] as const) {
    lines.push("", chapterName(chapter), formatChapter(cutsOf(pack, chapter)));
    const extras = pack.extras[chapter];
    if (extras.length) {
      lines.push("", `${chapterName(chapter)} 보충`, formatChapter(extras));
    }
  }
  if (publish) {
    lines.push(
      "",
      "유튜브 제목",
      "```",
      publish.youtubeTitle,
      "```",
      "",
      "유튜브 설명",
      publish.description.trim(),
      "",
      "커뮤니티",
      publish.community.trim(),
      "",
      "썸네일 Gemini 프롬프트",
      "```",
      publish.thumbnailPrompt.trim(),
      "```",
    );
  }
  return lines.join("\n");
}

export function chapterName(chapter: Chapter): string {
  if (chapter === 1) return "전반 1–10";
  if (chapter === 2) return "중반 11–20";
  return "후반 21–30";
}

export function typeLabel(type: CinemaPack["meta"]["songType"]): string {
  if (type === "A") return "A 에너지 / 선언";
  if (type === "B") return "B 감정 / 독백";
  if (type === "C") return "C 콘서트";
  return "혼합 · 벌스 드라마 / 후렴 공연";
}

export function cutsOf(pack: CinemaPack, chapter: Chapter): Cut[] {
  const start = (chapter - 1) * 10;
  return pack.cuts.slice(start, start + 10);
}

export function chapterReady(pack: CinemaPack, chapter: Chapter): boolean {
  return cutsOf(pack, chapter).every((c) => c.gemini.trim() && c.grok.trim());
}
