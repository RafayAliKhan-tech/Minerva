import React from 'react'
import OptionCard from './OptionCard'

function MultipleChoice({
  question,
  selectedOption,
  onOptionSelect,
  isAnswered,
  canAnswer = true,
}) {
  if (!question) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="space-y-3 sm:space-y-4">
        {question.options && question.options.length > 0 ? (
          question.options.map((option) => (
            <OptionCard
              key={option.id}
              option={{
                ...option,
                label: option.id,
                title: option.text,
              }}
              selected={selectedOption === option.id}
              disabled={isAnswered || !canAnswer}
              onClick={onOptionSelect}
              showLabel
            />
          ))
        ) : (
          <p className="text-sm text-brown-light">No options available</p>
        )}
      </div>
    </div>
  )
}

export default MultipleChoice
