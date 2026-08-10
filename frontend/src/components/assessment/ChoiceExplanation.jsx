function ChoiceExplanation({ options, selectedOptionId, explanation, onSelectOption, onExplanationChange, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brown">Design Decision</h3>
        <p className="mt-3 text-sm text-brown-light">
          Pick the design version that guides the user fastest and explain your choice.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectOption(option.id)}
              disabled={isDisabled}
              className={`rounded-2xl border p-4 text-left transition duration-200 ${
                selectedOptionId === option.id
                  ? 'border-orange bg-orange-pill/50'
                  : 'border-beige-border bg-cream-dark hover:border-orange/40'
              }`}
            >
              <p className="font-semibold text-brown">{option.name}</p>
              <p className="mt-2 text-sm text-brown-light">{option.description}</p>
            </button>
          ))}
        </div>
        <div className="mt-6">
          <label className="block text-sm font-semibold text-brown">Why would you choose this version?</label>
          <textarea
            rows={3}
            value={explanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            disabled={isDisabled}
            className="mt-3 w-full rounded-2xl border border-beige-border bg-cream-dark p-4 text-brown outline-none transition duration-200 focus:border-orange"
            placeholder="Type a short reason"
          />
        </div>
      </div>
    </div>
  )
}

export default ChoiceExplanation
