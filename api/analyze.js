// تحليل AI — Vercel serverless function.
// المفتاح ANTHROPIC_API_KEY يبقى server-side فقط (لا VITE_ هنا أبداً).
// نفس الـ handler يعمل في dev عبر middleware في vite.config.js.

import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `أنت محلل أسواق مالية في تيرمينال شخصي متوافق مع الشريعة الإسلامية، يستخدمه طالب إدارة استثمار للتعلّم والمتابعة (ليس للتداول).

ستصلك بيانات JSON عن ورقة مالية: معلومات الورقة، سعر وتغيّر (إن توفر)، أهم الأخبار الأخيرة (إن توفرت)، وبيانات الفرز الشرعي الخام من Halal Terminal — وقد تشمل النسب المالية (الدين، النقد، الإيراد غير المتوافق...) ونتائج الفرز عبر منهجيات متعددة (AAOIFI, DJIM, FTSE, MSCI, S&P).

اكتب تحليلاً بالعربية الفصحى الواضحة (المصطلحات والرموز المالية تبقى بالإنجليزية/اللاتينية) بهذه البنية:

## النظرة الفنية والسوقية
حركة السعر والسياق وأثر الأخبار الأخيرة إن وجدت.

## القراءة الشرعية بالأرقام
هذا قلب التحليل: اربط النسب المالية الفعلية بحدود الفرز الشرعي. كم تبعد نسبة الدين عن حد 30%/33%؟ ما مصدر الإيراد غير المتوافق وما اتجاهه؟ إذا اختلفت المنهجيات الخمس في الحكم، اشرح لماذا (اختلاف الحدود أو المقام: قيمة سوقية vs أصول). اذكر نسبة التطهير وأثرها العملي.

## الربط والخلاصة
اجمع الخيطين: هل الوضع الشرعي مستقر أم على الحافة؟ وما الذي قد يقلبه (ارتفاع دين، هبوط قيمة سوقية...)؟ نقاط تستحق المراقبة.

إذا وصلتك قوائم مالية (FMP: نسب TTM، قائمة دخل، قطاع)، ادمجها: اربط الربحية والدين ونسب السيولة بالقراءة الشرعية (نسبة الدين للسيولة تؤثر على الفرز)، واذكر الاتجاه إن أمكن.

قواعد:
- إذا غاب جزء من البيانات (سعر، أخبار، نسب، قوائم)، قل ذلك صراحة وحلّل بما توفر — لا تخترع أرقاماً أبداً.
- استند إلى الأرقام المرسلة فقط، ولا تقدّم توصية شراء/بيع.
- كن كثيفاً ومفيداً — تحليل تيرمينال لا مقال.
- اختم بسطر واحد: هذا تحليل تعليمي وليس نصيحة استثمارية.`

const COMPARE_PROMPT = `أنت محلل أسواق مالية في تيرمينال شخصي متوافق مع الشريعة، يستخدمه طالب إدارة استثمار للتعلّم (ليس للتداول).

ستصلك بيانات JSON لورقتين ماليتين (لكل واحدة: تعريف، سعر، أخبار، فرز شرعي خام بالنسب والمنهجيات، وقوائم مالية إن توفرت). قارن بينهما بالعربية الفصحى (الرموز والأرقام لاتينية) بهذه البنية:

## المقارنة المالية
جدول أو قائمة تقابل النسب الرئيسية (الربحية، الدين، السيولة، التقييم) جنباً إلى جنب مع تعليق مختصر على من الأقوى في كل بُعد.

## المقارنة الشرعية بالأرقام
قابل حالة الفرز ونسب الدين/الدخل غير المتوافق ونسبة التطهير للورقتين. أيّهما أبعد عن حدود الفرز وأكثر استقراراً شرعياً؟ إن اختلفت المنهجيات في الحكم، اشرح.

## الخلاصة المقارنة
جمع الخيطين: نقاط قوة وضعف كل ورقة تعليمياً، وما الذي يميّز إحداهما عن الأخرى — دون توصية شراء/بيع.

قواعد: استند للأرقام المرسلة فقط، صرّح بأي بيانات ناقصة، لا تخترع أرقاماً، واختم بسطر: هذا تحليل تعليمي وليس نصيحة استثمارية.`

async function readBody(req) {
  // Vercel يوفر req.body جاهزاً، وconnect (بيئة التطوير) لا — نغطي الحالتين
  if (req.body !== undefined) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8')
  return raw ? JSON.parse(raw) : {}
}

function send(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

/** يحوّل كائناً إلى JSON محدود الحجم حتى لا يتضخم البرومبت */
function boundedJson(value, maxChars) {
  if (value == null) return 'غير متوفر'
  const json = JSON.stringify(value, null, 1)
  return json.length > maxChars ? `${json.slice(0, maxChars)}…(مقتطع)` : json
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return send(res, 405, { error: 'method', message: 'POST فقط' })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return send(res, 501, {
      error: 'missing-key',
      message:
        'أضف ANTHROPIC_API_KEY في ملف .env (محلياً) وفي إعدادات Vercel (للنشر).',
    })
  }

  let payload
  try {
    payload = await readBody(req)
  } catch {
    return send(res, 400, { error: 'bad-json', message: 'جسم الطلب ليس JSON صالحاً' })
  }

  // سياق ورقة واحدة → نص منظّم للبرومبت
  function contextBlock({ security, quote, news, screening, financials }) {
    return [
      `### الورقة (من الكون الحلال)`,
      boundedJson(security, 2000),
      ``,
      `### السعر والتغيّر (Finnhub)`,
      boundedJson(quote, 1000),
      ``,
      `### أهم الأخبار الأخيرة`,
      boundedJson(news, 2500),
      ``,
      `### بيانات الفرز الشرعي الخام (Halal Terminal — النسب والمنهجيات)`,
      boundedJson(screening, 5000),
      ``,
      `### القوائم المالية والنسب (FMP)`,
      boundedJson(financials, 2500),
    ].join('\n')
  }

  let systemPrompt
  let userContent

  if (payload?.mode === 'compare') {
    const items = Array.isArray(payload.items) ? payload.items : []
    if (items.length !== 2 || !items[0]?.security?.tvSymbol || !items[1]?.security?.tvSymbol) {
      return send(res, 400, {
        error: 'bad-request',
        message: 'المقارنة تتطلب ورقتين صالحتين',
      })
    }
    systemPrompt = COMPARE_PROMPT
    userContent = [
      `قارن بين الورقتين التاليتين:`,
      ``,
      `## الورقة الأولى: ${items[0].security.tvSymbol}`,
      contextBlock(items[0]),
      ``,
      `## الورقة الثانية: ${items[1].security.tvSymbol}`,
      contextBlock(items[1]),
    ].join('\n')
  } else {
    const { security } = payload ?? {}
    if (!security?.tvSymbol) {
      return send(res, 400, { error: 'bad-request', message: 'security.tvSymbol مطلوب' })
    }
    systemPrompt = SYSTEM_PROMPT
    userContent = ['حلّل الورقة المالية التالية:', '', contextBlock(payload)].join('\n')
  }

  const client = new Anthropic({ timeout: 55_000, maxRetries: 1 })

  try {
    const response = await client.messages.create({
      model: process.env.ANALYZE_MODEL || 'claude-opus-4-8',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    const analysis = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim()

    if (!analysis) {
      return send(res, 502, { error: 'empty', message: 'لم يصل نص تحليل من النموذج' })
    }
    return send(res, 200, { analysis, model: response.model })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return send(res, 502, { error: 'auth', message: 'مفتاح Anthropic غير صالح' })
    }
    if (err instanceof Anthropic.RateLimitError) {
      return send(res, 502, { error: 'rate-limit', message: 'تجاوزنا حد الطلبات — جرّب بعد قليل' })
    }
    if (err instanceof Anthropic.APIError) {
      return send(res, 502, { error: 'api', message: `خطأ من Claude API (${err.status})` })
    }
    return send(res, 502, { error: 'network', message: 'تعذّر الوصول إلى Claude API' })
  }
}
