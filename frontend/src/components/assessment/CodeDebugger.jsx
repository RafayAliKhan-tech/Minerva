function CodeDebugger({ codeLines, selectedLine, onSelectLine, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brown">Code Snippet</h3>
          <div className="mt-4 space-y-2">
            {codeLines.map((line) => (
              <button
                key={line.id}
                type="button"
                onClick={() => onSelectLine(line.id)}
                disabled={isDisabled}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-3 text-left transition duration-200 ${
                  selectedLine === line.id
                    ? 'border-orange bg-orange-pill/50'
                    : 'border-beige-border bg-cream-dark hover:border-orange/40'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brown-light">
                  {line.number}
                </span>
                <span className="whitespace-pre-wrap text-sm text-brown">{line.content}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-beige-border bg-cream-dark p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brown">Browser Preview</h3>
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-brown-light">The button renders, but it doesn&apos;t work when clicked.</p>
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-brown/10 bg-brown/5 p-8">
              <button className="rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white">Start Assessment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeDebugger
