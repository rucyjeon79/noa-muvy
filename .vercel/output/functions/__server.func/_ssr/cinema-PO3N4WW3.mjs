import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cinema-PO3N4WW3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var RULES = `너는 Episodic Cinematic Music Drama 제작자다.
현실 기반 감정 서사. 영화 스틸. 초현실 과장 금지. 감정을 시각화하고 가사를 설명하지 않는다.
16:9 가로. 자막 없음. 텍스트 삽입 금지(썸네일 단계 제외). 현실적인 신체 비율.

여자 주인공은 NOA(노아) 한 명으로 고정. 다른 얼굴로 바꾸지 마라.
NOA: a 165cm tall slim Korean woman with long legs, long straight black hair with a center part past the shoulders, soft oval face, dark almond eyes, straight brows, small nose, fair skin, consistent facial identity. Pianist. 첫 등장 이후에는 the same NOA. 눈빛, 손. 울어도 무너지지 않음. 헤어와 얼굴은 시트와 같게 유지. 의상만 챕터에서 바뀐다.
남자 주인공은 NOEL(노엘) 한 명으로 고정.
NOEL: a 180cm tall athletic Korean man with short neat black hair, a defined jaw, calm dark eyes, consistent facial identity. Office worker. 첫 등장 이후에는 the same NOEL. 말 거의 없음. 어깨, 호흡, 턱선. 감정 폭발은 극히 제한.
관계: 보호자/구원 금지. 동등한 파트너. 키 차이 약 15cm. 기본은 개인 중심. 공동 장면은 후반에 최소 1회.
등장하는 인물만 프롬프트에 넣고, 이름은 NOA 또는 NOEL만 써라. 메인 심볼, PAPA, 로고는 컷과 썸네일에 넣지 마라.

곡 타입
A 에너지/선언: 무대, 강한 조명, 역동적 카메라, 로우앵글, 후렴 가속.
B 감정/독백: 드라마, 자연광 또는 톤다운, 클로즈업, 공연 최소.
C 콘서트: 현실적 규모의 공연, 무빙캠, 로우앵글, 와이드와 클로즈업 혼합, 안무. 판타지 금지.
혼합: 벌스 드라마, 후렴 공연, 브릿지 각성.

30컷
1-10 상황. 인트로 연주 2~3컷. 1컷 페이드인. 감정 폭발 금지. 카메라 최소. 해결 금지.
11-20 진행. 각성은 조용히. 감정은 서서히. 해결 금지.
21-30 결심→행동→확신. 고강도 감정 최소 2. 정면 응시 최소 2. 로우앵글 최소 2. 공동 장면 최소 1. 마지막 컷 페이드아웃.

고강도: 정면 응시, 강한 눈빛, 로우앵글, 정적에서 동적, 카메라가 가까워짐 중 2개 이상.
감정 흐름: 불안→버팀→균열→각성→폭발→확신→공동 상승. 폭발 직전은 정적.
같은 구도 연속 금지. 같은 장소 3컷 연속 금지. 같은 앵글 2컷 연속 금지.
챕터 안 의상 고정. 의상 변경은 챕터가 바뀔 때만.
얼굴이 안 읽히는 먼 와이드 금지. 한 컷 안에서 시간대·헤어 변경 금지.
동사 직역 금지. 은유 우선. 아이돌 과장·재벌·설명 나레이션 금지. C타입만 공연 허용.

Gemini 이미지 프롬프트는 영어 한 덩어리다. 순서를 바꾸지 마라.
① aspect ratio 16:9, horizontal cinematic frame, wide composition
② highly detailed, 8k sharp focus, professional cinema camera, shallow depth of field, crisp texture
③ 캐릭터 정의. 여자는 NOA, 남자는 NOEL. 시트와 같은 얼굴만.
④ lighting / emotion / outfit / background
⑤ cinematic film still
⑥ realistic skin texture
⑦ natural body proportions
⑧ no text
⑨ no watermark
⑩ 이미지 만들어죠
챕터 의상 문장을 outfit에 그대로 써라.

Grok 프롬프트는 그 컷의 Gemini 스틸에서 시작하는 영어 영상 지시문이다.
10 seconds. B는 내부 3 cuts, A·C는 내부 5 cuts, 혼합은 전반·중반 3 / 후반 5.
컷별 모션, camera movement, emotion intensity, cinematic lighting, dynamic 또는 slow pacing.
16:9. no subtitle. no text. 의상 변경 금지. 등장 인물 영어 정의 포함.

응답은 JSON만.`;
async function grok(system, user, maxTokens) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) throw new Error("지금은 생성을 사용할 수 없습니다");
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .6,
			max_tokens: maxTokens,
			response_format: { type: "json_object" },
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) throw new Error(`생성에 실패했습니다 (${res.status})`);
	const choice = (await res.json()).choices?.[0];
	if (choice?.finish_reason === "length") throw new Error("출력이 잘렸습니다. 다시 시도해 주세요");
	return parseJson(choice?.message?.content ?? "");
}
function parseJson(text) {
	const start = text.indexOf("{");
	const end = text.lastIndexOf("}");
	if (start < 0 || end <= start) throw new Error("응답 형식이 맞지 않습니다");
	try {
		return JSON.parse(text.slice(start, end + 1));
	} catch {
		throw new Error("응답 형식이 맞지 않습니다");
	}
}
function str(value, label) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`${label}이 비었습니다`);
	return value.trim();
}
function songType(value) {
	if (value === "A" || value === "B" || value === "C" || value === "mixed") return value;
	throw new Error("곡 타입이 맞지 않습니다");
}
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
function videoCuts(type, chapter) {
	if (type === "B") return 3;
	if (type === "A" || type === "C") return 5;
	return chapter === 3 ? 5 : 3;
}
var draftScript_createServerFn_handler = createServerRpc({
	id: "80be51e9bf0bf571caf94776f2b41b862d4765de64b102011ece0ce7097c6ea7",
	name: "draftScript",
	filename: "src/lib/cinema.ts"
}, (opts) => draftScript.__executeServer(opts));
var draftScript = createServerFn({ method: "POST" }).validator((input) => readInput(input)).handler(draftScript_createServerFn_handler, async ({ data }) => {
	try {
		const json = await grok(RULES, `노래로 1단계 대본만 만들어라. Gemini·Grok 프롬프트는 쓰지 마라.
EP: ${data.ep}
제목: ${data.title}
가사:
${data.lyrics}

JSON 형식:
{
  "songType": "A|B|C|mixed",
  "emotionalLine": "한국어 한 문장. 시적이고 과장 없음",
  "edition": "곡에 맞는 에디션 이름",
  "genre": "곡에 맞는 장르",
  "outfits": {
    "1": {"woman": "영어 의상", "man": "영어 의상"},
    "2": {"woman": "영어 의상", "man": "영어 의상"},
    "3": {"woman": "영어 의상", "man": "영어 의상"}
  },
  "cuts": [
    {"n": 1, "lyric": "이 컷의 가사 구간", "script": "한국어 2문장 이상. 장면 전개와 감정. 장소와 카메라 포함"}
  ]
}
cuts는 1부터 30까지 빠짐없이.`, 7e3);
		return {
			ok: true,
			meta: readMeta(json),
			cuts: readScripts(json)
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "대본 생성에 실패했습니다"
		};
	}
});
function readMeta(json) {
	if (!json || typeof json !== "object") throw new Error("대본 형식이 맞지 않습니다");
	const raw = json;
	const outfits = raw.outfits;
	if (!outfits) throw new Error("의상 정보가 없습니다");
	const readOutfit = (key) => ({
		woman: str(outfits[key]?.woman, `${key} 여자 의상`),
		man: str(outfits[key]?.man, `${key} 남자 의상`)
	});
	return {
		songType: songType(raw.songType),
		emotionalLine: str(raw.emotionalLine, "감성 한줄"),
		edition: str(raw.edition, "에디션"),
		genre: str(raw.genre, "장르"),
		outfits: {
			1: readOutfit("1"),
			2: readOutfit("2"),
			3: readOutfit("3")
		}
	};
}
function readScripts(json) {
	if (!json || typeof json !== "object" || !Array.isArray(json.cuts)) throw new Error("대본 형식이 맞지 않습니다");
	const cuts = json.cuts;
	if (cuts.length !== 30) throw new Error("대본이 30컷이 아닙니다");
	return cuts.map((item, index) => {
		const cut = item;
		const n = Number(cut.n);
		if (n !== index + 1) throw new Error("컷 순서가 맞지 않습니다");
		const script = str(cut.script, `CUT ${n} 대본`);
		if (script.length < 12) throw new Error(`CUT ${n} 대본이 너무 짧습니다`);
		return {
			n,
			lyric: typeof cut.lyric === "string" ? cut.lyric.trim() : "",
			script
		};
	});
}
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
var draftChapter_createServerFn_handler = createServerRpc({
	id: "33e0d782068e7bde232e95d02f8a4c8ee2f99e70a0a9d0afb589c9f0cd51c626",
	name: "draftChapter",
	filename: "src/lib/cinema.ts"
}, (opts) => draftChapter.__executeServer(opts));
var draftChapter = createServerFn({ method: "POST" }).validator((input) => readChapterInput(input)).handler(draftChapter_createServerFn_handler, async ({ data }) => {
	try {
		const first = await promptBatch(data, data.cuts.slice(0, 5));
		const second = await promptBatch(data, data.cuts.slice(5));
		return {
			ok: true,
			cuts: [...first, ...second]
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "컷 프롬프트 생성에 실패했습니다"
		};
	}
});
async function promptBatch(data, cuts) {
	const outfit = data.meta.outfits[data.chapter];
	return readPrompts(await grok(RULES, `잠긴 대본은 바꾸지 마라. 각 컷의 Gemini 이미지 프롬프트와 Grok 영상 프롬프트만 써라.
EP ${data.ep} ${data.title}
타입 ${data.meta.songType}. 감성: ${data.meta.emotionalLine}
챕터 ${data.chapter}. 내부 영상 컷 수 ${videoCuts(data.meta.songType, data.chapter)}.
여자 의상: ${outfit.woman}
남자 의상: ${outfit.man}
${data.chapter === 1 ? "감정 폭발 금지. 상황 제시." : ""}
${data.chapter === 3 ? "정면 응시와 로우앵글을 이 구간에 배치. 공동 장면 최소 1." : ""}

대본:
${cuts.map((c) => `CUT ${c.n}\n가사: ${c.lyric}\n${c.script}`).join("\n\n")}

JSON:
{"cuts":[{"n":${cuts[0]?.n ?? 1},"gemini":"","grok":""}]}
n은 위 대본과 같아야 한다. 빠진 컷 없이.`, 5e3), cuts.map((c) => c.n));
}
function readPrompts(json, expected) {
	if (!json || typeof json !== "object" || !Array.isArray(json.cuts)) throw new Error("프롬프트 형식이 맞지 않습니다");
	const cuts = json.cuts;
	if (cuts.length !== expected.length) throw new Error("컷 수가 맞지 않습니다");
	return cuts.map((item, index) => {
		const cut = item;
		const n = Number(cut.n);
		if (n !== expected[index]) throw new Error("컷 번호가 대본과 다릅니다");
		return {
			n,
			gemini: str(cut.gemini, `CUT ${n} Gemini`),
			grok: str(cut.grok, `CUT ${n} Grok`)
		};
	});
}
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
var draftExtra_createServerFn_handler = createServerRpc({
	id: "726b44d65d9fdcec48f308428aac88a9346311c5751794517e6333c8d9cc92e1",
	name: "draftExtra",
	filename: "src/lib/cinema.ts"
}, (opts) => draftExtra.__executeServer(opts));
var draftExtra = createServerFn({ method: "POST" }).validator((input) => readExtraInput(input)).handler(draftExtra_createServerFn_handler, async ({ data }) => {
	try {
		const outfit = data.meta.outfits[data.chapter];
		const start = data.extras.length + 1;
		return {
			ok: true,
			cuts: readExtras(await grok(RULES, `챕터 ${data.chapter} 보충컷 2개만 새로 써라. 기존 컷을 수정하지 마라.
EP ${data.ep} ${data.title}
타입 ${data.meta.songType}. 감성: ${data.meta.emotionalLine}
여자 의상: ${outfit.woman}
남자 의상: ${outfit.man}
요청: ${data.note || "이 챕터 감정을 한 단계 더 구체화"}
이미 있는 장면:
${data.cuts.map((c) => `CUT ${c.n}: ${c.script}`).join("\n")}
${data.extras.map((c) => `${c.label}: ${c.script}`).join("\n")}

JSON:
{"cuts":[
  {"label":"보충 ${start}","lyric":"","script":"한국어 2문장 이상","gemini":"","grok":""},
  {"label":"보충 ${start + 1}","lyric":"","script":"","gemini":"","grok":""}
]}`, 4e3), data.chapter, start)
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "보충컷 생성에 실패했습니다"
		};
	}
});
function readExtras(json, chapter, start) {
	if (!json || typeof json !== "object" || !Array.isArray(json.cuts)) throw new Error("보충컷 형식이 맞지 않습니다");
	const cuts = json.cuts;
	if (cuts.length < 1) throw new Error("보충컷이 없습니다");
	return cuts.slice(0, 3).map((item, index) => {
		const cut = item;
		return {
			n: (chapter - 1) * 10 + start + index,
			label: typeof cut.label === "string" && cut.label.trim() ? cut.label.trim() : `보충 ${start + index}`,
			lyric: typeof cut.lyric === "string" ? cut.lyric.trim() : "",
			script: str(cut.script, "보충 대본"),
			gemini: str(cut.gemini, "보충 Gemini"),
			grok: str(cut.grok, "보충 Grok")
		};
	});
}
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
var draftPublish_createServerFn_handler = createServerRpc({
	id: "7d7af998e3167f10777b74b9aa560c989d88e8becc4f0e3598634e6e718f7b37",
	name: "draftPublish",
	filename: "src/lib/cinema.ts"
}, (opts) => draftPublish.__executeServer(opts));
var draftPublish = createServerFn({ method: "POST" }).validator((input) => readPublishInput(input)).handler(draftPublish_createServerFn_handler, async ({ data }) => {
	try {
		const publish = readPublish(await grok(`${RULES}
공개 패키지 규칙:
유튜브 제목은 100자 이내. 노래 제목 원문, EP 번호, 장르를 넣는다. 키워드 나열 금지. 제목 문자열만.
설명란은 한국어. 600~1100자. 첫 줄에 제목과 EP. 영상의 감정과 장면을 짧게. 가짜 아티스트·해시태그 남발·구독 강요 금지.
커뮤니티 글은 한국어 200~400자. 채널 말투. 제목을 넣고 영상의 결을 말한다. 광고 문구 금지.
썸네일은 이 영상의 가장 상징적인 장면 하나를 쓰는 Gemini 영어 프롬프트 하나.
16:9 YouTube thumbnail. 프리미엄 시네마틱 앨범.
여자는 NOA. 긴 생머리와 얼굴은 노아 시트로 고정하고, 의상·장소·조명·표정만 이 곡에 맞춘다. 남자를 넣으면 NOEL만.
텍스트는 정확히 이것만: 좌상단 EP 번호, 중앙에 가장 큰 노래 제목, 그 아래 에디션 | 장르, 그 아래 감성 한줄.
얼굴(눈 코 입)에 글자가 겹치지 않게 처음부터 구도를 잡아라. 제목과 얼굴이 동시에 보이게.
감성 한줄은 번역하지 마라. 워터마크·로고·추가 문구 금지.
타이포는 장르 분위기에 맞게 구체적으로. 실존 폰트명 강요 금지.`, `EP: ${data.ep}
제목 원문: ${data.title}
에디션: ${data.meta.edition}
장르: ${data.meta.genre}
감성 한줄 원문: ${data.meta.emotionalLine}
타입: ${data.meta.songType}
후반 의상: ${data.meta.outfits[3].woman}
후반 대본:
${data.cuts.map((c) => `CUT ${c.n} ${c.lyric}\n${c.script}`).join("\n")}

JSON:
{"youtubeTitle":"","description":"","community":"","thumbnailPrompt":""}`, 3500), data.title);
		if (publish.youtubeTitle.length <= 100) return {
			ok: true,
			publish
		};
		const next = str((await grok("유튜브 제목만 100자 이내로 줄여라. 노래 제목 원문과 EP 번호는 유지. JSON {\"youtubeTitle\":\"\"} 만.", publish.youtubeTitle, 300)).youtubeTitle, "유튜브 제목");
		return {
			ok: true,
			publish: {
				...publish,
				youtubeTitle: next.length <= 100 ? next : next.slice(0, 100).trim()
			}
		};
	} catch (error) {
		return {
			ok: false,
			error: error instanceof Error ? error.message : "공개 패키지 생성에 실패했습니다"
		};
	}
});
function readPublish(json, title) {
	if (!json || typeof json !== "object") throw new Error("공개 패키지 형식이 맞지 않습니다");
	const raw = json;
	const youtubeTitle = str(raw.youtubeTitle, "유튜브 제목");
	if (!youtubeTitle.includes(title)) throw new Error("유튜브 제목에 노래 제목이 없습니다");
	return {
		youtubeTitle,
		description: str(raw.description, "설명란"),
		community: str(raw.community, "커뮤니티"),
		thumbnailPrompt: str(raw.thumbnailPrompt, "썸네일")
	};
}
//#endregion
export { draftChapter_createServerFn_handler, draftExtra_createServerFn_handler, draftPublish_createServerFn_handler, draftScript_createServerFn_handler };
