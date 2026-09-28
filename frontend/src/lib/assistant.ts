// "Ask AeroAgro": an on-device farm assistant. It parses the question (English, Hindi or Tamil),
// finds the day and the decision being asked about, and answers from the downscaled forecast.
// No cloud LLM: answers are grounded in the same numbers shown on the dashboard.

import type { PanchayatData } from '@/data/all_india_regions';
import { IRRIGATION, Lang } from './advisory';
import type { DownscaleDetail, PestRisk, Step, WeatherMetrics } from './microclimate';
import { describeSky } from './sky';
import { DayOutlook, bestSprayDay, dateOf, dayLabel, dryRun, rainClass, sum } from './week';

export interface AssistantContext {
  p: PanchayatData;
  crop: string;
  week: DayOutlook[];
  coarse: WeatherMetrics;
  fine: WeatherMetrics;
  irrigation: { action: string; detail: string; deficit: number };
  et0: number;
  pest: PestRisk;
  detail: DownscaleDetail;
  coarseElevationM: number;
  isLive: boolean;
}

export type Intent =
  | 'greet'
  | 'insurance'
  | 'fertilizer'
  | 'harvest'
  | 'sow'
  | 'spray'
  | 'irrigate'
  | 'pest'
  | 'frost'
  | 'heat'
  | 'wind'
  | 'why'
  | 'rain'
  | 'overview';

export type AssistantAction = 'insurance' | 'bulletin' | 'explain' | 'spray' | 'grid';

export interface Answer {
  text: string;
  lang: Lang;
  intent: Intent;
  sources: string[];
  action?: { id: AssistantAction; label: string };
}

const RX: [Intent, RegExp][] = [
  ['insurance', /insur|pmfby|claim|compensat|बीमा|क्लेम|காப்பீடு|இழப்பீடு/],
  ['fertilizer', /fertili[sz]|urea|manure|nitrogen|\bdap\b|top.?dress|खाद|उर्वरक|यूरिया|உரம்|யூரியா/],
  ['harvest', /harvest|reap|thresh|कटाई|फसल काट|அறுவடை/],
  ['sow', /\bsow|seed|transplant|planting|बुवाई|बुआई|बोनी|रोपाई|விதை|நடவு/],
  ['spray', /spray|pesticide|insecticide|fungicide|chemical|छिड़काव|छिडकाव|स्प्रे|दवा|தெளி|மருந்து/],
  ['irrigate', /irrigat|\bwater\b|सिंचाई|पानी|நீர் பாய்ச்ச|பாசன|தண்ணீர்/],
  ['pest', /pest|disease|insect|fung|blight|blast|mildew|rust|कीट|रोग|बीमारी|பூச்சி|நோய்/],
  ['frost', /frost|cold|freez|chill|पाल[ाे]|ठंड|शीत|பனி|குளிர்/],
  ['heat', /heat|\bhot\b|temperature|\btemp\b|warm|गर्मी|लू|तापमान|வெப்ப|வெயில்/],
  ['wind', /wind|storm|gust|हवा|आंधी|காற்று|புயல்/],
  ['why', /why|differ|district|explain|accura|downscal|how do you|क्यों|ज़िल|जिल|अलग|ஏன்|மாவட்ட|வேறுபா/],
  ['rain', /rain|shower|drizzle|monsoon|precip|बारिश|वर्षा|बरसात|மழை/],
  ['greet', /^(hi|hello|hey|namaste|vanakkam)\b|^(नमस्ते|नमस्कार|வணக்கம்)/],
  ['overview', /weather|forecast|today|tomorrow|week|मौसम|पूर्वानुमान|வானிலை|முன்னறிவிப்பு/],
];

const WEEKDAYS: RegExp[] = [
  /sunday|रविवार|ஞாயிறு/,
  /monday|सोमवार|திங்கள்/,
  /tuesday|मंगलवार|செவ்வாய்/,
  /wednesday|बुधवार|புதன்/,
  /thursday|गुरुवार|வியாழன்/,
  /friday|शुक्रवार|வெள்ளி/,
  /saturday|शनिवार|சனி/,
];

export function detectLang(q: string, fallback: Lang): Lang {
  if (/[ऀ-ॿ]/.test(q)) return 'hi';
  if (/[஀-௿]/.test(q)) return 'ta';
  if (/[a-z]/i.test(q)) return 'en';
  return fallback;
}

function parseDay(q: string, week: DayOutlook[]): number | 'week' | null {
  if (/day after tomorrow|परसों|நாளை மறுநாள்/.test(q)) return 2;
  if (/tomorrow|कल|நாளை/.test(q)) return 1;
  if (/today|tonight|this (morning|evening|afternoon)|आज|இன்று|இன்றிரவு/.test(q)) return 0;
  for (let wd = 0; wd < 7; wd++) {
    if (!WEEKDAYS[wd].test(q)) continue;
    const i = week.findIndex((d) => d.date && dateOf(d.date).getDay() === wd);
    if (i >= 0) return i;
  }
  if (/week|7.?day|next few days|coming days|हफ्त|सप्ताह|अगले|வாரம்|வரும் நாட்கள்/.test(q)) return 'week';
  return null;
}

export function detectIntent(q: string): Intent | null {
  const s = q.toLowerCase();
  for (const [intent, rx] of RX) if (rx.test(s)) return intent;
  return null;
}

// ---------- helpers ----------

const pick = (lang: Lang, en: string, hi: string, ta: string) => (lang === 'hi' ? hi : lang === 'ta' ? ta : en);
const MM: Record<Lang, string> = { en: 'mm', hi: 'मिमी', ta: 'மி.மீ' };
const KMH: Record<Lang, string> = { en: 'km/h', hi: 'किमी/घंटा', ta: 'கி.மீ/மணி' };

function placeName(p: PanchayatData, lang: Lang) {
  const r = p.regionalName || '';
  if (lang === 'hi' && /[ऀ-ॿ]/.test(r)) return r;
  if (lang === 'ta' && /[஀-௿]/.test(r)) return r;
  return p.name;
}

/** Largest single physical step, as a readable phrase. */
function topStep(steps: Step[], additive: boolean) {
  const s = [...steps].sort((a, b) => (additive ? Math.abs(b.value) - Math.abs(a.value) : Math.abs(Math.log(b.value)) - Math.abs(Math.log(a.value))))[0];
  return s ? s.label.toLowerCase() : '';
}

function argBy(week: DayOutlook[], f: (d: DayOutlook) => number, max = true) {
  let k = 0;
  week.forEach((d, i) => {
    if (max ? f(d) > f(week[k]) : f(d) < f(week[k])) k = i;
  });
  return k;
}

// ---------- the answer engine ----------

export function answer(question: string, ctx: AssistantContext, uiLang: Lang): Answer {
  const lang = detectLang(question, uiLang);
  const q = question.toLowerCase().trim();
  const intent = detectIntent(q);
  const day = parseDay(q, ctx.week);
  const { p, week, crop } = ctx;
  const place = placeName(p, lang);
  const L = (i: number) => dayLabel(week[i], i, lang, 'long');
  /** Day label for mid-sentence use in English ("today", not "Today") */
  const Lm = (i: number) => (lang === 'en' && i < 2 ? L(i).toLowerCase() : L(i));
  /** "today" / "on Friday" · "आज" / "शुक्रवार को" · "இன்று" / "வெள்ளி அன்று" */
  const onDay = (i: number) => (i < 2 ? Lm(i) : pick(lang, `on ${L(i)}`, `${L(i)} को`, `${L(i)} அன்று`));
  const mm = (n: number) => `${n} ${MM[lang]}`;
  const kmh = (n: number) => `${Math.round(n)} ${KMH[lang]}`;
  const src = ctx.isLive ? 'Open-Meteo live' : 'Simulated scenario';
  const done = (text: string, it: Intent, sources: string[], action?: Answer['action']): Answer => ({ text, lang, intent: it, sources: [...sources, src], action });

  const blocker = (b: DayOutlook['blocker']) =>
    b === 'rain'
      ? pick(lang, 'rain would wash the chemical off', 'बारिश से दवा धुल जाएगी', 'மழையால் மருந்து கழுவப்படும்')
      : b === 'wind'
      ? pick(lang, 'wind above 15 km/h would drift the spray', 'तेज़ हवा से दवा उड़ जाएगी', 'வேகமான காற்றால் மருந்து சிதறும்')
      : b === 'heat'
      ? pick(lang, 'afternoon heat would evaporate the droplets', 'तेज़ गर्मी से बूँदें सूख जाएँगी', 'வெயிலால் துளிகள் ஆவியாகும்')
      : pick(lang, 'conditions stay marginal all day', 'पूरे दिन हालात ठीक नहीं रहेंगे', 'நாள் முழுவதும் சூழல் சரியில்லை');

  switch (intent) {
    case 'spray': {
      const best = bestSprayDay(week);
      const bestTxt =
        best >= 0
          ? pick(
              lang,
              `Best day this week: ${L(best)}, ${week[best].spray.label} (${week[best].spray.hours} h of calm, dry air).`,
              `इस हफ्ते सबसे अच्छा दिन: ${L(best)}, ${week[best].spray.label} (${week[best].spray.hours} घंटे शांत, सूखी हवा)।`,
              `இந்த வாரத்தின் சிறந்த நாள்: ${L(best)}, ${week[best].spray.label} (${week[best].spray.hours} மணி நேரம் அமைதியான, வறண்ட காற்று).`
            )
          : pick(
              lang,
              'There is no safe window in the next 7 days; if spraying cannot wait, use a rain-fast formulation.',
              'अगले 7 दिनों में कोई सुरक्षित समय नहीं है; ज़रूरी हो तो बारिश-रोधी दवा का प्रयोग करें।',
              'அடுத்த 7 நாட்களில் பாதுகாப்பான நேரம் இல்லை; அவசியமானால் மழையைத் தாங்கும் மருந்தைப் பயன்படுத்தவும்.'
            );
      if (typeof day === 'number') {
        const d = week[day];
        const lead =
          d.spray.hours > 0
            ? pick(
                lang,
                `Yes. ${L(day)} the safe spray window in ${place} is ${d.spray.start}–${d.spray.end} (${d.spray.hours} h): wind stays under 15 km/h and no rain is due within 2 hours.`,
                `हाँ। ${L(day)} ${place} में छिड़काव का सुरक्षित समय ${d.spray.start}–${d.spray.end} (${d.spray.hours} घंटे) है: हवा 15 किमी/घंटा से कम रहेगी और 2 घंटे में बारिश नहीं है।`,
                `ஆம். ${L(day)} ${place}-இல் பாதுகாப்பான தெளிப்பு நேரம் ${d.spray.start}–${d.spray.end} (${d.spray.hours} மணி நேரம்): காற்று 15 கி.மீ/மணிக்குக் கீழ், 2 மணி நேரத்துக்குள் மழை இல்லை.`
              )
            : pick(lang, `Don't spray ${Lm(day)}: ${blocker(d.blocker)}.`, `${L(day)} छिड़काव न करें: ${blocker(d.blocker)}।`, `${L(day)} தெளிக்க வேண்டாம்: ${blocker(d.blocker)}.`);
        const tail = d.spray.hours === 0 || best !== day ? ` ${bestTxt}` : '';
        return done(lead + tail, 'spray', ['Hourly spray model', 'ICAR drift limits'], { id: 'spray', label: pick(lang, 'Open hourly chart', 'घंटेवार चार्ट खोलें', 'மணிநேர வரைபடம்') });
      }
      const safe = week
        .map((d, i) => (d.spray.hours > 0 ? `${dayLabel(d, i, lang, 'short')} ${d.spray.start?.slice(0, 2)}–${d.spray.end?.slice(0, 2)}` : null))
        .filter(Boolean)
        .join(', ');
      const today = week[0].spray.hours > 0
        ? pick(lang, `Today: ${week[0].spray.label}.`, `आज: ${week[0].spray.label}।`, `இன்று: ${week[0].spray.label}.`)
        : pick(lang, `Today: not safe (${blocker(week[0].blocker)}).`, `आज: सुरक्षित नहीं (${blocker(week[0].blocker)})।`, `இன்று: பாதுகாப்பில்லை (${blocker(week[0].blocker)}).`);
      const list = safe ? pick(lang, ` All safe windows: ${safe}.`, ` सभी सुरक्षित समय: ${safe}।`, ` அனைத்து பாதுகாப்பான நேரங்கள்: ${safe}.`) : '';
      return done(`${bestTxt} ${today}${list}`, 'spray', ['Hourly spray model', 'ICAR drift limits', '7-day outlook'], { id: 'spray', label: pick(lang, 'Open hourly chart', 'घंटेवार चार्ट खोलें', 'மணிநேர வரைபடம்') });
    }

    case 'rain': {
      const rs = topStep(ctx.detail.rain, false);
      if (typeof day === 'number') {
        const d = week[day];
        const rc = rainClass(d.fine.rainfallMm);
        const more = d.coarse.rainfallMm >= 0.1 && d.fine.rainfallMm > d.coarse.rainfallMm * 1.1;
        const less = d.coarse.rainfallMm >= 0.1 && d.fine.rainfallMm < d.coarse.rainfallMm * 0.9;
        const diff = rs && (more || less)
          ? pick(lang, `; your village gets ${more ? 'more' : 'less'} because of ${rs}`, `; आपके गाँव में भू-भाग के कारण ${more ? 'ज़्यादा' : 'कम'} बारिश`, `; நிலப்பரப்பு காரணமாக உங்கள் கிராமத்தில் ${more ? 'அதிக' : 'குறைந்த'} மழை`)
          : '';
        const advice =
          rc.id >= 4
            ? pick(lang, ' Clear field drains, postpone fertilizer and spraying, and keep harvested produce under cover.', ' खेत की नालियाँ साफ़ करें, खाद और छिड़काव टालें, कटी फसल ढककर रखें।', ' வயல் வடிகால்களைச் சுத்தம் செய்யவும், உரம் மற்றும் தெளிப்பைத் தள்ளிப்போடவும், அறுவடை செய்த விளைச்சலை மூடி வைக்கவும்.')
            : rc.id === 3
            ? pick(lang, ' Good soaking rain: skip irrigation.', ' अच्छी बारिश: सिंचाई न करें।', ' நல்ல மழை: நீர்ப்பாசனம் தேவையில்லை.')
            : rc.id === 0
            ? pick(lang, ' Dry day: plan irrigation and field work.', ' सूखा दिन: सिंचाई और खेत का काम करें।', ' வறண்ட நாள்: நீர்ப்பாசனம் மற்றும் வயல் வேலையைத் திட்டமிடவும்.')
            : '';
        const lead =
          rc.id === 0
            ? pick(
                lang,
                `${L(day)}: no rain expected in ${place} (district block: ${mm(d.coarse.rainfallMm)}).`,
                `${L(day)}: ${place} में बारिश की संभावना नहीं (ज़िला ब्लॉक: ${mm(d.coarse.rainfallMm)})।`,
                `${L(day)}: ${place}-இல் மழை வாய்ப்பு இல்லை (மாவட்டத் தொகுதி: ${mm(d.coarse.rainfallMm)}).`
              )
            : pick(
                lang,
                `${L(day)}: ${rc.en} in ${place}, about ${mm(d.fine.rainfallMm)}. The district block forecast says ${mm(d.coarse.rainfallMm)}${diff}.`,
                `${L(day)}: ${place} में ${rc.hi}, लगभग ${mm(d.fine.rainfallMm)}। ज़िला ब्लॉक पूर्वानुमान ${mm(d.coarse.rainfallMm)} बताता है${diff}।`,
                `${L(day)}: ${place}-இல் ${rc.ta}, சுமார் ${mm(d.fine.rainfallMm)}. மாவட்டத் தொகுதி முன்னறிவிப்பு ${mm(d.coarse.rainfallMm)}${diff}.`
              );
        return done(
          lead + advice,
          'rain',
          ['7-day outlook', 'IMD rain classes', 'Orographic model']
        );
      }
      const total = sum(week.map((d) => d.fine.rainfallMm));
      const block = sum(week.map((d) => d.coarse.rainfallMm));
      const n = week.filter((d) => d.fine.rainfallMm >= 2.5).length;
      const w = argBy(week, (d) => d.fine.rainfallMm);
      const text =
        total < 1
          ? pick(
              lang,
              `No meaningful rain in ${place} over the next 7 days (${mm(total)}). Plan irrigation; it is a good week for spraying and harvest.`,
              `अगले 7 दिनों में ${place} में खास बारिश नहीं (${mm(total)})। सिंचाई की योजना बनाएँ; छिड़काव और कटाई के लिए अच्छा हफ्ता है।`,
              `அடுத்த 7 நாட்களில் ${place}-இல் குறிப்பிடத்தக்க மழை இல்லை (${mm(total)}). நீர்ப்பாசனத்தைத் திட்டமிடவும்; தெளிப்பு மற்றும் அறுவடைக்கு நல்ல வாரம்.`
            )
          : pick(
              lang,
              `Next 7 days in ${place}: ${mm(total)} over ${n} rainy day${n === 1 ? '' : 's'} (district block: ${mm(block)}). Wettest: ${L(w)} with ${mm(week[w].fine.rainfallMm)} (${rainClass(week[w].fine.rainfallMm).en}).`,
              `अगले 7 दिन ${place} में: कुल ${mm(total)}, ${n} दिन बारिश (ज़िला ब्लॉक: ${mm(block)})। सबसे ज़्यादा ${L(w)} को ${mm(week[w].fine.rainfallMm)} (${rainClass(week[w].fine.rainfallMm).hi})।`,
              `அடுத்த 7 நாட்கள் ${place}-இல்: மொத்தம் ${mm(total)}, ${n} மழை நாட்கள் (மாவட்டத் தொகுதி: ${mm(block)}). அதிகபட்சம் ${L(w)} அன்று ${mm(week[w].fine.rainfallMm)} (${rainClass(week[w].fine.rainfallMm).ta}).`
            );
      return done(text, 'rain', ['7-day outlook', 'IMD rain classes'], { id: 'bulletin', label: pick(lang, 'Open agromet bulletin', 'कृषि मौसम बुलेटिन', 'வேளாண் வானிலை அறிக்கை') });
    }

    case 'irrigate': {
      const action = IRRIGATION[ctx.irrigation.action]?.[lang] ?? ctx.irrigation.action;
      const def = Math.max(0, ctx.irrigation.deficit);
      const next = week.slice(1, 4);
      const next3 = sum(next.map((d) => d.fine.rainfallMm));
      const wi = 1 + argBy(next, (d) => d.fine.rainfallMm);
      let text = pick(
        lang,
        `${action}${/today/i.test(action) ? '' : ' today'}. Your crop needs about ${mm(ctx.et0)} of water today (ET₀) and ${mm(ctx.fine.rainfallMm)} of rain is expected: ${def > 0 ? `a deficit of ${mm(def)}` : 'no deficit'}.`,
        `${/आज/.test(action) ? '' : 'आज: '}${action}। आज फसल को लगभग ${mm(ctx.et0)} पानी चाहिए (ET₀) और ${mm(ctx.fine.rainfallMm)} बारिश अपेक्षित है: ${def > 0 ? `कमी ${mm(def)}` : 'कोई कमी नहीं'}।`,
        `${/இன்று/.test(action) ? '' : 'இன்று: '}${action}. இன்று பயிருக்கு சுமார் ${mm(ctx.et0)} நீர் தேவை (ET₀), ${mm(ctx.fine.rainfallMm)} மழை எதிர்பார்க்கப்படுகிறது: ${def > 0 ? `பற்றாக்குறை ${mm(def)}` : 'பற்றாக்குறை இல்லை'}.`
      );
      if (next3 >= 10)
        text += pick(
          lang,
          ` ${mm(next3)} of rain is due by ${L(wi)}, so you can skip the following irrigation.`,
          ` ${L(wi)} तक ${mm(next3)} बारिश आने वाली है, इसलिए अगली सिंचाई छोड़ सकते हैं।`,
          ` ${L(wi)} வரை ${mm(next3)} மழை வரும், அடுத்த நீர்ப்பாசனத்தைத் தவிர்க்கலாம்.`
        );
      if (def > 5) text += pick(lang, ' Irrigate after 17:00 to cut evaporation losses.', ' शाम 5 बजे के बाद सिंचाई करें ताकि वाष्पीकरण कम हो।', ' ஆவியாதலைக் குறைக்க மாலை 5 மணிக்குப் பிறகு நீர் பாய்ச்சவும்.');
      return done(text, 'irrigate', ['FAO-56 ET₀', 'Effective rain 80%', '3-day rain']);
    }

    case 'frost': {
      const i = typeof day === 'number' ? day : argBy(week, (d) => d.fine.tempMin, false);
      const d = week[i];
      const gap = Math.round((d.fine.tempMin - d.coarse.tempMin) * 10) / 10;
      let text =
        d.fine.tempMin <= 4
          ? pick(
              lang,
              `Frost risk: ${L(i)} night drops to ${d.fine.tempMin}°C in ${place} (district block ${d.coarse.tempMin}°C). Irrigate the evening before and light smoke fires before dawn; cover nursery beds.`,
              `पाले का खतरा: ${L(i)} रात ${place} में ${d.fine.tempMin}°C (ज़िला ब्लॉक ${d.coarse.tempMin}°C)। शाम को सिंचाई करें, भोर से पहले धुआँ करें और नर्सरी ढकें।`,
              `பனி அபாயம்: ${L(i)} இரவு ${place}-இல் ${d.fine.tempMin}°C (மாவட்டத் தொகுதி ${d.coarse.tempMin}°C). மாலையில் நீர் பாய்ச்சி, விடியும் முன் புகை மூட்டவும்; நாற்றங்காலை மூடவும்.`
            )
          : pick(
              lang,
              `No frost risk${typeof day === 'number' ? ` ${Lm(i)}` : ' this week'}. ${typeof day === 'number' ? 'Night low' : `Coldest night: ${L(i)} at`} ${d.fine.tempMin}°C in ${place} (district block ${d.coarse.tempMin}°C).`,
              `${typeof day === 'number' ? L(i) : 'इस हफ्ते'} पाले का खतरा नहीं। सबसे कम तापमान ${L(i)}: ${d.fine.tempMin}°C (ज़िला ब्लॉक ${d.coarse.tempMin}°C)।`,
              `${typeof day === 'number' ? L(i) : 'இந்த வாரம்'} பனி அபாயம் இல்லை. குறைந்த வெப்பநிலை ${L(i)}: ${d.fine.tempMin}°C (மாவட்டத் தொகுதி ${d.coarse.tempMin}°C).`
            );
      if (gap <= -0.5)
        text += pick(
          lang,
          ` Nights here run ${Math.abs(gap)}°C colder than the district forecast (${topStep(ctx.detail.tmin, true)}).`,
          ` यहाँ रातें ज़िला पूर्वानुमान से ${Math.abs(gap)}°C ज़्यादा ठंडी रहती हैं।`,
          ` இங்கு இரவுகள் மாவட்ட முன்னறிவிப்பை விட ${Math.abs(gap)}°C குளிராக இருக்கும்.`
        );
      return done(text, 'frost', ['Lapse rate', 'Cold-air pooling', '7-day outlook'], { id: 'grid', label: pick(lang, 'See cold pockets', 'ठंडे इलाके देखें', 'குளிர் பகுதிகள்') });
    }

    case 'heat': {
      const h = argBy(week, (d) => d.fine.tempMax);
      const i = typeof day === 'number' ? day : 0;
      const d = week[i];
      const peak = week[h].fine.tempMax;
      const advice =
        peak >= 40
          ? pick(lang, 'Heat stress: irrigate in the evening, avoid field work 12:00–15:00, give livestock shade and water.', 'लू का खतरा: शाम को सिंचाई करें, 12–3 बजे खेत का काम न करें, पशुओं को छाया और पानी दें।', 'வெப்ப அழுத்தம்: மாலையில் நீர் பாய்ச்சவும், 12–3 மணி வயல் வேலை தவிர்க்கவும், கால்நடைகளுக்கு நிழலும் நீரும் கொடுக்கவும்.')
          : peak >= 35
          ? pick(lang, 'Warm spell: finish field work before 11:00 and mulch to save soil moisture.', 'गर्मी: खेत का काम सुबह 11 बजे से पहले करें और नमी बचाने के लिए मल्चिंग करें।', 'வெப்பம்: வயல் வேலையைக் காலை 11 மணிக்கு முன் முடித்து, ஈரம் காக்க மூடாக்கு இடவும்.')
          : pick(lang, 'No heat stress expected.', 'गर्मी का कोई खतरा नहीं।', 'வெப்ப அழுத்தம் இல்லை.');
      return done(
        pick(
          lang,
          `${L(i)} in ${place}: ${d.fine.tempMin}–${d.fine.tempMax}°C (district block ${d.coarse.tempMin}–${d.coarse.tempMax}°C). Hottest day this week: ${L(h)} at ${peak}°C. ${advice}`,
          `${L(i)} ${place} में: ${d.fine.tempMin}–${d.fine.tempMax}°C (ज़िला ब्लॉक ${d.coarse.tempMin}–${d.coarse.tempMax}°C)। इस हफ्ते सबसे गर्म दिन ${L(h)}: ${peak}°C। ${advice}`,
          `${L(i)} ${place}-இல்: ${d.fine.tempMin}–${d.fine.tempMax}°C (மாவட்டத் தொகுதி ${d.coarse.tempMin}–${d.coarse.tempMax}°C). இந்த வாரம் அதிக வெப்ப நாள் ${L(h)}: ${peak}°C. ${advice}`
        ),
        'heat',
        ['Lapse rate', '7-day outlook']
      );
    }

    case 'pest': {
      const humid = week.filter((d) => d.fine.relativeHumidity >= 85).length;
      const lvl = { high: ['high', 'अधिक', 'அதிக'], moderate: ['moderate', 'मध्यम', 'மிதமான'], low: ['low', 'कम', 'குறைந்த'] }[ctx.pest.level];
      let text = pick(
        lang,
        `${crop}: ${ctx.pest.title}, ${lvl[0]} risk. ${ctx.pest.detail}`,
        `${crop}: ${ctx.pest.title}: जोखिम ${lvl[1]}। नमी ${ctx.fine.relativeHumidity}%, रात का तापमान ${ctx.fine.tempMin}°C। ${ctx.pest.level === 'low' ? 'साप्ताहिक निगरानी जारी रखें।' : 'अगले सूखे समय में सुरक्षात्मक छिड़काव करें और खेत की निगरानी करें।'}`,
        `${crop}: ${ctx.pest.title}: ${lvl[2]} அபாயம். ஈரப்பதம் ${ctx.fine.relativeHumidity}%, இரவு வெப்பநிலை ${ctx.fine.tempMin}°C. ${ctx.pest.level === 'low' ? 'வாராந்திர கண்காணிப்பைத் தொடரவும்.' : 'அடுத்த வறண்ட நேரத்தில் பாதுகாப்பு தெளிப்பு செய்து வயலைக் கண்காணிக்கவும்.'}`
      );
      if (humid >= 2)
        text += pick(
          lang,
          ` ${humid} of the next 7 days are humid (RH ≥ 85%), so keep scouting.`,
          ` अगले 7 में से ${humid} दिन नमी वाले हैं (≥ 85%), निगरानी जारी रखें।`,
          ` அடுத்த 7 நாட்களில் ${humid} நாட்கள் ஈரப்பதம் அதிகம் (≥ 85%), கண்காணிப்பைத் தொடரவும்.`
        );
      return done(text, 'pest', ['Crop disease rules', 'Village humidity & temperature']);
    }

    case 'harvest': {
      const r = dryRun(week, 2);
      if (!r)
        return done(
          pick(
            lang,
            'No run of 2 dry days this week. Harvest only if the crop is at risk, and keep the produce under tarpaulin.',
            'इस हफ्ते लगातार 2 सूखे दिन नहीं हैं। कटाई ज़रूरी हो तभी करें और उपज को तिरपाल से ढकें।',
            'இந்த வாரம் தொடர்ந்து 2 வறண்ட நாட்கள் இல்லை. அவசியமானால் மட்டும் அறுவடை செய்து, தார்ப்பாயால் மூடவும்.'
          ),
          'harvest',
          ['7-day outlook', 'Dry-spell finder']
        );
      const [a, b] = r;
      const n = b - a + 1;
      const after = b + 1 < week.length ? b + 1 : -1;
      const before =
        after >= 0
          ? pick(lang, ` Finish drying before ${L(after)}'s ${mm(week[after].fine.rainfallMm)}.`, ` ${L(after)} की ${mm(week[after].fine.rainfallMm)} बारिश से पहले सुखाई पूरी करें।`, ` ${L(after)} ${mm(week[after].fine.rainfallMm)} மழைக்கு முன் உலர்த்தலை முடிக்கவும்.`)
          : '';
      return done(
        pick(
          lang,
          `Best harvest window: ${L(a)} to ${Lm(b)}, ${n} dry days in a row (under 2.5 mm each). Harvest ${onDay(a)} and sun-dry the produce.${before}`,
          `कटाई का सबसे अच्छा समय: ${L(a)} से ${L(b)}, लगातार ${n} सूखे दिन (हर दिन 2.5 मिमी से कम)। ${onDay(a)} कटाई करें और धूप में सुखाएँ।${before}`,
          `அறுவடைக்கு சிறந்த நேரம்: ${L(a)} முதல் ${L(b)} வரை, தொடர்ந்து ${n} வறண்ட நாட்கள் (ஒவ்வொரு நாளும் 2.5 மி.மீக்குக் குறைவு). ${onDay(a)} அறுவடை செய்து வெயிலில் உலர்த்தவும்.${before}`
        ),
        'harvest',
        ['7-day outlook', 'Dry-spell finder']
      );
    }

    case 'sow': {
      const total = sum(week.map((d) => d.fine.rainfallMm));
      const heavy = week.slice(0, 4).findIndex((d) => d.fine.rainfallMm >= 64.5);
      if (heavy >= 0)
        return done(
          pick(
            lang,
            `Hold sowing: ${mm(week[heavy].fine.rainfallMm)} of heavy rain on ${L(heavy)} can wash seed away and crust the soil. Sow 1–2 days after it, once the field drains.`,
            `बुवाई रोकें: ${L(heavy)} को ${mm(week[heavy].fine.rainfallMm)} भारी बारिश से बीज बह सकते हैं और मिट्टी में पपड़ी बन सकती है। पानी निकलने के 1–2 दिन बाद बोएँ।`,
            `விதைப்பை நிறுத்தவும்: ${L(heavy)} அன்று ${mm(week[heavy].fine.rainfallMm)} கனமழை விதைகளை அடித்துச் செல்லலாம். வடிகால் ஆன 1–2 நாட்களுக்குப் பிறகு விதைக்கவும்.`
          ),
          'sow',
          ['7-day outlook', 'IMD rain classes']
        );
      const k = week.findIndex((d, i) => i >= 1 && i <= 4 && d.fine.rainfallMm >= 5);
      if (k >= 1)
        return done(
          pick(
            lang,
            `Sow ${k - 1 === 0 ? 'today' : `on ${L(k - 1)}`}, just before ${L(k)}'s ${mm(week[k].fine.rainfallMm)} of rain: the seed gets moisture without being washed out.`,
            `${L(k - 1)} बुवाई करें, ${L(k)} की ${mm(week[k].fine.rainfallMm)} बारिश से ठीक पहले: बीज को नमी मिलेगी और बहेगा नहीं।`,
            `${L(k - 1)} விதைக்கவும், ${L(k)} ${mm(week[k].fine.rainfallMm)} மழைக்கு சற்று முன்: விதைக்கு ஈரம் கிடைக்கும்.`
          ),
          'sow',
          ['7-day outlook', 'IMD rain classes']
        );
      return done(
        total < 5
          ? pick(
              lang,
              `No useful rain in the next 7 days (${mm(total)}). Sow only with assured irrigation: pre-irrigate 2 days before sowing.`,
              `अगले 7 दिनों में उपयोगी बारिश नहीं (${mm(total)})। सिंचाई की सुविधा हो तभी बोएँ: बुवाई से 2 दिन पहले पलेवा करें।`,
              `அடுத்த 7 நாட்களில் பயனுள்ள மழை இல்லை (${mm(total)}). நீர்ப்பாசன வசதி இருந்தால் மட்டும் விதைக்கவும்; விதைப்புக்கு 2 நாள் முன் நீர் பாய்ச்சவும்.`
            )
          : pick(
              lang,
              `Only light rain this week (${mm(total)}). Sow after a pre-sowing irrigation and cover the seed lightly.`,
              `इस हफ्ते केवल हल्की बारिश (${mm(total)})। पलेवा के बाद बुवाई करें।`,
              `இந்த வாரம் லேசான மழை மட்டுமே (${mm(total)}). நீர் பாய்ச்சிய பின் விதைக்கவும்.`
            ),
        'sow',
        ['7-day outlook']
      );
    }

    case 'fertilizer': {
      const wet = week.slice(0, 3).findIndex((d) => d.fine.rainfallMm >= 20);
      if (wet >= 0)
        return done(
          pick(
            lang,
            `Hold urea and fertilizer until after ${L(wet)}: ${mm(week[wet].fine.rainfallMm)} of rain would wash the nitrogen away. Apply once the soil is moist but not waterlogged.`,
            `${L(wet)} के बाद तक यूरिया/खाद न डालें: ${mm(week[wet].fine.rainfallMm)} बारिश से नाइट्रोजन बह जाएगी। मिट्टी नम हो पर पानी भरा न हो, तब डालें।`,
            `${L(wet)} வரை யூரியா/உரம் இட வேண்டாம்: ${mm(week[wet].fine.rainfallMm)} மழை நைட்ரஜனை அடித்துச் செல்லும். மண் ஈரமாக, ஆனால் நீர் தேங்காமல் இருக்கும்போது இடவும்.`
          ),
          'fertilizer',
          ['48 h rain', 'Nitrogen leaching rule']
        );
      return done(
        pick(
          lang,
          'Good time to top-dress today: no heavy rain in the next 48 hours. Apply in the evening and follow with a light irrigation.',
          'आज खाद डालने का अच्छा समय है: अगले 48 घंटों में भारी बारिश नहीं। शाम को डालें और हल्की सिंचाई करें।',
          'இன்று மேலுரம் இட நல்ல நேரம்: அடுத்த 48 மணி நேரத்தில் கனமழை இல்லை. மாலையில் இட்டு லேசாக நீர் பாய்ச்சவும்.'
        ),
        'fertilizer',
        ['48 h rain', 'Nitrogen leaching rule']
      );
    }

    case 'wind': {
      const i = typeof day === 'number' ? day : 0;
      const d = week[i];
      const w = argBy(week, (x) => x.fine.windSpeedKmh);
      const ws = topStep(ctx.detail.wind, false);
      let text = pick(
        lang,
        `${L(i)}: wind about ${kmh(d.fine.windSpeedKmh)} in ${place} (district block ${kmh(d.coarse.windSpeedKmh)})${ws ? `, shaped by ${ws}` : ''}. Windiest day: ${L(w)} at ${kmh(week[w].fine.windSpeedKmh)}.`,
        `${L(i)}: ${place} में हवा लगभग ${kmh(d.fine.windSpeedKmh)} (ज़िला ब्लॉक ${kmh(d.coarse.windSpeedKmh)})। सबसे तेज़ हवा ${L(w)} को ${kmh(week[w].fine.windSpeedKmh)}।`,
        `${L(i)}: ${place}-இல் காற்று சுமார் ${kmh(d.fine.windSpeedKmh)} (மாவட்டத் தொகுதி ${kmh(d.coarse.windSpeedKmh)}). அதிக காற்று ${L(w)} அன்று ${kmh(week[w].fine.windSpeedKmh)}.`
      );
      if (d.fine.windSpeedKmh > 15) text += pick(lang, ' Too windy to spray: drift risk.', ' छिड़काव के लिए हवा बहुत तेज़ है।', ' தெளிப்புக்கு காற்று அதிகம்.');
      return done(text, 'wind', ['Terrain wind model', '7-day outlook']);
    }

    case 'why': {
      const steps = [...ctx.detail.tmin].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 3);
      const list = steps.map((s) => `${s.label.toLowerCase()} (${s.value >= 0 ? '+' : '−'}${Math.abs(Math.round(s.value * 10) / 10)}°C)`).join(', ');
      const ce = Math.round(ctx.coarseElevationM);
      return done(
        pick(
          lang,
          `The district model sees the whole 18 km block at one average height (${ce} m). ${place} is at ${p.elevationM} m, so AeroAgro applies terrain physics${list ? `: ${list}` : ''}. Result: night low ${ctx.coarse.tempMin} → ${ctx.fine.tempMin}°C, rain ${mm(ctx.coarse.rainfallMm)} → ${mm(ctx.fine.rainfallMm)}.`,
          `ज़िला मॉडल 18 किमी के पूरे ब्लॉक को एक औसत ऊँचाई (${ce} मीटर) पर देखता है। ${place} ${p.elevationM} मीटर पर है, इसलिए ऊँचाई, ढलान, ठंडी हवा के जमाव और भू-भाग के असर से रात का तापमान ${ctx.coarse.tempMin} से ${ctx.fine.tempMin}°C और बारिश ${mm(ctx.coarse.rainfallMm)} से ${mm(ctx.fine.rainfallMm)} हो जाती है।`,
          `மாவட்ட மாதிரி 18 கி.மீ தொகுதி முழுவதையும் ஒரே சராசரி உயரத்தில் (${ce} மீ) பார்க்கிறது. ${place} ${p.elevationM} மீ உயரத்தில் உள்ளது; உயரம், சரிவு, குளிர் காற்று தேக்கம், நிலப்பரப்பு காரணமாக இரவு வெப்பநிலை ${ctx.coarse.tempMin}-இலிருந்து ${ctx.fine.tempMin}°C ஆகவும், மழை ${mm(ctx.coarse.rainfallMm)}-இலிருந்து ${mm(ctx.fine.rainfallMm)} ஆகவும் மாறுகிறது.`
        ),
        'why',
        ['Explainable downscaling', 'Terrain covariates'],
        { id: 'explain', label: pick(lang, 'See step by step', 'हर कदम देखें', 'படிப்படியாகப் பார்க்க') }
      );
    }

    case 'insurance': {
      const trR = /paddy|rice/i.test(crop) ? 60 : /wheat/i.test(crop) ? 30 : 35;
      const trF = /apple/i.test(crop) ? 0 : 3.5;
      const breach = ctx.fine.rainfallMm >= trR || ctx.fine.tempMin <= trF || ctx.fine.windSpeedKmh >= 35;
      const wr = argBy(week, (d) => d.fine.rainfallMm);
      const weekBreach = week.some((d) => d.fine.rainfallMm >= trR || d.fine.tempMin <= trF);
      return done(
        pick(
          lang,
          `PMFBY weather-index check for ${crop} in ${place}: rain trigger ${mm(trR)}, frost trigger ${trF}°C. Today ${mm(ctx.fine.rainfallMm)} and ${ctx.fine.tempMin}°C: ${breach ? 'a trigger is breached' : 'no trigger is breached'}. Week peak: ${mm(week[wr].fine.rainfallMm)} on ${L(wr)}${weekBreach ? ', which crosses a trigger' : ''}.`,
          `${crop} के लिए PMFBY मौसम-सूचकांक जाँच: बारिश सीमा ${mm(trR)}, पाला सीमा ${trF}°C। आज ${mm(ctx.fine.rainfallMm)} और ${ctx.fine.tempMin}°C: ${breach ? 'सीमा पार हुई है' : 'कोई सीमा पार नहीं'}। हफ्ते में सबसे ज़्यादा ${L(wr)} को ${mm(week[wr].fine.rainfallMm)}।`,
          `${crop}-க்கான PMFBY வானிலைக் குறியீட்டுச் சோதனை: மழை வரம்பு ${mm(trR)}, பனி வரம்பு ${trF}°C. இன்று ${mm(ctx.fine.rainfallMm)}, ${ctx.fine.tempMin}°C: ${breach ? 'வரம்பு மீறப்பட்டுள்ளது' : 'எந்த வரம்பும் மீறப்படவில்லை'}. வாரத்தின் அதிகபட்சம் ${L(wr)} அன்று ${mm(week[wr].fine.rainfallMm)}.`
        ),
        'insurance',
        ['PMFBY / WBCIS triggers', '7-day outlook'],
        { id: 'insurance', label: pick(lang, 'Open evidence report', 'साक्ष्य रिपोर्ट खोलें', 'சான்று அறிக்கை') }
      );
    }

    case 'greet':
      return done(
        pick(
          lang,
          `Namaste! I'm AeroAgro, your village weather assistant for ${place}. Ask me when to spray, whether it will rain, if you should irrigate, or about frost, pests, harvest, sowing, fertilizer and crop insurance.`,
          `नमस्ते! मैं AeroAgro हूँ, ${place} के लिए आपका गाँव-स्तरीय मौसम सहायक। पूछिए: छिड़काव कब करें, बारिश होगी या नहीं, सिंचाई, पाला, कीट, कटाई, बुवाई, खाद या फसल बीमा।`,
          `வணக்கம்! நான் AeroAgro, ${place}-க்கான உங்கள் கிராம வானிலை உதவியாளர். எப்போது தெளிப்பது, மழை வருமா, நீர்ப்பாசனம், பனி, பூச்சி, அறுவடை, விதைப்பு, உரம், பயிர் காப்பீடு பற்றிக் கேளுங்கள்.`
        ),
        'greet',
        []
      );

    default: {
      // Overview (also the fallback when no intent is recognised)
      const i = typeof day === 'number' ? day : 0;
      const d = week[i];
      const rc = rainClass(d.fine.rainfallMm);
      const sky = describeSky(d.fine);
      const spray = d.spray.hours > 0 ? d.spray.label : pick(lang, 'not advised', 'नहीं', 'வேண்டாம்');
      let text = pick(
        lang,
        `${L(i)} in ${place}: ${sky.label.toLowerCase()}, ${d.fine.tempMin}–${d.fine.tempMax}°C, ${rc.en} (${mm(d.fine.rainfallMm)}), wind ${kmh(d.fine.windSpeedKmh)}, humidity ${d.fine.relativeHumidity}%. Spraying: ${spray}.`,
        `${L(i)} ${place} में: ${d.fine.tempMin}–${d.fine.tempMax}°C, ${rc.hi} (${mm(d.fine.rainfallMm)}), हवा ${kmh(d.fine.windSpeedKmh)}, नमी ${d.fine.relativeHumidity}%। छिड़काव: ${spray}।`,
        `${L(i)} ${place}-இல்: ${d.fine.tempMin}–${d.fine.tempMax}°C, ${rc.ta} (${mm(d.fine.rainfallMm)}), காற்று ${kmh(d.fine.windSpeedKmh)}, ஈரப்பதம் ${d.fine.relativeHumidity}%. தெளிப்பு: ${spray}.`
      );
      if (typeof day !== 'number') {
        const total = sum(week.map((x) => x.fine.rainfallMm));
        const best = bestSprayDay(week);
        text += pick(
          lang,
          ` This week: ${mm(total)} of rain${best >= 0 ? `, best spray day ${L(best)}` : ''}.`,
          ` इस हफ्ते: ${mm(total)} बारिश${best >= 0 ? `, छिड़काव के लिए सबसे अच्छा दिन ${L(best)}` : ''}।`,
          ` இந்த வாரம்: ${mm(total)} மழை${best >= 0 ? `, தெளிப்புக்கு சிறந்த நாள் ${L(best)}` : ''}.`
        );
      }
      if (!intent)
        text += pick(
          lang,
          ' You can also ask about spraying, rain, irrigation, frost, pests, harvest, sowing, fertilizer or insurance.',
          ' आप छिड़काव, बारिश, सिंचाई, पाला, कीट, कटाई, बुवाई, खाद या बीमा के बारे में भी पूछ सकते हैं।',
          ' தெளிப்பு, மழை, நீர்ப்பாசனம், பனி, பூச்சி, அறுவடை, விதைப்பு, உரம் அல்லது காப்பீடு பற்றியும் கேட்கலாம்.'
        );
      return done(text, 'overview', ['Village forecast 1.2 km', '7-day outlook'], { id: 'bulletin', label: pick(lang, 'Open agromet bulletin', 'कृषि मौसम बुलेटिन', 'வேளாண் வானிலை அறிக்கை') });
    }
  }
}

export const SUGGESTIONS: Record<Lang, string[]> = {
  en: [
    'When should I spray this week?',
    'Will it rain tomorrow?',
    'Should I irrigate today?',
    'Any frost risk?',
    'When can I harvest?',
    'Why is my village different from the district?',
    'Is it a good time for urea?',
    'Pest risk for my crop?',
  ],
  hi: ['इस हफ्ते छिड़काव कब करूँ?', 'कल बारिश होगी?', 'आज सिंचाई करूँ?', 'पाले का खतरा है?', 'कटाई कब करूँ?', 'मेरे गाँव का मौसम ज़िले से अलग क्यों है?', 'यूरिया डालने का सही समय?', 'मेरी फसल में कीट का खतरा?'],
  ta: [
    'இந்த வாரம் எப்போது தெளிக்கலாம்?',
    'நாளை மழை வருமா?',
    'இன்று நீர் பாய்ச்சலாமா?',
    'பனி அபாயம் உள்ளதா?',
    'எப்போது அறுவடை செய்யலாம்?',
    'என் கிராமம் மாவட்டத்திலிருந்து ஏன் வேறுபடுகிறது?',
    'யூரியா போட சரியான நேரம்?',
    'என் பயிருக்கு பூச்சி அபாயம்?',
  ],
};
