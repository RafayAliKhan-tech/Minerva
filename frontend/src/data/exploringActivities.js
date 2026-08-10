export const exploringActivities = [
  {
    id: 'crack-pattern',
    title: 'Crack the Pattern',
    description: 'Solve the number pattern with a short answer and one hint.',
    duration: 45,
    type: 'logic-puzzle',
    instruction: 'Enter the next number in the sequence. You can use the hint once.',
    sequence: [2, 6, 12, 20, '?'],
    hint: 'The difference between numbers grows by 2 at each step.',
    expectedAnswer: '30',
  },
  {
    id: 'priority-decision',
    title: 'Project Priority Board',
    description: 'Choose the most important improvements for a student portal.',
    duration: 60,
    type: 'priority-board',
    instruction: 'Drag your top 3 priorities into the Priority Zone and arrange them from first to third.',
    cards: [
      {
        id: 'visual-design',
        name: 'Improve visual design',
        description: 'Make the portal look polished and easy to scan.',
      },
      {
        id: 'search',
        name: 'Add faster search',
        description: 'Help students find content more quickly.',
      },
      {
        id: 'ai-assistant',
        name: 'Add AI assistant',
        description: 'Guide students with smart career suggestions.',
      },
      {
        id: 'navigation',
        name: 'Fix confusing navigation',
        description: 'Make it easier to move through the portal.',
      },
      {
        id: 'analytics-dashboard',
        name: 'Add analytics dashboard',
        description: 'Show progress and useful student metrics.',
      },
      {
        id: 'loading-speed',
        name: 'Improve page loading speed',
        description: 'Keep the portal fast on every device.',
      },
    ],
  },
  {
    id: 'visual-analysis',
    title: 'Find the UX Problems',
    description: 'Inspect the interface and highlight the confusing areas.',
    duration: 60,
    type: 'ui-inspection',
    instruction: 'Click the areas of the page that look broken, confusing, or hard to use. Select at least two.',
    areas: [
      {
        id: 'navigation',
        name: 'Confusing navigation',
        description: 'The menu labels are unclear and hard to scan.',
      },
      {
        id: 'cta',
        name: 'Unclear CTA buttons',
        description: 'Two calls-to-action compete and do not feel distinct.',
      },
      {
        id: 'hierarchy',
        name: 'Poor visual hierarchy',
        description: 'Important content does not stand out from secondary text.',
      },
      {
        id: 'spacing',
        name: 'Inconsistent spacing',
        description: 'Sections feel crowded and inconsistent.',
      },
      {
        id: 'hidden-action',
        name: 'Hidden CTA',
        description: 'The main action is buried and not obvious at first glance.',
      },
    ],
  },
]

export const generateMindProfile = (answers) => {
  const logic = answers['crack-pattern'] || {}
  const priority = answers['priority-decision'] || {}
  const ui = answers['visual-analysis'] || {}

  const logicScore = logic.answer === '30' ? 95 : logic.answer ? 65 : 35
  const priorityScore = Math.min(100, (priority.selectedItems?.length || 0) * 20 + (priority.orderedCorrectly ? 25 : 0) + 30)
  const uiScore = Math.min(100, (ui.selectedAreas?.length || 0) * 20 + (ui.selectedAreas?.length >= 2 ? 20 : 0))

  return {
    analyticalThinking: Math.round((logicScore + priorityScore + uiScore) / 3),
    problemSolving: Math.min(100, Math.round((logicScore + priorityScore) / 2)),
    creativeThinking: Math.min(100, Math.round((uiScore + logicScore) / 2)),
    userThinking: Math.min(100, Math.round((uiScore + priorityScore) / 2)),
    insights: [
      'You prefer to solve problems by spotting patterns and testing your answer quickly.',
      'You focus on user clarity and clear product priorities in your decision-making.',
      'You notice interface inconsistencies and think about usability at a glance.',
    ],
    potentialDomains: [
      { domain: 'Data & Analytics', match: 91 },
      { domain: 'Software Development', match: 86 },
      { domain: 'UI/UX', match: 79 },
      { domain: 'AI/ML', match: 76 },
    ],
  }
}
