function ResponsiveChallenge({ problemAreas, selectedAreaId, assignedFixes, onSelectArea, onAssignFix, fixOptions, isDisabled }) {
  const handleDragStart = (event, actionId) => {
    event.dataTransfer.setData('text/plain', actionId)
  }

  const handleDropOnTarget = (event, areaId) => {
    event.preventDefault()
    const actionId = event.dataTransfer.getData('text/plain')
    onAssignFix(areaId, actionId)
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-beige-border bg-cream-dark p-4">
              <p className="text-sm font-semibold text-brown">Desktop view</p>
              <div className="mt-4 rounded-2xl bg-white p-6 text-sm text-brown-light">Looks stable and balanced.</div>
            </div>
            <div className="rounded-2xl border border-beige-border bg-cream-dark p-4">
              <p className="text-sm font-semibold text-brown">Tablet view</p>
              <div className="mt-4 rounded-2xl bg-white p-6 text-sm text-brown-light">The layout is okay, but mobile needs work.</div>
            </div>
            <div className="rounded-2xl border border-beige-border bg-cream-dark p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brown">Mobile view</p>
                <p className="text-xs text-brown-light">Tap broken areas</p>
              </div>
              <div className="mt-4 space-y-3 rounded-2xl bg-white p-4">
                {problemAreas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => onSelectArea(area.id)}
                    disabled={isDisabled}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDropOnTarget(event, area.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition duration-200 ${
                      selectedAreaId === area.id
                        ? 'border-orange bg-orange-pill/50'
                        : 'border-beige-border bg-cream-dark hover:border-orange/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-brown">{area.name}</span>
                      <span className="text-xs text-brown-light">{assignedFixes[area.id] ? 'Fix assigned' : 'Tap / drop fix'}</span>
                    </div>
                    <p className="mt-2 text-sm text-brown-light">{area.description}</p>
                    {assignedFixes[area.id] && (
                      <div className="mt-3 rounded-2xl bg-white p-3 text-sm text-brown">Fix: {assignedFixes[area.id]}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-beige-border bg-cream-dark p-6">
            <h3 className="text-lg font-semibold text-brown">How would you fix it?</h3>
            <p className="mt-2 text-sm text-brown-light">Drag a fix onto a highlighted issue, or click a problem first then drag.</p>
            <div className="mt-6 space-y-3">
              {fixOptions.map((action) => (
                <div
                  key={action.id}
                  draggable={!isDisabled}
                  onDragStart={(event) => handleDragStart(event, action.id)}
                  className="cursor-grab rounded-2xl border border-beige-border bg-white p-4 text-sm font-medium text-brown transition duration-200 hover:border-orange/40"
                >
                  {action.name}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-beige-border bg-white p-4 text-sm text-brown-light">
              {selectedAreaId ? (
                <p>Drop a fix onto the selected issue to connect it.</p>
              ) : (
                <p>Select a mobile issue first to target your fix.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveChallenge
