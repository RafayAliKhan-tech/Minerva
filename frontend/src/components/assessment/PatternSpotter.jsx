function PatternSpotter({ options, selectedOptionId, onSelectOption, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brown">Dataset pattern</h3>
        <p className="mt-3 text-sm text-brown-light">Study the dataset relationships and choose the one you would investigate first.</p>
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
              <p className="font-semibold text-brown">{option.label}</p>
              <p className="mt-2 text-sm text-brown-light">{option.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PatternSpotter
