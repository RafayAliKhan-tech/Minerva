function LogicPuzzle({ answer, onAnswerChange, hintUsed, onUseHint, onSubmit, isSubmitted, isDisabled }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-beige-border bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-cream-dark p-6">
            <p className="text-sm text-brown-light">Crack the Pattern</p>
            <div className="mt-4 flex flex-col gap-3 text-xl font-semibold text-brown sm:flex-row sm:items-center">
              <span className="rounded-full bg-brown/5 px-4 py-3">2</span>
              <span className="text-orange">→</span>
              <span className="rounded-full bg-brown/5 px-4 py-3">6</span>
              <span className="text-orange">→</span>
              <span className="rounded-full bg-brown/5 px-4 py-3">12</span>
              <span className="text-orange">→</span>
              <span className="rounded-full bg-brown/5 px-4 py-3">20</span>
              <span className="text-orange">→</span>
              <span className="rounded-full bg-brown/5 px-4 py-3">?</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-brown">Your answer</label>
            <input
              type="text"
              value={answer}
              onChange={(event) => onAnswerChange(event.target.value)}
              disabled={isSubmitted || isDisabled}
              className="w-full rounded-2xl border border-beige-border bg-white px-4 py-3 text-brown outline-none transition duration-200 focus:border-orange"
              placeholder="Type the number you think fits the pattern"
              inputMode="numeric"
              aria-label="Logic puzzle answer"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onUseHint}
              disabled={hintUsed || isSubmitted || isDisabled}
              className={`inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition duration-200 ${
                hintUsed || isSubmitted || isDisabled
                  ? 'cursor-not-allowed border-brown/20 bg-brown/5 text-brown-light'
                  : 'border-orange bg-orange-pill text-orange hover:bg-orange/10'
              }`}
            >
              {hintUsed ? 'Hint used' : 'Show hint'}
            </button>
            <p className="text-sm text-brown-light">
              Use the hint once to help guide your reasoning.
            </p>
          </div>

          {hintUsed && (
            <div className="rounded-2xl bg-orange-pill p-4 text-sm text-brown">
              The difference between numbers grows by 2 each time. Focus on how the sequence changes.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!answer || isSubmitted || isDisabled}
          className="inline-flex items-center justify-center rounded-2xl bg-brown px-6 py-3 text-sm font-semibold text-white transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-orange"
        >
          Submit answer
        </button>
      </div>
    </div>
  )
}

export default LogicPuzzle
