# ميداس الحلال (اسم مؤقت)

تيرمينال أسواق مالية شخصي متوافق مع الشريعة الإسلامية — عرض وتحليل فقط، ليس منصة تداول.

## الستاك
- React 19 + Vite 8 + Tailwind CSS v4
- PWA عبر `vite-plugin-pwa`
- واجهة عربية RTL بالكامل (الأرقام والرموز المالية LTR)

## التشغيل محلياً
```bash
npm install
npm run dev
```

## البناء
```bash
npm run build
npm run preview
```

## المفاتيح
انسخ `.env.example` إلى `.env` وعبّئ المفاتيح — `.env` غير متتبع في git.

| المفتاح | الغرض | أين يعيش |
|---|---|---|
| `VITE_FINNHUB_API_KEY` | الأخبار والأسعار | واجهة (يُضمَّن في الـ bundle) |
| `VITE_HALALTERMINAL_API_KEY` | الفرز الشرعي | واجهة (يُضمَّن في الـ bundle) |
| `ANTHROPIC_API_KEY` | تحليل AI | **server-side فقط** — لا تسبقه بـ VITE_ أبداً |
| `ANALYZE_MODEL` | (اختياري) نموذج التحليل | server-side، الافتراضي `claude-opus-4-8` |

## النشر على Vercel (مرة واحدة)
1. من [vercel.com/new](https://vercel.com/new) اختر **Import Git Repository** → `SadakaJaria/medomshakeeel`.
2. الإعدادات تُكتشف تلقائياً (Vite): Build = `npm run build`، Output = `dist` — لا تغيّر شيئاً.
3. في **Environment Variables** أضف المفاتيح الأربعة من الجدول أعلاه.
4. اضغط **Deploy**. مجلد `api/` يُنشر تلقائياً كـ serverless functions، و`vercel.json` يضبط مسارات الـ SPA و`maxDuration` للتحليل.

بعد أول نشر: افتح الموقع من الجوال → «إضافة إلى الشاشة الرئيسية» لتثبيته كتطبيق (PWA). التحديثات تصل تلقائياً مع كل push (الـ service worker بنمط autoUpdate).

## PWA
- يعمل offline: الواجهة والمسارات الداخلية تُقدَّم من الكاش، وبيانات الكون الحلال محفوظة في localStorage.
- نداءات `/api/` لا تُكاش أبداً؛ خطوط Google تُكاش للعمل دون اتصال.

## ليش الريبو على GitHub بيطلع شاشة بيضا؟
GitHub لا يبني ولا يشغّل تطبيقات Vite — يعرض الكود المصدري فقط. ملف `index.html`
يشير إلى `/src/main.jsx` (كود JSX خام) الذي لا يفهمه المتصفح مباشرة؛ لازم `npm run build`
يحوّله إلى `dist/` أولاً. لذلك فتح الريبو أو GitHub Pages المُوجَّه للجذر = شاشة بيضا.

**الحلول:**
- **Vercel** (موصى به): يبني وينشر تلقائياً مع دعم الـ AI الكامل — راجع قسم النشر أعلاه.
- **معاينة GitHub Pages:** أضفنا workflow (`.github/workflows/deploy-pages.yml`) يبني وينشر تلقائياً عند كل push لـ `main`. فعّله مرة واحدة: **Settings → Pages → Source: GitHub Actions**. الرابط: `https://sadakajaria.github.io/medomshakeeel/`. ملاحظة: هذه معاينة واجهة بلا مفاتيح — الشارتات تعمل، لكن الأخبار/الفرز/تحليل AI تعرض رسالة "أضف المفتاح" (تحليل AI يحتاج خادم Vercel).

راجع `CLAUDE.md` للتفاصيل الكاملة عن المشروع وحالته.
