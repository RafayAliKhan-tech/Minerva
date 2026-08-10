function StatementInspector({ statements, selectedStatementId, onSelectStatement, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brown">Hallucination Detector</h3>
        <p className="mt-3 text-sm text-brown-light">
          Identify the statement that should be verified before trusting the AI-generated answer.
        </p>
        <div className="mt-6 space-y-3">
          {statements.map((statement) => (
            <button
              key={statement.id}
              type="button"
              onClick={() => onSelectStatement(statement.id)}
              disabled={isDisabled}
              className={`w-full rounded-2xl border p-4 text-left transition duration-200 ${
                selectedStatementId === statement.id
                  ? 'border-orange bg-orange-pill/50'
                  : 'border-beige-border bg-cream-dark hover:border-orange/40'
              }`}
            >
              <p className="text-sm text-brown">{statement.text}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatementInspector
