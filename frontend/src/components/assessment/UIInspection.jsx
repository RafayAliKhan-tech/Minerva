function UIInspection({ areas, selectedAreas, onToggleArea, isDisabled }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="rounded-3xl border border-beige-border bg-cream-dark p-6 relative overflow-hidden">
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-brown">University portal homepage</p>
                <p className="mt-1 text-xs text-brown-light">Tap the elements that look confusing or broken.</p>
              </div>
              {areas.map((area) => (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onToggleArea(area.id)}
                  disabled={isDisabled}
                  className={`relative block w-full rounded-2xl border p-4 text-left transition duration-200 ${
                    selectedAreas.includes(area.id)
                      ? 'border-orange bg-orange-pill/30'
                      : 'border-beige-border bg-white hover:border-orange/40 hover:bg-orange/5'
                  }`}
                >
                  <span className="block text-sm font-semibold text-brown">{area.name}</span>
                  <span className="mt-2 block text-sm text-brown-light">{area.description}</span>
                  <span className="absolute right-4 top-4 text-xs text-brown-light">
                    {selectedAreas.includes(area.id) ? 'Selected' : 'Tap to select'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-beige-border bg-cream-dark p-6">
            <h3 className="text-lg font-semibold text-brown">What to look for</h3>
            <ul className="mt-4 space-y-3 text-sm text-brown-light">
              <li>• Confusing navigation</li>
              <li>• unclear button labels</li>
              <li>• weak visual hierarchy</li>
              <li>• hidden call-to-action</li>
              <li>• inconsistent spacing</li>
            </ul>
            <div className="mt-6 rounded-2xl bg-white p-4 text-sm text-brown">
              Selected problems: {selectedAreas.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UIInspection
