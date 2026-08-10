import {
  Code2,
  Palette,
  Smartphone,
  BarChart3,
  Brain,
  Shield,
  Cloud,
  Gamepad2,
  Plus,
} from 'lucide-react'

// Domain definitions
export const domains = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Build interactive websites and web applications',
    icon: Code2,
    color: 'bg-blue-100',
    route: '/explore/domain-assessment/web-development',
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Extract insights from messy datasets and tell stories with data',
    icon: BarChart3,
    color: 'bg-green-100',
    route: '/explore/domain-assessment/data-science',
  },
  {
    id: 'ai-engineering',
    name: 'AI Engineering',
    description: 'Design reliable AI experiences and critical systems',
    icon: Brain,
    color: 'bg-orange-100',
    route: '/explore/domain-assessment/ai-engineering',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    description: 'Design beautiful and usable digital experiences',
    icon: Palette,
    color: 'bg-pink-100',
    route: '/explore/domain-assessment/ui-ux',
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect systems and data from real threats',
    icon: Shield,
    color: 'bg-red-100',
    route: '/explore/domain-assessment/cybersecurity',
  },
  {
    id: 'cloud-devops',
    name: 'Cloud / DevOps',
    description: 'Build scalable infrastructure and deployment pipelines',
    icon: Cloud,
    color: 'bg-cyan-100',
    route: '/explore/domain-assessment/cloud-devops',
  },
  {
    id: 'app-development',
    name: 'App Development',
    description: 'Create mobile and desktop applications',
    icon: Smartphone,
    color: 'bg-purple-100',
    route: '/explore/domain-assessment/app-development',
  },
  {
    id: 'game-development',
    name: 'Game Development',
    description: 'Create immersive game experiences',
    icon: Gamepad2,
    color: 'bg-indigo-100',
    route: '/explore/domain-assessment/game-development',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Explore a different career area in the future',
    icon: Plus,
    color: 'bg-beige/70',
    route: '/explore/domain-assessment/other',
  },
]

// Web Development Activities
const webDevelopmentActivities = [
  {
    id: 'find-bug',
    title: 'Debug the Website',
    description: 'Inspect the code and identify the line that prevents the button from working.',
    duration: 60,
    type: 'code-debugger',
    instruction:
      'Something is preventing this button from working. Click the line of code that causes the issue.',
    codeLines: [
      { id: 'line-1', number: 1, content: '<button id="loginBtn">Login</button>' },
      { id: 'line-2', number: 2, content: '<script>' },
      { id: 'line-3', number: 3, content: 'document.getElementById("login").addEventListener("click", login);' },
      { id: 'line-4', number: 4, content: '</script>' },
    ],
    expectedLineId: 'line-3',
  },
  {
    id: 'build-flow',
    title: 'Build the User Flow',
    description: 'Arrange the screen blocks in the logical order for a student who wants to find a job and apply.',
    duration: 90,
    type: 'page-builder',
    instruction:
      'Drag each screen block into the order that creates the most natural job search and application flow.',
    availableComponents: [
      { id: 'landing', name: 'Landing Page' },
      { id: 'login', name: 'Login' },
      { id: 'profile', name: 'Profile' },
      { id: 'dashboard', name: 'Dashboard' },
      { id: 'search', name: 'Search' },
      { id: 'job-details', name: 'Job Details' },
      { id: 'apply', name: 'Apply' },
      { id: 'confirmation', name: 'Confirmation' },
    ],
  },
  {
    id: 'responsive-web',
    title: 'Responsive Web Challenge',
    description: 'Find the mobile problems and match them with the correct responsive fix.',
    duration: 90,
    type: 'responsive-challenge',
    instruction:
      'The website works on desktop but breaks on mobile. Identify what needs fixing and choose the right fix.',
    problemAreas: [
      {
        id: 'overflow-button',
        name: 'Overflowing button',
        description: 'The primary button extends beyond the mobile frame.',
      },
      {
        id: 'broken-navigation',
        name: 'Broken navigation',
        description: 'The menu does not collapse correctly on mobile.',
      },
      {
        id: 'image-cropping',
        name: 'Image cropping',
        description: 'A key illustration is cut off on smaller screens.',
      },
      {
        id: 'text-overflow',
        name: 'Text overflow',
        description: 'Line text does not wrap and spills outside the card.',
      },
    ],
    fixOptions: [
      { id: 'stack-layout', name: 'Stack elements vertically' },
      { id: 'flex-wrap', name: 'Allow content to wrap' },
      { id: 'responsive-nav', name: 'Use responsive navigation' },
      { id: 'resize-media', name: 'Resize images for mobile' },
      { id: 'shrink-button', name: 'Reduce button width' },
    ],
  },
]

const dataScienceActivities = [
  {
    id: 'find-pattern',
    title: 'Find the Pattern',
    description: 'Choose the dataset relationship you would investigate first.',
    duration: 60,
    type: 'pattern-spotter',
    instruction:
      'You are given this dataset. What would you investigate first?',
    options: [
      {
        id: 'attendance-impact',
        label: 'Attendance vs score',
        description: 'Study whether attendance influences score more than study hours.',
      },
      {
        id: 'study-correlation',
        label: 'Study hours vs score',
        description: 'Check how hours of study are related to the final score.',
      },
      {
        id: 'assignment-quality',
        label: 'Assignments vs score',
        description: 'Investigate whether better assignment completion reflects in score.',
      },
      {
        id: 'misleading-correlation',
        label: 'Misleading correlation',
        description: 'Look for a strong-looking pattern that may not explain the result.',
      },
    ],
    dataset: [
      { hours: 4, assignments: 8, attendance: 'High', score: 78 },
      { hours: 2, assignments: 4, attendance: 'Low', score: 55 },
      { hours: 6, assignments: 9, attendance: 'High', score: 88 },
      { hours: 1, assignments: 2, attendance: 'Low', score: 42 },
    ],
    expectedOptionId: 'misleading-correlation',
  },
  {
    id: 'clean-data',
    title: 'Clean the Data',
    description: 'Identify the values that need cleaning before the dataset is ready for analysis.',
    duration: 90,
    type: 'data-cleaner',
    instruction:
      'You need to prepare this dataset for analysis. Click the cells that contain duplicate or inconsistent values.',
    rows: [
      { hours: '4', assignments: '8', attendance: 'High', score: '78' },
      { hours: '4', assignments: '8', attendance: 'pakistan', score: '82' },
      { hours: '3', assignments: '7', attendance: 'Low', score: '65' },
      { hours: '3', assignments: '7', attendance: 'PK', score: '65' },
      { hours: '5', assignments: '10', attendance: 'Paksitan', score: '90' },
    ],
    expectedCells: ['1-attendance', '3-attendance', '4-attendance'],
  },
  {
    id: 'choose-chart',
    title: 'Choose the Right Visualization',
    description: 'Select the best chart type and explain why it fits the scenario.',
    duration: 60,
    type: 'visualization-chooser',
    instruction:
      'You want to understand how attendance changes over 12 months. Choose the best visualization and explain your choice.',
    options: [
      { id: 'line', name: 'Line Chart', description: 'Tracks changes across time clearly.' },
      { id: 'bar', name: 'Bar Chart', description: 'Compares categories side by side.' },
      { id: 'pie', name: 'Pie Chart', description: 'Shows proportions of a whole.' },
      { id: 'scatter', name: 'Scatter Plot', description: 'Displays relationships between two variables.' },
    ],
    expectedOptionId: 'line',
  },
]

const aiEngineeringActivities = [
  {
    id: 'prompt-detective',
    title: 'Prompt Detective',
    description: 'Choose the prompt most likely to produce a useful AI result and explain why.',
    duration: 60,
    type: 'prompt-detector',
    instruction:
      'Which prompt is more likely to produce a useful result and why?',
    prompts: [
      {
        id: 'prompt-a',
        label: 'Prompt A',
        text: 'Make a study plan.',
      },
      {
        id: 'prompt-b',
        label: 'Prompt B',
        text:
          'You are an academic planning assistant. Create a 7-day study plan for a CS student preparing for 3 exams. Consider available study hours, exam dates and difficulty. Return the plan as a structured schedule.',
      },
    ],
    expectedPromptId: 'prompt-b',
  },
  {
    id: 'build-pipeline',
    title: 'AI Pipeline Builder',
    description: 'Arrange the pipeline components in the order a simple AI assistant should process data.',
    duration: 90,
    type: 'page-builder',
    instruction:
      'Build a simple AI assistant pipeline by dragging each block into the logical order.',
    availableComponents: [
      { id: 'user-input', name: 'User Input' },
      { id: 'data-processing', name: 'Data Processing' },
      { id: 'embedding', name: 'Embedding' },
      { id: 'model', name: 'Model' },
      { id: 'response', name: 'Response' },
      { id: 'database', name: 'Database' },
    ],
  },
  {
    id: 'hallucination-detector',
    title: 'Hallucination Detector',
    description: 'Identify the unsupported claim in the AI answer.',
    duration: 60,
    type: 'statement-inspector',
    instruction:
      'The AI generated this answer. Identify the statement that should be verified before trusting it.',
    statements: [
      {
        id: 'claim-a',
        text: 'This model was trained on real medical data from top hospitals.',
      },
      {
        id: 'claim-b',
        text: 'It can generate a study plan based on exam dates and workload.',
      },
      {
        id: 'claim-c',
        text: 'The assistant always checks facts against external academic research.',
      },
    ],
    expectedStatementId: 'claim-a',
  },
]

const uiUxActivities = [
  {
    id: 'find-ux-problems',
    title: 'Find the UX Problems',
    description: 'Tap the biggest usability problems in the student dashboard.',
    duration: 60,
    type: 'ui-inspection',
    instruction:
      'Find the 3 biggest usability problems in this poorly designed dashboard.',
    areas: [
      {
        id: 'confusing-nav',
        name: 'Confusing navigation',
        description: 'There are too many menu choices and no clear path.',
      },
      {
        id: 'unclear-cta',
        name: 'Unclear CTA',
        description: 'The primary action is not visually distinct or labeled well.',
      },
      {
        id: 'inconsistent-spacing',
        name: 'Inconsistent spacing',
        description: 'The layout feels crowded in some places and too loose in others.',
      },
      {
        id: 'too-many-buttons',
        name: 'Too many buttons',
        description: 'Users are forced to choose between multiple actions without guidance.',
      },
      {
        id: 'poor-hierarchy',
        name: 'Poor hierarchy',
        description: 'Important information is not visually emphasized enough.',
      },
    ],
    expectedSelections: ['confusing-nav', 'unclear-cta', 'poor-hierarchy'],
  },
  {
    id: 'design-flow',
    title: 'Design the Better Flow',
    description: 'Arrange the screens for the simplest mock interview booking experience.',
    duration: 90,
    type: 'page-builder',
    instruction:
      'Create the simplest user flow by ordering the screens for booking a mock interview.',
    availableComponents: [
      { id: 'home', name: 'Home' },
      { id: 'career', name: 'Career' },
      { id: 'mock-interview', name: 'Mock Interview' },
      { id: 'choose-role', name: 'Choose Role' },
      { id: 'choose-date', name: 'Choose Date' },
      { id: 'confirmation', name: 'Confirmation' },
    ],
  },
  {
    id: 'ab-decision',
    title: 'A/B Design Decision',
    description: 'Choose the design that helps the student start as quickly as possible.',
    duration: 60,
    type: 'choice-explanation',
    instruction:
      'Which design would you choose for a student who needs to start their career assessment quickly and why?',
    options: [
      {
        id: 'version-a',
        name: 'Version A',
        description: 'Beautiful but confusing layout with too many visual details.',
      },
      {
        id: 'version-b',
        name: 'Version B',
        description: 'Simple and clear layout that helps users move quickly.',
      },
    ],
    expectedOptionId: 'version-b',
  },
]

// Activity access
export const getDomainActivities = (domainId) => {
  switch (domainId) {
    case 'web-development':
      return webDevelopmentActivities
    case 'data-science':
      return dataScienceActivities
    case 'ai-engineering':
      return aiEngineeringActivities
    case 'ui-ux':
      return uiUxActivities
    default:
      return []
  }
}

export const generateDomainResult = (domainId, answers) => {
  if (domainId === 'web-development') {
    const bugScore = answers['find-bug']?.selectedLine === 'line-3' ? 90 : 50
    const buildScore = Math.min(100, (answers['build-flow']?.canvasItems?.length || 0) * 12)
    const responsiveScore = Math.min(100, Object.keys(answers['responsive-web']?.assignedFixes || {}).length * 20)
    return {
      scores: [
        { name: 'Technical Thinking', score: Math.round((bugScore + 80) / 2) },
        { name: 'Problem Solving', score: Math.round((bugScore + responsiveScore) / 2) },
        { name: 'User Journey', score: Math.round((buildScore + responsiveScore) / 2) },
        { name: 'Responsive Mindset', score: Math.round((responsiveScore + 70) / 2) },
      ],
      domainFitPercentage: Math.round((bugScore + buildScore + responsiveScore) / 3),
      insight:
        'Your answers suggest strong web development instincts, especially around debugging and mobile experience.',
      strengths: ['Debugging focus', 'Flow thinking', 'Mobile-first awareness'],
      areasToImprove: ['Navigation clarity', 'Responsive polish', 'Component ordering'],
    }
  }

  if (domainId === 'data-science') {
    const patternScore = answers['find-pattern']?.selectedOption === 'misleading-correlation' ? 90 : 55
    const cleanScore = Math.min(100, answers['clean-data']?.selectedCells?.length * 25)
    const chartScore = answers['choose-chart']?.selectedOption === 'line' ? 90 : 60
    return {
      scores: [
        { name: 'Analytical Thinking', score: Math.round((patternScore + cleanScore) / 2) },
        { name: 'Data Quality Awareness', score: cleanScore },
        { name: 'Visualization Sense', score: chartScore },
        { name: 'Insight Focus', score: Math.round((patternScore + chartScore) / 2) },
      ],
      domainFitPercentage: Math.round((patternScore + cleanScore + chartScore) / 3),
      insight:
        'You demonstrate a good eye for misleading patterns and the importance of clean data for analysis.',
      strengths: ['Pattern detection', 'Issue identification', 'Visualization judgement'],
      areasToImprove: ['Dataset consistency', 'Explanation clarity', 'Chart choice precision'],
    }
  }

  if (domainId === 'ai-engineering') {
    const promptScore = answers['prompt-detective']?.selectedOption === 'prompt-b' ? 90 : 55
    const pipelineScore = Math.min(100, (answers['build-pipeline']?.canvasItems?.length || 0) * 15)
    const hallucinationScore = answers['hallucination-detector']?.selectedOption === 'claim-a' ? 90 : 60
    return {
      scores: [
        { name: 'Prompt Understanding', score: promptScore },
        { name: 'System Design', score: pipelineScore },
        { name: 'AI Caution', score: hallucinationScore },
        { name: 'Technical Reasoning', score: Math.round((promptScore + pipelineScore) / 2) },
      ],
      domainFitPercentage: Math.round((promptScore + pipelineScore + hallucinationScore) / 3),
      insight:
        'Your responses show a strong understanding of useful prompts and the structure of an AI pipeline.',
      strengths: ['Prompt clarity', 'Pipeline logic', 'Trust awareness'],
      areasToImprove: ['Pipeline ordering', 'Claim verification', 'Structured reasoning'],
    }
  }

  if (domainId === 'ui-ux') {
    const problemScore = Math.min(100, (answers['find-ux-problems']?.selectedAreas?.length || 0) * 30)
    const flowScore = Math.min(100, (answers['design-flow']?.canvasItems?.length || 0) * 15)
    const decisionScore = answers['ab-decision']?.selectedOption === 'version-b' ? 90 : 60
    return {
      scores: [
        { name: 'Usability Awareness', score: problemScore },
        { name: 'Flow Design', score: flowScore },
        { name: 'Decision Making', score: decisionScore },
        { name: 'User Empathy', score: Math.round((problemScore + decisionScore) / 2) },
      ],
      domainFitPercentage: Math.round((problemScore + flowScore + decisionScore) / 3),
      insight:
        'You show strong UX instincts, especially when identifying usability problems and choosing the simpler design.',
      strengths: ['Problem spotting', 'Flow simplicity', 'Clear prioritization'],
      areasToImprove: ['Screen sequencing', 'Detail refinement', 'Hierarchy consistency'],
    }
  }

  return {
    scores: [
      { name: 'Domain Reasoning', score: 70 },
      { name: 'Problem Solving', score: 70 },
      { name: 'Adaptability', score: 70 },
      { name: 'Practical Thinking', score: 70 },
    ],
    domainFitPercentage: 70,
    insight: 'This domain is still coming soon. Please choose one of the implemented career paths.',
    strengths: ['Curiosity', 'Interest in learning', 'Problem-solving potential'],
    areasToImprove: ['Domain-specific experience', 'Applied practice', 'Focused preparation'],
  }
}
