import { getExploringQuestions } from './assessmentData'

// Convert questions from JSON to activity format
const jsonQuestions = getExploringQuestions()

export const exploringActivities = jsonQuestions.map((question, index) => ({
  id: question.id,
  title: question.title,
  description: question.title,
  duration: 180,
  type: 'multiple-choice',
  instruction: question.instruction,
  question_id: question.id,
  career: question.career,
  career_name: question.career_name,
  options: question.options,
  correct_option: question.correct_option, // Keep for backend scoring
  score: question.score,
  primary_dimension: question.primary_dimension,
  secondary_dimension: question.secondary_dimension,
  behavior_signals: question.behavior_signals,
}))

export const generateMindProfile = (answers) => {
  // Calculate scores per career based on correct answers
  const careerScores = {
    ui_ux: 0,
    development: 0,
    data: 0,
    ai: 0,
    cyber: 0,
  }

  const careerCounts = {
    ui_ux: 0,
    development: 0,
    data: 0,
    ai: 0,
    cyber: 0,
  }

  // Score each answer
  Object.values(answers).forEach((answer) => {
    if (answer && answer.questionId) {
      const question = jsonQuestions.find((q) => q.id === answer.questionId)
      if (question && question.career) {
        careerCounts[question.career] = (careerCounts[question.career] || 0) + 1
        if (answer.selectedOption === question.correct_option) {
          careerScores[question.career] = (careerScores[question.career] || 0) + 1
        }
      }
    }
  })

  // Convert to percentages
  const careerPercentages = Object.keys(careerScores).reduce((acc, career) => {
    acc[career] = careerCounts[career] > 0 ? Math.round((careerScores[career] / careerCounts[career]) * 100) : 0
    return acc
  }, {})

  // Determine overall analytical thinking from correctness
  const totalAnswers = Object.values(careerCounts).reduce((a, b) => a + b, 0)
  const correctAnswers = Object.values(careerScores).reduce((a, b) => a + b, 0)
  const analyticalThinking = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  // Map careers to domains and calculate matches
  const careerToDomainMap = {
    ui_ux: 'UI/UX Design',
    development: 'Software Development',
    data: 'Data & Analytics',
    ai: 'AI & Machine Learning',
    cyber: 'Cybersecurity',
  }

  const potentialDomains = Object.entries(careerPercentages)
    .map(([career, score]) => ({
      domain: careerToDomainMap[career],
      match: score,
    }))
    .sort((a, b) => b.match - a.match)

  return {
    analyticalThinking: Math.max(analyticalThinking, 50), // At least 50 to be fair
    problemSolving: careerPercentages.development || 60,
    creativeThinking: careerPercentages.ui_ux || 60,
    userThinking: careerPercentages.data || 60,
    insights: [
      analyticalThinking > 70
        ? 'You demonstrate strong logical reasoning and spot correct solutions quickly.'
        : 'You are building your problem-solving skills. Keep practicing logic puzzles and decision-making.',
      careerPercentages.ui_ux > careerPercentages.development
        ? 'You naturally think about user experience and usability.'
        : 'You lean toward logical and systematic problem-solving.',
      careerPercentages.ai > 60
        ? 'You show aptitude for machine learning concepts and prediction thinking.'
        : 'Explore how data science and AI applications can complement your strengths.',
    ],
    potentialDomains: potentialDomains,
  }
}
