import { i as __toESM } from "../_runtime.mjs";
import { b as require_jsx_runtime, q as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as Check, n as LoaderCircle, r as Copy } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BCWvjIDK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(inputs.filter(Boolean).join(" "));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,opacity,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-ivory text-bg hover:bg-ivory/90",
			secondary: "border border-border bg-surface-2 text-fg hover:bg-surface",
			ghost: "text-muted hover:bg-surface-2 hover:text-fg",
			accent: "bg-accent text-accent-fg hover:bg-accent/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function formatCut(cut) {
	const blocks = [
		`${"label" in cut ? cut.label : `CUT ${cut.n}`}`,
		"대본",
		cut.script.trim()
	];
	if (cut.lyric.trim()) blocks.push("가사 구간", cut.lyric.trim());
	if (cut.gemini.trim()) blocks.push("Gemini 프롬프트", "```", cut.gemini.trim(), "```");
	if (cut.grok.trim()) blocks.push("Grok 프롬프트", "```", cut.grok.trim(), "```");
	return blocks.join("\n");
}
function formatChapter(cuts) {
	return cuts.map(formatCut).join("\n\n");
}
function formatPack(pack) {
	const { meta, publish } = pack;
	const lines = [
		`${pack.ep} ${pack.title}`,
		`타입: ${typeLabel(meta.songType)}`,
		`에디션: ${meta.edition}`,
		`장르: ${meta.genre}`,
		`감성 한줄: ${meta.emotionalLine}`,
		"",
		"1단계 대본",
		formatChapter(pack.cuts.map((c) => ({
			...c,
			gemini: "",
			grok: ""
		})))
	];
	for (const chapter of [
		1,
		2,
		3
	]) {
		lines.push("", chapterName(chapter), formatChapter(cutsOf(pack, chapter)));
		const extras = pack.extras[chapter];
		if (extras.length) lines.push("", `${chapterName(chapter)} 보충`, formatChapter(extras));
	}
	if (publish) lines.push("", "유튜브 제목", "```", publish.youtubeTitle, "```", "", "유튜브 설명", publish.description.trim(), "", "커뮤니티", publish.community.trim(), "", "썸네일 Gemini 프롬프트", "```", publish.thumbnailPrompt.trim(), "```");
	return lines.join("\n");
}
function chapterName(chapter) {
	if (chapter === 1) return "전반 1–10";
	if (chapter === 2) return "중반 11–20";
	return "후반 21–30";
}
function typeLabel(type) {
	if (type === "A") return "A 에너지 / 선언";
	if (type === "B") return "B 감정 / 독백";
	if (type === "C") return "C 콘서트";
	return "혼합 · 벌스 드라마 / 후렴 공연";
}
function cutsOf(pack, chapter) {
	const start = (chapter - 1) * 10;
	return pack.cuts.slice(start, start + 10);
}
function chapterReady(pack, chapter) {
	return cutsOf(pack, chapter).every((c) => c.gemini.trim() && c.grok.trim());
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function clip(value, max) {
	const text = value.trim();
	if (text.length > max) throw new Error("입력이 너무 깁니다");
	return text;
}
function readInput(input) {
	if (!input || typeof input !== "object") throw new Error("입력이 없습니다");
	const raw = input;
	const ep = clip(typeof raw.ep === "string" ? raw.ep : "", 40);
	const title = clip(typeof raw.title === "string" ? raw.title : "", 120);
	const lyrics = clip(typeof raw.lyrics === "string" ? raw.lyrics : "", 12e3);
	if (!ep || !title || lyrics.length < 10) throw new Error("EP 번호, 제목, 가사를 입력해 주세요");
	return {
		ep,
		title,
		lyrics
	};
}
var draftScript = createServerFn({ method: "POST" }).validator((input) => readInput(input)).handler(createSsrRpc("80be51e9bf0bf571caf94776f2b41b862d4765de64b102011ece0ce7097c6ea7"));
function readChapterInput(input) {
	if (!input || typeof input !== "object") throw new Error("입력이 없습니다");
	const raw = input;
	const ep = clip(typeof raw.ep === "string" ? raw.ep : "", 40);
	const title = clip(typeof raw.title === "string" ? raw.title : "", 120);
	const chapter = raw.chapter;
	if (chapter !== 1 && chapter !== 2 && chapter !== 3) throw new Error("챕터가 맞지 않습니다");
	if (!raw.meta || !Array.isArray(raw.cuts) || raw.cuts.length !== 10) throw new Error("챕터 대본이 없습니다");
	const start = (chapter - 1) * 10 + 1;
	const cuts = raw.cuts.map((cut, index) => {
		const n = start + index;
		if (!cut || cut.n !== n) throw new Error("컷 번호가 맞지 않습니다");
		return {
			n,
			lyric: clip(cut.lyric ?? "", 400),
			script: clip(cut.script ?? "", 1200)
		};
	});
	return {
		ep,
		title,
		meta: raw.meta,
		chapter,
		cuts
	};
}
var draftChapter = createServerFn({ method: "POST" }).validator((input) => readChapterInput(input)).handler(createSsrRpc("33e0d782068e7bde232e95d02f8a4c8ee2f99e70a0a9d0afb589c9f0cd51c626"));
function readExtraInput(input) {
	if (!input || typeof input !== "object") throw new Error("입력이 없습니다");
	const raw = input;
	const chapter = raw.chapter;
	if (chapter !== 1 && chapter !== 2 && chapter !== 3) throw new Error("챕터가 맞지 않습니다");
	if (!raw.meta || !Array.isArray(raw.cuts)) throw new Error("챕터 대본이 없습니다");
	return {
		ep: clip(typeof raw.ep === "string" ? raw.ep : "", 40),
		title: clip(typeof raw.title === "string" ? raw.title : "", 120),
		meta: raw.meta,
		chapter,
		note: clip(typeof raw.note === "string" ? raw.note : "", 400),
		cuts: raw.cuts.slice(0, 10).map((cut) => ({
			n: Number(cut.n),
			script: clip(cut.script ?? "", 400)
		})),
		extras: Array.isArray(raw.extras) ? raw.extras.slice(0, 8) : []
	};
}
var draftExtra = createServerFn({ method: "POST" }).validator((input) => readExtraInput(input)).handler(createSsrRpc("726b44d65d9fdcec48f308428aac88a9346311c5751794517e6333c8d9cc92e1"));
function readPublishInput(input) {
	if (!input || typeof input !== "object") throw new Error("입력이 없습니다");
	const raw = input;
	if (!raw.meta || !Array.isArray(raw.cuts) || raw.cuts.length < 10) throw new Error("확정 대본이 없습니다");
	return {
		ep: clip(typeof raw.ep === "string" ? raw.ep : "", 40),
		title: clip(typeof raw.title === "string" ? raw.title : "", 120),
		meta: raw.meta,
		cuts: raw.cuts.slice(-10).map((cut) => ({
			n: Number(cut.n),
			lyric: clip(cut.lyric ?? "", 300),
			script: clip(cut.script ?? "", 500)
		}))
	};
}
var draftPublish = createServerFn({ method: "POST" }).validator((input) => readPublishInput(input)).handler(createSsrRpc("7d7af998e3167f10777b74b9aa560c989d88e8becc4f0e3598634e6e718f7b37"));
function splitHeading(raw) {
	const text = raw.trim();
	const matched = text.match(/^(EP\.?\s*\d+)\s*[|]?\s*(.*)$/i);
	if (!matched) return {
		ep: "",
		title: text
	};
	const num = matched[1].match(/\d+/)?.[0] ?? "";
	return {
		ep: num ? `EP.${num}` : matched[1].trim(),
		title: matched[2].trim()
	};
}
var useDesk = create()(persist((set, get) => ({
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
		set({
			heading,
			ep: next.ep,
			title: next.title
		});
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
		set({ pack: {
			...pack,
			cuts: pack.cuts.map((cut) => {
				const next = byN.get(cut.n);
				return next ? {
					...cut,
					gemini: next.gemini,
					grok: next.grok
				} : cut;
			})
		} });
	},
	addExtras: (chapter, cuts) => {
		const pack = get().pack;
		if (!pack) return;
		set({ pack: {
			...pack,
			extras: {
				...pack.extras,
				[chapter]: [...pack.extras[chapter], ...cuts]
			}
		} });
	},
	setPublish: (publish) => {
		const pack = get().pack;
		if (!pack) return;
		set({ pack: {
			...pack,
			publish
		} });
	}
}), {
	name: "ep-cinema-pack",
	merge: (persisted, current) => {
		if (!persisted || typeof persisted !== "object") return current;
		const saved = persisted;
		if (current.heading || current.lyrics) return current;
		return {
			...current,
			heading: saved.heading ?? "",
			ep: saved.ep ?? "",
			title: saved.title ?? "",
			lyrics: saved.lyrics ?? "",
			pack: saved.pack ?? null
		};
	},
	partialize: (s) => ({
		heading: s.heading,
		ep: s.ep,
		title: s.title,
		lyrics: s.lyrics,
		pack: s.pack
	})
}));
var STEPS = [
	{
		id: "script",
		label: "대본"
	},
	{
		id: "c1",
		label: "전반"
	},
	{
		id: "c2",
		label: "중반"
	},
	{
		id: "c3",
		label: "후반"
	},
	{
		id: "publish",
		label: "공개"
	}
];
var STEP_HINT = {
	script: "30컷 대본을 쓰는 중",
	c1: "전반 10컷 프롬프트",
	c2: "중반 10컷 프롬프트",
	c3: "후반 10컷 프롬프트",
	publish: "썸네일과 유튜브 글"
};
function PackApp() {
	const heading = useDesk((s) => s.heading);
	const ep = useDesk((s) => s.ep);
	const title = useDesk((s) => s.title);
	const lyrics = useDesk((s) => s.lyrics);
	const pack = useDesk((s) => s.pack);
	const step = useDesk((s) => s.step);
	const extraChapter = useDesk((s) => s.extraChapter);
	const error = useDesk((s) => s.error);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		localStorage.removeItem("byeolmuri-studio");
		let done = false;
		const finish = () => {
			if (done) return;
			done = true;
			const saved = useDesk.getState();
			if (!saved.heading.trim() && (saved.ep || saved.title)) saved.setHeading([saved.ep, saved.title].filter(Boolean).join(" "));
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
	async function onSubmit(event) {
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
			const stale = !desk.pack || desk.pack.ep !== nextEp || desk.pack.title !== nextTitle || desk.pack.lyrics !== nextLyrics || isComplete(desk.pack);
			let current = desk.pack;
			if (stale) {
				desk.setStep("script");
				const drafted = await draftScript({ data: {
					ep: nextEp,
					title: nextTitle,
					lyrics: nextLyrics
				} });
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
					cuts: drafted.cuts.map((cut) => ({
						...cut,
						gemini: "",
						grok: ""
					})),
					extras: {
						1: [],
						2: [],
						3: []
					},
					publish: null
				};
				desk.setPack(current);
			}
			if (!current) return;
			for (const chapter of [
				1,
				2,
				3
			]) {
				current = useDesk.getState().pack ?? current;
				if (chapterReady(current, chapter)) continue;
				const id = chapter === 1 ? "c1" : chapter === 2 ? "c2" : "c3";
				desk.setStep(id);
				const prompted = await draftChapter({ data: {
					ep: current.ep,
					title: current.title,
					meta: current.meta,
					chapter,
					cuts: cutsOf(current, chapter).map(({ n, lyric, script }) => ({
						n,
						lyric,
						script
					}))
				} });
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
				const late = current.cuts.slice(20).map(({ n, lyric, script }) => ({
					n,
					lyric,
					script
				}));
				const published = await draftPublish({ data: {
					ep: current.ep,
					title: current.title,
					meta: current.meta,
					cuts: late
				} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-svh w-full max-w-3xl flex-col px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/cast/symbol.png",
							alt: "메인 심볼",
							className: "size-16 shrink-0 rounded-full border border-border object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-subtle uppercase",
							children: "Episodic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl font-medium text-ivory",
							children: "NOA MUVY"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-sm leading-relaxed text-muted",
						children: "EP 번호와 제목을 한 줄로 적고, 가사로 30컷 대본과 프롬프트, 썸네일, 유튜브 글을 만듭니다."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm text-muted",
							children: "고정 캐스트 · 노아, 노엘"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/cast/noa.png",
								alt: "노아 캐릭터 시트. 165cm, 긴 생머리",
								className: "w-full rounded-lg border border-border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
								className: "mt-1 text-xs text-subtle",
								children: "노아 · 165cm · 얼굴 고정"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/cast/noel.png",
								alt: "노엘 캐릭터 시트. 180cm",
								className: "w-full rounded-lg border border-border"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
								className: "mt-1 text-xs text-subtle",
								children: "노엘 · 180cm · 얼굴 고정"
							})] })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => {
					event.preventDefault();
					onSubmit(event);
				},
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "EP 번호와 제목",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: heading,
							onChange: (event) => useDesk.getState().setHeading(event.target.value),
							onKeyDown: (event) => {
								if (event.key === "Enter") event.preventDefault();
							},
							placeholder: "EP.1 The End of the Day",
							enterKeyHint: "next",
							autoComplete: "off",
							disabled: busy || !ready,
							className: fieldClass
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "가사",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: lyrics,
							onChange: (event) => useDesk.getState().setLyrics(event.target.value),
							placeholder: "가사를 붙여 넣으세요",
							autoComplete: "off",
							disabled: busy || !ready,
							rows: 10,
							className: cn(fieldClass, "min-h-48 resize-y leading-relaxed")
						})
					}),
					(step || pack && !dirty) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid grid-cols-5 gap-2",
						children: STEPS.map((item) => {
							const state = stepState(pack, step, item.id, dirty);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "min-w-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("border-t-2 pt-2 text-xs", state === "done" && "border-accent text-fg", state === "run" && "border-ivory text-ivory", state === "wait" && "border-border text-subtle"),
									children: item.label
								})
							}, item.id);
						})
					}),
					step && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), STEP_HINT[step]]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy || !ready,
						className: "w-full sm:w-auto",
						children: busy ? "만드는 중" : complete ? "다시 만들기" : pack && !dirty ? "이어서 만들기" : "패키지 만들기"
					})
				]
			}),
			pack && !dirty && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageView, {
				pack,
				busy
			})
		]
	});
}
function PackageView({ pack, busy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 flex flex-col gap-8 border-t border-border pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-3xl text-ivory",
							children: [
								pack.ep,
								" ",
								pack.title
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: typeLabel(pack.meta.songType)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
							text: formatPack(pack),
							label: "전체 복사"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base leading-relaxed text-fg",
						children: pack.meta.emotionalLine
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-subtle",
						children: [
							pack.meta.edition,
							" · ",
							pack.meta.genre
						]
					})
				]
			}),
			[
				1,
				2,
				3
			].map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChapterBlock, {
				pack,
				chapter,
				busy
			}, chapter)),
			pack.publish && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishBlock, { pack })
		]
	});
}
function ChapterBlock({ pack, chapter, busy }) {
	const cuts = cutsOf(pack, chapter);
	const extras = pack.extras[chapter];
	const ready = chapterReady(pack, chapter);
	const [note, setNote] = (0, import_react.useState)("");
	const running = useDesk((s) => s.extraChapter) === chapter;
	async function onExtra(event) {
		event.preventDefault();
		const desk = useDesk.getState();
		const current = desk.pack;
		if (!current) return;
		desk.setError(null);
		desk.setExtraChapter(chapter);
		try {
			const result = await draftExtra({ data: {
				ep: current.ep,
				title: current.title,
				meta: current.meta,
				chapter,
				note,
				cuts: cutsOf(current, chapter).map(({ n, script }) => ({
					n,
					script
				})),
				extras: current.extras[chapter]
			} });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl text-ivory",
					children: chapterName(chapter)
				}), ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text: formatChapter([...cuts, ...extras]),
					label: "챕터 복사"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: [
					"여자 ",
					pack.meta.outfits[chapter].woman,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-1 block",
						children: ["남자 ", pack.meta.outfits[chapter].man]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col",
				children: [cuts.map((cut) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CutRow, { cut }, cut.n)), extras.map((cut) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CutRow, { cut }, cut.label))]
			}),
			ready && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (event) => void onExtra(event),
				className: "flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: note,
					onChange: (event) => setNote(event.target.value),
					placeholder: "이 챕터에 더할 장면",
					disabled: busy,
					className: cn(fieldClass, "sm:flex-1")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "secondary",
					disabled: busy,
					children: running ? "보충 중" : "보충컷"
				})]
			})
		]
	});
}
function CutRow({ cut }) {
	const head = "label" in cut ? cut.label : `CUT ${String(cut.n).padStart(2, "0")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
		className: "border-t border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
			className: "flex min-h-11 cursor-pointer list-none items-center gap-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-16 shrink-0 font-display text-lg text-ivory",
				children: head
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "truncate text-sm text-muted",
				children: cut.lyric || cut.script
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
						text: formatCut(cut),
						label: "컷 복사"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed whitespace-pre-wrap text-fg",
					children: cut.script
				}),
				cut.gemini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prompt, {
					label: "Gemini",
					text: cut.gemini
				}),
				cut.grok && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Prompt, {
					label: "Grok",
					text: cut.grok
				})
			]
		})]
	});
}
function PublishBlock({ pack }) {
	const publish = pack.publish;
	if (!publish) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-2xl text-ivory",
				children: "공개"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
				label: `유튜브 제목 · ${publish.youtubeTitle.length}/100`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-sm whitespace-pre-wrap text-fg",
					children: publish.youtubeTitle
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text: publish.youtubeTitle,
					label: "제목 복사"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
				label: "설명란",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-sm leading-relaxed whitespace-pre-wrap text-fg",
					children: publish.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text: publish.description,
					label: "설명 복사"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
				label: "커뮤니티",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-sm leading-relaxed whitespace-pre-wrap text-fg",
					children: publish.community
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text: publish.community,
					label: "글 복사"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
				label: "썸네일",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "text-sm leading-relaxed whitespace-pre-wrap text-fg",
					children: publish.thumbnailPrompt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
					text: publish.thumbnailPrompt,
					label: "프롬프트 복사"
				})]
			})
		]
	});
}
function Block({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 rounded-lg border border-border bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: label
		}), children]
	});
}
function Prompt({ label, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-bg p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-xs text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "text-sm leading-relaxed whitespace-pre-wrap text-fg",
			children: text
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-subtle",
			children: label
		}), children]
	});
}
function CopyButton({ text, label }) {
	const [done, setDone] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "ghost",
		size: "sm",
		onClick: () => {
			navigator.clipboard.writeText(text).then(() => {
				setDone(true);
				window.setTimeout(() => setDone(false), 1500);
			});
		},
		children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" }), done ? "복사됨" : label]
	});
}
function stepState(pack, step, id, dirty) {
	if (step === id) return "run";
	if (!pack || dirty) return "wait";
	if (id === "script") return pack.cuts.length === 30 ? "done" : "wait";
	if (id === "c1") return chapterReady(pack, 1) ? "done" : "wait";
	if (id === "c2") return chapterReady(pack, 2) ? "done" : "wait";
	if (id === "c3") return chapterReady(pack, 3) ? "done" : "wait";
	return pack.publish ? "done" : "wait";
}
function isComplete(pack) {
	return chapterReady(pack, 1) && chapterReady(pack, 2) && chapterReady(pack, 3) && !!pack.publish;
}
var fieldClass = "w-full rounded-md border border-border bg-surface px-3 py-3 text-base text-fg outline-none placeholder:text-subtle focus:border-accent disabled:opacity-50";
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackApp, {});
}
//#endregion
export { Home as component };
