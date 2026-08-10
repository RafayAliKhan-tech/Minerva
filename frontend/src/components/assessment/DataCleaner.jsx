function DataCleaner({ rows, selectedCells, onToggleCell, isDisabled }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-brown">Clean the data</h3>
            <p className="mt-3 text-sm text-brown-light">
              Identify the cells that need to be cleaned before analysis.
            </p>
          </div>
          <div className="rounded-2xl bg-cream-dark p-4 text-sm text-brown-light">
            Selected cells: <span className="font-semibold text-brown">{selectedCells.length}</span>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-beige-border text-left text-sm">
            <thead className="bg-cream-dark">
              <tr>
                <th className="px-4 py-3 font-semibold text-brown">Study Hours</th>
                <th className="px-4 py-3 font-semibold text-brown">Assignments</th>
                <th className="px-4 py-3 font-semibold text-brown">Attendance</th>
                <th className="px-4 py-3 font-semibold text-brown">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-border">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {['hours', 'assignments', 'attendance', 'score'].map((field) => {
                    const cellId = `${rowIndex}-${field}`
                    const isSelected = selectedCells.includes(cellId)
                    return (
                      <td key={field} className="p-3">
                        <button
                          type="button"
                          onClick={() => onToggleCell(cellId)}
                          disabled={isDisabled}
                          className={`w-full rounded-2xl px-3 py-2 text-left transition duration-200 ${
                            isSelected
                              ? 'border border-orange bg-orange-pill/50 text-brown'
                              : 'border border-transparent bg-cream-dark text-brown-light hover:border-orange/40'
                          }`}
                        >
                          {row[field]}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataCleaner
