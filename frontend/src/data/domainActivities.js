import {
  Code2,
  Palette,
  BarChart3,
  Brain,
  Shield,
} from 'lucide-react'
import { getCareers, getCareerQuestions } from './assessmentData'

// Map career IDs to icons and colors
const careerIconMap = {
  ui_ux: Palette,
  development: Code2,
  data: BarChart3,
  ai: Brain,
  cyber: Shield,
}

const careerColorMap = {
  ui_ux: 'bg-pink-100',
  development: 'bg-blue-100',
  data: 'bg-green-100',
  ai: 'bg-orange-100',
  cyber: 'bg-red-100',
}

// Domain definitions - converted from assessment careers
const jsonCareers = getCareers()
export const domains = jsonCareers.map((career) => ({
  id: career.id,
  name: career.name,
  description: career.primary_dimension_name,
  icon: careerIconMap[career.id],
  color: careerColorMap[career.id],
  route: `/explore/domain-assessment/${career.id}`,
}))

// Get activities for a specific career - convert questions to activity format
export const getDomainActivities = (careerId) => {
  const questions = getCareerQuestions(careerId)
  return questions.map((question, index) => ({
    id: question.id,
    title: question.title,
    description: question.title,
    duration: 60,
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
  }))
}

export const generateDomainResult = (careerId, answers) => {
  // Calculate score based on correct answers
  const careerQuestions = getCareerQuestions(careerId)
  let correctCount = 0
  let totalCount = 0

  Object.values(answers).forEach((answer) => {
    if (answer && answer.questionId) {
      const question = careerQuestions.find((q) => q.id === answer.questionId)
      if (question) {
        totalCount += 1
        if (answer.selectedOption === question.correct_option) {
          correctCount += 1
        }
      }
    }
  })

  const domainFitPercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  // Get career name and primary dimension
  const career = jsonCareers.find((c) => c.id === careerId)
  const careerName = career?.name || 'Career'
  const primaryDimension = career?.primary_dimension_name || 'Career Reasoning'

  return {
    scores: [
      { name: primaryDimension, score: domainFitPercentage },
      { name: 'Problem Solving', score: Math.max(50, domainFitPercentage - 10) },
      { name: 'Decision Making', score: Math.max(50, domainFitPercentage - 5) },
      { name: 'Career Fit', score: domainFitPercentage },
    ],
    domainFitPercentage: domainFitPercentage,
    insight:
      domainFitPercentage >= 80
        ? `Excellent performance! You demonstrate strong aptitude for ${careerName}.`
        : domainFitPercentage >= 60
          ? `Good foundation in ${careerName}. Continue building these skills.`
          : `Developing your skills in ${careerName}. Keep learning and practicing.`,
    strengths:
      domainFitPercentage >= 80
        ? ['Strong problem-solving', 'Logical reasoning', 'Domain understanding']
        : ['Foundational knowledge', 'Learning potential', 'Growth mindset'],
    areasToImprove:
      domainFitPercentage < 60
        ? ['Concept clarity', 'Practice problems', 'Real-world applications']
        : ['Advanced techniques', 'Complexity handling', 'Optimization'],
  }
}
