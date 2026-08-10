function PageBuilder({ availableComponents, canvasItems, onAddToCanvas, onMoveCanvasItem, onRemoveFromCanvas, isDisabled }) {
  const handleDragStart = (event, componentId, source, index = null) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ componentId, source, index }))
  }

  const handleDropOnCanvas = (event, targetIndex) => {
    event.preventDefault()
    const payload = JSON.parse(event.dataTransfer.getData('text/plain'))
    if (payload.source === 'palette') {
      onAddToCanvas(payload.componentId, targetIndex)
    } else if (payload.source === 'canvas') {
      onMoveCanvasItem(payload.index, targetIndex)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
        <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h3 className="text-lg font-semibold text-brown">Component palette</h3>
            <div className="mt-4 space-y-3">
              {availableComponents.map((component) => (
                <div
                  key={component.id}
                  draggable={!isDisabled}
                  onDragStart={(event) => handleDragStart(event, component.id, 'palette')}
                  className="cursor-grab rounded-2xl border border-beige-border bg-cream-dark p-4 transition duration-200 hover:border-orange/40"
                >
                  <p className="font-semibold text-brown">{component.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brown">Page canvas</h3>
            <div className="mt-4 space-y-3">
              {Array.from({ length: 7 }).map((_, index) => {
                const item = canvasItems[index]
                return (
                  <div
                    key={`canvas-slot-${index}`}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDropOnCanvas(event, index)}
                    className="min-h-[90px] rounded-2xl border p-4 transition duration-200 hover:border-orange/40"
                  >
                    {item ? (
                      <div
                        draggable={!isDisabled}
                        onDragStart={(event) => handleDragStart(event, item.id, 'canvas', index)}
                        className="flex items-center justify-between rounded-2xl bg-orange-pill/30 p-3"
                      >
                        <span className="font-semibold text-brown">{item.name}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveFromCanvas(index)}
                          className="text-sm font-semibold text-orange"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-brown-light">Drop a component here</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <p className="text-sm text-brown-light">Drag components from the palette onto the canvas to build the landing page structure. Arrange them in the order the user should see them.</p>
      </div>
    </div>
  )
}

export default PageBuilder
