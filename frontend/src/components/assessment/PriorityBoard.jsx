function PriorityBoard({ cards, prioritySlots, onSlotDrop, onReturnToPool, changes, isDisabled }) {
  const handleDragStart = (event, cardId, source) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ cardId, source }))
  }

  const handleDropOnSlot = (event, index) => {
    event.preventDefault()
    const payload = JSON.parse(event.dataTransfer.getData('text/plain'))
    onSlotDrop(payload.cardId, payload.source, index)
  }

  const handleDropOnPool = (event) => {
    event.preventDefault()
    const payload = JSON.parse(event.dataTransfer.getData('text/plain'))
    onReturnToPool(payload.cardId, payload.source)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brown">Priority Zone</h3>
          <p className="mt-2 text-sm text-brown-light">Drag your top 3 improvements into the board in order.</p>
          <div className="mt-6 space-y-4">
            {prioritySlots.map((card, index) => (
              <div
                key={`slot-${index}`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDropOnSlot(event, index)}
                className="min-h-[88px] rounded-2xl border border-dashed border-beige-border bg-cream-dark p-4 transition duration-200 hover:border-orange"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-brown-light">Priority {index + 1}</p>
                    {card ? (
                      <p className="mt-2 text-base font-semibold text-brown">{card.name}</p>
                    ) : (
                      <p className="mt-2 text-sm text-brown-light">Drop a top item here</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-brown-light">Changes made: {changes}</div>
        </div>

        <div className="rounded-3xl border border-beige-border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brown">Available improvements</h3>
          <div className="mt-6 space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                draggable={!isDisabled}
                onDragStart={(event) => handleDragStart(event, card.id, 'pool')}
                className="cursor-grab rounded-2xl border border-beige-border bg-cream-dark p-4 transition duration-200 hover:border-orange"
              >
                <p className="font-semibold text-brown">{card.name}</p>
                <p className="mt-1 text-sm text-brown-light">{card.description}</p>
              </div>
            ))}
          </div>
          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDropOnPool}
            className="mt-6 rounded-2xl border border-dashed border-beige-border bg-brown/5 p-4 text-sm text-brown-light"
          >
            Drag selected cards back here to remove them from the priority board.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriorityBoard
