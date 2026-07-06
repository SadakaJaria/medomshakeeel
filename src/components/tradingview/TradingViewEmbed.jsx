import { useEffect, useRef } from 'react'

/**
 * مكوّن تضمين عام لأي TradingView widget.
 * widget: اسم السكربت مثل "ticker-tape" أو "market-overview"
 * config: كائن الإعدادات كما توثّقه TradingView
 * الشارتات تبقى LTR داخلياً (dir="ltr") حسب قواعد المشروع.
 */
function TradingViewEmbed({ widget, config, className = '' }) {
  const containerRef = useRef(null)
  const configJson = JSON.stringify(config)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''
    const widgetDiv = document.createElement('div')
    widgetDiv.className = 'tradingview-widget-container__widget'
    container.appendChild(widgetDiv)

    const script = document.createElement('script')
    script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${widget}.js`
    script.type = 'text/javascript'
    script.async = true
    script.text = configJson
    container.appendChild(script)

    return () => {
      container.innerHTML = ''
    }
  }, [widget, configJson])

  return (
    <div
      ref={containerRef}
      dir="ltr"
      className={`tradingview-widget-container ${className}`}
    />
  )
}

export default TradingViewEmbed
