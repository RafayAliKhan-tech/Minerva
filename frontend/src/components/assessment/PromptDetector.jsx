function PromptDetector({ prompts, selectedPromptId, explanation, onSelectPrompt, onExplanationChange, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brown">Prompt Detective</h3>
        <p className="mt-3 text-sm text-brown-light">Pick the prompt that is most likely to get a useful result for the student.</p>

        <div className="mt-6 space-y-4">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => onSelectPrompt(prompt.id)}
              disabled={isDisabled}
              className={`w-full rounded-2xl border p-4 text-left transition duration-200 ${
                selectedPromptId === prompt.id
                  ? 'border-orange bg-orange-pill/50'
                  : 'border-beige-border bg-cream-dark hover:border-orange/40'
              }`}
            >
              <p className="font-semibold text-brown">{prompt.label}</p>
              <pre className="mt-3 rounded-2xl bg-cream-dark p-3 text-sm text-brown-light">{prompt.text}</pre>
            </button>
          ))}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-brown">Why is this better?</label>
          <textarea
            rows={3}
            value={explanation}
            onChange={(e) => onExplanationChange(e.target.value)}
            disabled={isDisabled}
            className="mt-3 w-full rounded-2xl border border-beige-border bg-cream-dark p-4 text-brown outline-none transition duration-200 focus:border-orange"
            placeholder="Type a short explanation"
          />
        </div>
      </div>
    </div>
  )
}

export default PromptDetector
