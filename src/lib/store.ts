import { create } from "zustand";
import { persist } from "zustand/middleware";
import { splitHeading } from "./heading";
import type { Chapter, CinemaPack, Cut, ExtraCut, RunStep } from "./types";

type DeskState = {
  heading: string;
  ep: string;
  title: string;
  lyrics: string;
  pack: CinemaPack | null;
  step: RunStep | null;
  extraChapter: Chapter | null;
  error: string | null;
  setHeading: (v: string) => void;
  setLyrics: (v: string) => void;
  setStep: (step: RunStep | null) => void;
  setExtraChapter: (chapter: Chapter | null) => void;
  setError: (error: string | null) => void;
  setPack: (pack: CinemaPack | null) => void;
  mergePrompts: (cuts: Array<Pick<Cut, "n" | "gemini" | "grok">>) => void;
  addExtras: (chapter: Chapter, cuts: ExtraCut[]) => void;
  setPublish: (publish: NonNullable<CinemaPack["publish"]>) => void;
};

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      heading: "",
      ep: "",
      title: "",
      lyrics: "",
      pack: null,
      step: null,
      extraChapter: null,
      error: null,
      setHeading: (heading) => {
        const next = splitHeading(heading);
        set({ heading, ep: next.ep, title: next.title });
      },
      setLyrics: (lyrics) => set({ lyrics }),
      setStep: (step) => set({ step }),
      setExtraChapter: (extraChapter) => set({ extraChapter }),
      setError: (error) => set({ error }),
      setPack: (pack) => set({ pack }),
      mergePrompts: (cuts) => {
        const pack = get().pack;
        if (!pack) return;
        const byN = new Map(cuts.map((c) => [c.n, c]));
        set({
          pack: {
            ...pack,
            cuts: pack.cuts.map((cut) => {
              const next = byN.get(cut.n);
              return next ? { ...cut, gemini: next.gemini, grok: next.grok } : cut;
            }),
          },
        });
      },
      addExtras: (chapter, cuts) => {
        const pack = get().pack;
        if (!pack) return;
        set({
          pack: {
            ...pack,
            extras: {
              ...pack.extras,
              [chapter]: [...pack.extras[chapter], ...cuts],
            },
          },
        });
      },
      setPublish: (publish) => {
        const pack = get().pack;
        if (!pack) return;
        set({ pack: { ...pack, publish } });
      },
    }),
    {
      name: "ep-cinema-pack",
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") return current;
        const saved = persisted as Partial<Pick<DeskState, "heading" | "ep" | "title" | "lyrics" | "pack">>;
        if (current.heading || current.lyrics) return current;
        return {
          ...current,
          heading: saved.heading ?? "",
          ep: saved.ep ?? "",
          title: saved.title ?? "",
          lyrics: saved.lyrics ?? "",
          pack: saved.pack ?? null,
        };
      },
      partialize: (s) => ({
        heading: s.heading,
        ep: s.ep,
        title: s.title,
        lyrics: s.lyrics,
        pack: s.pack,
      }),
    },
  ),
);
