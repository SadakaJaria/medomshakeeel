/** عرض مبسط لتحليل AI: أسطر "## عنوان" تصبح عناوين، والباقي فقرات pre-wrap */
function AnalysisText({ text }) {
  const blocks = text.split(/\n(?=## )/)
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        const [first, ...rest] = block.split('\n')
        if (first.startsWith('## ')) {
          return (
            <section key={i}>
              <h3 className="mb-1 font-semibold text-market-up">
                {first.slice(3)}
              </h3>
              <p className="whitespace-pre-wrap">{rest.join('\n').trim()}</p>
            </section>
          )
        }
        return (
          <p key={i} className="whitespace-pre-wrap">
            {block.trim()}
          </p>
        )
      })}
    </div>
  )
}

export default AnalysisText
