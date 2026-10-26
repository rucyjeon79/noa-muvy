export type SongType = "A" | "B" | "C" | "mixed";

export type Outfit = { woman: string; man: string };

export type Cut = {
  n: number;
  lyric: string;
  script: string;
  gemini: string;
  grok: string;
};

export type ExtraCut = Cut & { label: string };

export type Chapter = 1 | 2 | 3;

export type SongMeta = {
  songType: SongType;
  emotionalLine: string;
  edition: string;
  genre: string;
  outfits: Record<Chapter, Outfit>;
};

export type PublishPack = {
  youtubeTitle: string;
  description: string;
  community: string;
  thumbnailPrompt: string;
};

export type CinemaPack = {
  ep: string;
  title: string;
  lyrics: string;
  meta: SongMeta;
  cuts: Cut[];
  extras: Record<Chapter, ExtraCut[]>;
  publish: PublishPack | null;
};

export type RunStep = "script" | "c1" | "c2" | "c3" | "publish";
