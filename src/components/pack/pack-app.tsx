import { Check, Copy, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { chapterName, chapterReady, cutsOf, formatChapter, formatCut, formatPack, typeLabel } from "@/lib/format";
import { draftChapter, draftExtra, draftPublish, draftScript } from "@/lib/cinema";
import { useDesk } from "@/lib/store";
import type { Chapter, CinemaPack, Cut, ExtraCut, RunStep } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS: Array<{ id: RunStep; label: string }> = [
  { id: "script", label: "대본" },
  { id: "c1", label: "전반" },
  { id: "c2", label: "중반" },
  { id: "c3", label: "후반" },
  { id: "publish", label: "공개" },
];

const STEP_HINT: Record<RunStep, string> = {
  script: "30컷 대본을 쓰는 중",
  c1: "전반 10컷 프롬프트",
  c2: "중반 10컷 프롬프트",
  c3: "후반 10컷 프롬프트",
  publish: "썸네일과 유튜브 글",
};

export function PackApp() {
  const heading = useDesk((s) => s.heading);
  const ep = useDesk((s) => s.ep);
  const title = useDesk((s) => s.title);
  const lyrics = useDesk((s) => s.lyrics);
  const pack = useDesk((s) => s.pack);
  const step = useDesk((s) => s.step);
  const extraChapter = useDesk((s) => s.extraChapter);
  const error = useDesk((s) => s.error);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    localStorage.removeItem("byeolmuri-studio");
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const saved = useDesk.getState();
      if (!saved.heading.trim() && (saved.ep || saved.title)) {
        saved.setHeading([saved.ep, saved.title].filter(Boolean).join(" "));
      }
      setReady(true);
    };
    const unsub = useDesk.persist.onFinishHydration(finish);
    if (useDesk.persist.hasHydrated()) finish();
    const timer = window.setTimeout(finish, 400);
    return () => {
      unsub();
      window.clearTimeout(timer);
    };
  }, []);

  const dirty = !pack || pack.ep !== ep.trim() || pack.title !== title.trim() || pack.lyrics !== lyrics.trim();
  const complete = !!pack && !dirty && isComplete(pack);
  const busy = step !== null || extraChapter !== null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const desk = useDesk.getState();
    const nextEp = desk.ep.trim();
    const nextTitle = desk.title.trim();
    const nextLyrics = desk.lyrics.trim();
    if (!nextEp || !nextTitle) {
      desk.setError("한 줄에 EP 번호와 제목을 적어 주세요");
      return;
    }
    if (nextLyrics.length < 10) {
      desk.setError("가사를 입력해 주세요");
      return;
    }
    desk.setError(null);
    try {
      const stale =
        !desk.pack ||
        desk.pack.ep !== nextEp ||
        desk.pack.title !== nextTitle ||
        desk.pack.lyrics !== nextLyrics ||
        isComplete(desk.pack);

      let current = desk.pack;
      if (stale) {
        desk.setStep("script");
        const drafted = await draftScript({ data: { ep: nextEp, title: nextTitle, lyrics: nextLyrics } });
        if (!drafted.ok) {
          desk.setStep(null);
          desk.setError(drafted.error);
          return;
        }
        current = {
          ep: nextEp,
          title: nextTitle,
          lyrics: nextLyrics,
          meta: drafted.meta,
          cuts: drafted.cuts.map((cut) => ({ ...cut, gemini: "", grok: "" })),
          extras: { 1: [], 2: [], 3: [] },
          publish: null,
        };
        desk.setPack(current);
      }
      if (!current) return;

      for (const chapter of [1, 2, 3] as const) {
        current = useDesk.getState().pack ?? current;
        if (chapterReady(current, chapter)) continue;
        const id: RunStep = chapter === 1 ? "c1" : chapter === 2 ? "c2" : "c3";
        desk.setStep(id);
        const prompted = await draftChapter({
          data: {
            ep: current.ep,
            title: current.title,
            meta: current.meta,
            chapter,
            cuts: cutsOf(current, chapter).map(({ n, lyric, script }) => ({ n, lyric, script })),
          },
        });
        if (!prompted.ok) {
          desk.setStep(null);
          desk.setError(prompted.error);
          return;
        }
        desk.mergePrompts(prompted.cuts);
      }

      current = useDesk.getState().pack ?? current;
      if (!current.publish) {
        desk.setStep("publish");
        const late = current.cuts.slice(20).map(({ n, lyric, script }) => ({ n, lyric, script }));
        const published = await draftPublish({
          data: { ep: current.ep, title: current.title, meta: current.meta, cuts: late },
        });
        if (!published.ok) {
          desk.setStep(null);
          desk.setError(published.error);
          return;
        }
        desk.setPublish(published.publish);
      }
      desk.setStep(null);
    } catch (error) {
      const deskNow = useDesk.getState();
      deskNow.setStep(null);
      deskNow.setExtraChapter(null);
      deskNow.setError(error instanceof Error ? error.message : "생성에 실패했습니다");
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center gap-4">
          <img
            src="/cast/symbol.png"
            alt="메인 심볼"
            className="size-16 shrink-0 rounded-full border border-border object-cover"
          />
          <div>
            <p className="text-xs tracking-widest text-subtle uppercase">Episodic</p>
            <h1 className="font-display text-4xl font-medium text-ivory">NOA MUVY</h1>
          </div>
        </div>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
          EP 번호와 제목을 한 줄로 적고, 가사로 30컷 대본과 프롬프트, 썸네일, 유튜브 글을 만듭니다.
        </p>
        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-muted">고정 캐스트 · 노아, 노엘</summary>
          <div className="mt-3 flex flex-col gap-3">
            <figure>
              <img
                src="/cast/noa.png"
                alt="노아 캐릭터 시트. 165cm, 긴 생머리"
                className="w-full rounded-lg border border-border"
              />
              <figcaption className="mt-1 text-xs text-subtle">노아 · 165cm · 얼굴 고정</figcaption>
            </figure>
            <figure>
              <img
                src="/cast/noel.png"
                alt="노엘 캐릭터 시트. 180cm"
                className="w-full rounded-lg border border-border"
              />
              <figcaption className="mt-1 text-xs text-subtle">노엘 · 180cm · 얼굴 고정</figcaption>
            </figure>
          </div>
        </details>
      </header>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit(event);
        }}
        className="flex flex-col gap-4"
      >
        <Field label="EP 번호와 제목">
          <input
            value={heading}
            onChange={(event) => useDesk.getState().setHeading(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            placeholder="EP.1 The End of the Day"
            enterKeyHint="next"
            autoComplete="off"
            disabled={busy || !ready}
            className={fieldClass}
          />
        </Field>
        <Field label="가사">
          <textarea
            value={lyrics}
            onChange={(event) => useDesk.getState().setLyrics(event.target.value)}
            placeholder="가사를 붙여 넣으세요"
            autoComplete="off"
            disabled={busy || !ready}
            rows={10}
            className={cn(fieldClass, "min-h-48 resize-y leading-relaxed")}
          />
        </Field>

        {(step || (pack && !dirty)) && (
          <ol className="grid grid-cols-5 gap-2">
            {STEPS.map((item) => {
              const state = stepState(pack, step, item.id, dirty);
              return (
                <li key={item.id} className="min-w-0">
                  <div
                    className={cn(
                      "border-t-2 pt-2 text-xs",
                      state === "done" && "border-accent text-fg",
                      state === "run" && "border-ivory text-ivory",
                      state === "wait" && "border-border text-subtle",
                    )}
                  >
                    {item.label}
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {step && (
          <p className="flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" />
            {STEP_HINT[step]}
          </p>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={busy || !ready} className="w-full sm:w-auto">
          {busy ? "만드는 중" : complete ? "다시 만들기" : pack && !dirty ? "이어서 만들기" : "패키지 만들기"}
        </Button>
      </form>

      {pack && !dirty && <PackageView pack={pack} busy={busy} />}
    </main>
  );
}

function PackageView({ pack, busy }: { pack: CinemaPack; busy: boolean }) {
  return (
    <div className="mt-10 flex flex-col gap-8 border-t border-border pt-8">
      <section className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-3xl text-ivory">
              {pack.ep} {pack.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{typeLabel(pack.meta.songType)}</p>
          </div>
          <CopyButton text={formatPack(pack)} label="전체 복사" />
        </div>
        <p className="text-base leading-relaxed text-fg">{pack.meta.emotionalLine}</p>
        <p className="text-sm text-subtle">
          {pack.meta.edition} · {pack.meta.genre}
        </p>
      </section>

      {([1, 2, 3] as const).map((chapter) => (
        <ChapterBlock key={chapter} pack={pack} chapter={chapter} busy={busy} />
      ))}

      {pack.publish && <PublishBlock pack={pack} />}
    </div>
  );
}

function ChapterBlock({ pack, chapter, busy }: { pack: CinemaPack; chapter: Chapter; busy: boolean }) {
  const cuts = cutsOf(pack, chapter);
  const extras = pack.extras[chapter];
  const ready = chapterReady(pack, chapter);
  const [note, setNote] = useState("");
  const running = useDesk((s) => s.extraChapter) === chapter;

  async function onExtra(event: FormEvent) {
    event.preventDefault();
    const desk = useDesk.getState();
    const current = desk.pack;
    if (!current) return;
    desk.setError(null);
    desk.setExtraChapter(chapter);
    try {
      const result = await draftExtra({
        data: {
          ep: current.ep,
          title: current.title,
          meta: current.meta,
          chapter,
          note,
          cuts: cutsOf(current, chapter).map(({ n, script }) => ({ n, script })),
          extras: current.extras[chapter],
        },
      });
      desk.setExtraChapter(null);
      if (!result.ok) {
        desk.setError(result.error);
        return;
      }
      desk.addExtras(chapter, result.cuts);
      setNote("");
    } catch (error) {
      desk.setExtraChapter(null);
      desk.setError(error instanceof Error ? error.message : "보충컷 생성에 실패했습니다");
    }
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl text-ivory">{chapterName(chapter)}</h3>
        {ready && <CopyButton text={formatChapter([...cuts, ...extras])} label="챕터 복사" />}
      </div>
      <p className="text-sm leading-relaxed text-muted">
        여자 {pack.meta.outfits[chapter].woman}
        <span className="mt-1 block">남자 {pack.meta.outfits[chapter].man}</span>
      </p>
      <div className="flex flex-col">
        {cuts.map((cut) => (
          <CutRow key={cut.n} cut={cut} />
        ))}
        {extras.map((cut) => (
          <CutRow key={cut.label} cut={cut} />
        ))}
      </div>
      {ready && (
        <form onSubmit={(event) => void onExtra(event)} className="flex flex-col gap-2 sm:flex-row">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="이 챕터에 더할 장면"
            disabled={busy}
            className={cn(fieldClass, "sm:flex-1")}
          />
          <Button type="submit" variant="secondary" disabled={busy}>
            {running ? "보충 중" : "보충컷"}
          </Button>
        </form>
      )}
    </section>
  );
}

function CutRow({ cut }: { cut: Cut | ExtraCut }) {
  const head = "label" in cut ? cut.label : `CUT ${String(cut.n).padStart(2, "0")}`;
  return (
    <details className="border-t border-border">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 py-2">
        <span className="w-16 shrink-0 font-display text-lg text-ivory">{head}</span>
        <span className="truncate text-sm text-muted">{cut.lyric || cut.script}</span>
      </summary>
      <div className="flex flex-col gap-3 pb-4">
        <div className="flex justify-end">
          <CopyButton text={formatCut(cut)} label="컷 복사" />
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{cut.script}</p>
        {cut.gemini && <Prompt label="Gemini" text={cut.gemini} />}
        {cut.grok && <Prompt label="Grok" text={cut.grok} />}
      </div>
    </details>
  );
}

function PublishBlock({ pack }: { pack: CinemaPack }) {
  const publish = pack.publish;
  if (!publish) return null;
  return (
    <section className="flex flex-col gap-4">
      <h3 className="font-display text-2xl text-ivory">공개</h3>
      <Block label={`유튜브 제목 · ${publish.youtubeTitle.length}/100`}>
        <pre className="text-sm whitespace-pre-wrap text-fg">{publish.youtubeTitle}</pre>
        <CopyButton text={publish.youtubeTitle} label="제목 복사" />
      </Block>
      <Block label="설명란">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{publish.description}</pre>
        <CopyButton text={publish.description} label="설명 복사" />
      </Block>
      <Block label="커뮤니티">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{publish.community}</pre>
        <CopyButton text={publish.community} label="글 복사" />
      </Block>
      <Block label="썸네일">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{publish.thumbnailPrompt}</pre>
        <CopyButton text={publish.thumbnailPrompt} label="프롬프트 복사" />
      </Block>
    </section>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3">
      <p className="text-xs text-subtle">{label}</p>
      {children}
    </div>
  );
}

function Prompt({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <p className="mb-2 text-xs text-subtle">{label}</p>
      <pre className="text-sm leading-relaxed whitespace-pre-wrap text-fg">{text}</pre>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-subtle">{label}</span>
      {children}
    </label>
  );
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        void navigator.clipboard.writeText(text).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 1500);
        });
      }}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {done ? "복사됨" : label}
    </Button>
  );
}

function stepState(
  pack: CinemaPack | null,
  step: RunStep | null,
  id: RunStep,
  dirty: boolean,
): "done" | "run" | "wait" {
  if (step === id) return "run";
  if (!pack || dirty) return "wait";
  if (id === "script") return pack.cuts.length === 30 ? "done" : "wait";
  if (id === "c1") return chapterReady(pack, 1) ? "done" : "wait";
  if (id === "c2") return chapterReady(pack, 2) ? "done" : "wait";
  if (id === "c3") return chapterReady(pack, 3) ? "done" : "wait";
  return pack.publish ? "done" : "wait";
}

function isComplete(pack: CinemaPack): boolean {
  return chapterReady(pack, 1) && chapterReady(pack, 2) && chapterReady(pack, 3) && !!pack.publish;
}

const fieldClass =
  "w-full rounded-md border border-border bg-surface px-3 py-3 text-base text-fg outline-none placeholder:text-subtle focus:border-accent disabled:opacity-50";
