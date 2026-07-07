// حسابات الزكاة وتطهير الأرباح — دوال نقية قابلة للاختبار.
// الحسابات تقريبية للتعلّم والتنظيم الشخصي، وليست فتوى.

/** نصاب الذهب بالجرام (85 جرام ذهب خالص — المعيار الأشهر) */
export const NISAB_GOLD_GRAMS = 85

/** معدلات الزكاة حسب نوع السنة */
export const ZAKAT_RATES = {
  hijri: { label: 'سنة هجرية (2.5%)', rate: 0.025 },
  gregorian: { label: 'سنة ميلادية (2.5775%)', rate: 0.025775 },
}

/**
 * حساب زكاة المحفظة.
 * القيم كلها بنفس العملة. الأسهم المقتناة للمتاجرة تُزكّى بقيمتها السوقية.
 * يرجع: { nisab, netAssets, isDue, amount }
 */
export function calcZakat({
  cash = 0,
  stocks = 0,
  metals = 0,
  other = 0,
  debts = 0,
  goldPricePerGram = 0,
  yearType = 'hijri',
}) {
  const nisab = NISAB_GOLD_GRAMS * goldPricePerGram
  const netAssets = Math.max(0, cash + stocks + metals + other - debts)
  const isDue = goldPricePerGram > 0 && netAssets >= nisab
  const rate = (ZAKAT_RATES[yearType] ?? ZAKAT_RATES.hijri).rate
  return {
    nisab,
    netAssets,
    isDue,
    amount: isDue ? netAssets * rate : 0,
  }
}

/**
 * تطهير أرباح ورقة مالية: المبلغ الواجب إخراجه من التوزيعات
 * = التوزيعات المستلمة × نسبة الدخل غير المتوافق (purificationRatio).
 */
export function calcPurification({ dividends = 0, purificationRatio = 0 }) {
  const ratio = Math.min(Math.max(purificationRatio, 0), 1)
  return {
    amount: dividends * ratio,
    clean: dividends - dividends * ratio,
  }
}

/** تنسيق رقم مالي للعرض (فواصل آلاف + منزلتان) */
export function fmtMoney(value) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
