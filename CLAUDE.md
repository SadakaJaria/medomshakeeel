# CLAUDE.md — منصة "ميداس الحلال" (اسم مؤقت)

## ما هو المشروع
تيرمينال أسواق مالية شخصي متوافق مع الشريعة الإسلامية — نسخة خاصة من فكرة Midas لكن بفلتر شرعي.
- للاستخدام الشخصي فقط (مستخدم واحد: مالك المشروع). لا حاجة لنظام مستخدمين متعدد.
- الهدف: متابعة وتعلّم — أسهم، صناديق، صكوك/سندات إسلامية، عملات، ذهب ومعادن — قراءات تاريخية، مؤشرات فنية، أخبار يومية، وتحليل AI.
- تغطية عالمية مع تركيز على: السوق الأمريكي، التركي (BIST)، والخليجي.
- ليست منصة تداول ولا تنفيذ أوامر — عرض وتحليل فقط.

## المالك وأسلوب العمل
- المالك: محمود — طالب إدارة استثمار ومحافظ، يتقن React/Vite/Tailwind/Vercel من مشاريع سابقة (kuveytturk-funds.vercel.app، بوابة عيادة على Firebase).
- اللغة الأساسية للتواصل: عربي (لهجة شامية). واجهة المنصة: عربي RTL أولاً مع أرقام ورموز مالية لاتينية.
- يفضّل: ملفات كاملة عند التسليم (لا تعديلات جزئية غامضة)، إيجاز في الشرح، استشارته قبل أي تغيير هيكلي كبير.
- GitHub: SadakaJaria. النشر: Vercel.

## الستاك
- **Frontend:** React 18 + Vite + Tailwind CSS — SPA + PWA (installable).
- **State:** React state/context — لا Redux إلا لو دعت الحاجة فعلاً.
- **Charts:** TradingView Embed Widgets (الأساس) — Advanced Chart, Ticker Tape, Market Overview, Heatmap, Economic Calendar, Symbol Info. لا نبني محرك شارتات ذاتي.
- **AI:** Anthropic Claude API لتحليل الأسهم/الأخبار (زر "حلّل" في صفحة الورقة المالية).
- **تخزين البيانات الشخصية** (watchlists، الكون الحلال، إعدادات): ملف JSON محلي + مزامنة عبر GitHub Gist (نمط مجرّب سابقاً) — أو الترقية لاحقاً لـ Firestore.
- **النشر:** Vercel. متغيرات البيئة عبر Vercel env (لا مفاتيح في الكود أبداً).

## مصادر البيانات (APIs)
| الغرض | المصدر | ملاحظات |
|---|---|---|
| شارتات + مؤشرات فنية | TradingView widgets | مجاني، تضمين مباشر، يغطي BIST وكل الأسواق |
| فرز شرعي | **Halal Terminal API** (قرار 2026-07): $19/شهر، مفتاح مجاني فوري للتجربة، X-API-Key، 200K+ أصل، 5 منهجيات، توثيق علني على api.halalterminal.com. (المرشحون السابقون: Musaffa = B2B فقط بدون أسعار معلنة؛ HalalScreener = $10/شهر لكن توثيق API غير علني) | الطبقة محايدة (`src/lib/screening/`) — تبديل المزود = تبديل adapter واحد. الحالة شبه ثابتة: تخطّي المفحوص خلال 30 يوم |
| أخبار لكل سهم + سوق | Finnhub (free tier: 60 calls/min) | |
| بيانات خام وقوائم مالية وتوقعات محللين | FMP و/أو Twelve Data (free: 800 calls/day) | FMP متوفر أيضاً كـ MCP connector أثناء التطوير |
| أسعار BIST/صناديق تركية | تغطية APIs ضعيفة — الحل: TradingView widgets للعرض + إدخال/مزامنة يدوية عند الحاجة | نمط Gist المجرّب في مشروع كويت تورك |

## قلب المشروع: قاعدة "الكون الحلال"
ملف/مجموعة `halal-universe` — كل ورقة مالية معتمدة لدى المالك:
```json
{
  "symbol": "AAPL",
  "exchange": "NASDAQ",
  "tvSymbol": "NASDAQ:AAPL",
  "type": "stock | fund | sukuk | etf | commodity | currency",
  "market": "US | BIST | GCC | GLOBAL",
  "shariah": {
    "status": "compliant | non_compliant | questionable | not_screened",
    "source": "musaffa | halalscreener | manual",
    "purificationRatio": 0.0,
    "lastChecked": "ISO date"
  },
  "tags": ["tech", "dividend"],
  "notes": ""
}
```
- تنبيه بصري واضح إذا تغيّرت حالة ورقة من متوافقة إلى غير متوافقة.
- الأوراق غير المتوافقة لا تُخفى بالضرورة — تُعلَّم بوضوح (المالك يتعلم، يحتاج يرى الصورة).

## هيكل الصفحات (النسخة الأولى MVP)
1. **الداشبورد:** نظرة عامة أسواق (TradingView Market Overview + Ticker Tape) + عملات وذهب + أهم الأخبار + ملخص حالة الكون الحلال.
2. **Watchlist:** قوائم مقسمة حسب السوق/النوع، كل صف: سعر، تغيّر، حالة شرعية (شارة ملونة).
3. **صفحة الورقة المالية:** شارت TradingView متقدم + بطاقة الحالة الشرعية (النسب، التطهير، تاريخ الفحص) + أخبار الورقة (Finnhub) + زر تحليل AI.

### مراحل لاحقة (بعد MVP)
- تحليل AI موسّع (قراءة قوائم مالية، مقارنات).
- الصكوك والصناديق الإسلامية (إدخال يدوي منظم).
- حاسبة زكاة + حاسبة تطهير أرباح.
- تقويم اقتصادي + heatmap قطاعات.

## اتجاه التصميم
- طابع تيرمينال مالي محترف: داكن افتراضياً، كثافة معلومات عالية، أخضر/أحمر للحركة، خط عربي واضح (IBM Plex Sans Arabic أو مشابه) + monospace للأرقام.
- RTL كامل مع انتباه: الشارتات والأرقام تبقى LTR داخلياً.
- استلهام من: Midas, TradingView, Bloomberg — دون نسخ.
- لا تصميم "قالب جاهز" — راجع skill الـ frontend-design عند بناء أي واجهة.

## قواعد للجلسات
- اقرأ هذا الملف أول كل جلسة. حدّثه عند أي قرار معماري جديد.
- لا تغييرات هيكلية كبيرة (تبديل مكتبة، إعادة تنظيم مجلدات جذرية) دون موافقة صريحة من المالك.
- المفاتيح (API keys) في `.env` فقط، و`.env` في `.gitignore` دائماً.
- كل ميزة جديدة: جرّبها محلياً (`npm run dev`) قبل اعتبارها منجزة.
- Commits صغيرة بعناوين واضحة بالإنجليزية.

## حالة المشروع
- [x] تهيئة المشروع (Vite + React + Tailwind + PWA + RTL) — Vite 8 + React 19 + Tailwind v4 (`@tailwindcss/vite`) + `vite-plugin-pwa`. ملاحظة: React 19 بدل 18 (ما جاء مع القالب الحديث، متوافق تماماً).
- [x] هيكل المجلدات + مكونات الأساس (Layout, Nav, ThemeProvider) — `src/components/layout/`, `src/context/`, `src/pages/` مع react-router v7 للتنقل (قرار معماري: راوتر قياسي للـ SPA + `vercel.json` rewrites). ثيم داكن/فاتح يُحفظ في localStorage.
- [x] تضمين أول TradingView widgets (Ticker Tape + Market Overview) — مكوّن `TradingViewEmbed` عام (dir=ltr، يعيد التحميل عند تغيّر الثيم/الإعدادات) في `src/components/tradingview/`. ملاحظة: بيئة التطوير السحابية تحجب s3.tradingview.com فالتحقق البصري النهائي يتم محلياً/على Vercel.
- [x] بنية halal-universe + شاشة إدارتها — `HalalUniverseContext` (localStorage، seed في `src/data/`، مفتاح فريد tvSymbol) + صفحة `/universe`: جدول بفلاتر (بحث/سوق/نوع/حالة)، نموذج إضافة/تعديل، حذف، تصدير/استيراد JSON. تنبيه ⚠ تلقائي عند الانتقال من متوافقة لغير متوافقة (يُحفظ previousStatus). ثوابت التسميات في `src/lib/halal.js`. مزامنة Gist لاحقاً.
- [x] Watchlist — عضوية المتابعة flag `watchlist` على ورقة الكون الحلال (نجمة ★ في شاشة الإدارة). صفحة `/watchlist`: بطاقات مقسمة حسب السوق، السعر والتغيّر عبر TradingView Single-Quote widget + شارة شرعية + رابط لصفحة الورقة `/security/:tvSymbol`.
- [x] صفحة الورقة المالية — `/security/:tvSymbol`: شارت Advanced Chart + شريط Symbol Info + بطاقة `ShariahCard` كاملة (المصدر، نسبة التطهير، آخر فحص، تنبيه الانقلاب، وسوم، ملاحظات) + نجمة متابعة. رمز خارج الكون يظهر تحذير مع رابط للإدارة. `/security` بدون رمز = قائمة اختيار. زر "حلّل" والأخبار placeholders لبنودهما.
- [x] ربط Finnhub للأخبار — `src/lib/finnhub.js` (أخبار سوق عامة + أخبار شركة آخر 14 يوم، كاش sessionStorage لمدة 10 دقائق احتراماً للـ free tier) + hook `useNews` + مكوّن `NewsList` (حالات: بلا مفتاح/تحميل/خطأ/فارغ، وقت نسبي عربي). الداشبورد يعرض 8 أخبار سوق، صفحة الورقة أخبار الرمز المجرد. يتطلب `VITE_FINNHUB_API_KEY` في `.env`.
- [x] قرار وربط API الفرز الشرعي — **القرار: Halal Terminal API** (بموافقة المالك بعد مقارنة الخيارات). طبقة محايدة `src/lib/screening/` (orchestrator يتخطى المفحوص خلال 30 يوم والأنواع غير القابلة للفرز، تسلسلي مع مهلة 400ms) + adapter `halalterminal.js` (تطبيع مرن للحالات والنسب). زر "تحديث الفرز" في `/universe` مع تقدم وملخص. يتطلب `VITE_HALALTERMINAL_API_KEY`. ⚠ مسار endpoint الفرز الفردي (`SCREEN_PATH`) مكتوب على النمط المعلن دون رؤية التوثيق الكامل (محجوب من بيئة التطوير) — تحقق منه أول تشغيل بمفتاح حقيقي.
- [x] تحليل AI (Claude API) — **قرار معماري: المفتاح server-side فقط** عبر Vercel function (`api/analyze.js`، SDK رسمي `@anthropic-ai/sdk`، النموذج `claude-opus-4-8` مع adaptive thinking، قابل للتغيير عبر `ANALYZE_MODEL`) + dev middleware في vite.config حتى يعمل مع `npm run dev`. البرومبت يستقبل النسب المالية الخام والمنهجيات الخمس من Halal Terminal + سعر Finnhub + آخر الأخبار → تحليل يربط الفني بالشرعي (بنية: نظرة فنية / قراءة شرعية بالأرقام / خلاصة). `AnalyzeCard` في صفحة الورقة (كاش ساعة بالـ sessionStorage + زر إعادة). يتطلب `ANTHROPIC_API_KEY` (بدون VITE_) في `.env` محلياً وVercel env للنشر، و`maxDuration: 60` مضبوطة في vercel.json.
- [x] PWA + نشر Vercel — PWA مكتملة ومتحقق منها على بناء الإنتاج: SW يتفعل، offline كامل (navigateFallback للـ SPA مع استثناء `/api`)، كاش خطوط Google، أيقونة iOS، manifest عربي RTL. خطوات النشر (استيراد الريبو + 4 متغيرات بيئة) موثقة في README — **الخطوة اليدوية الوحيدة المتبقية: ربط الريبو بـ Vercel من حساب المالك وإضافة المفاتيح**. الأيقونات الحالية placeholder — تُستبدل عند اعتماد هوية بصرية.
