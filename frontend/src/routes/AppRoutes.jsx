import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from '../components/layout/Layout'
import LandingPage from '../pages/LandingPage'
import ExplorePage from '../pages/ExplorePage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import ProfilePage from '../pages/ProfilePage'
import DashboardPage from '../pages/DashboardPage'
import RoadmapPage from '../pages/RoadmapPage'
import ChatPage from '../pages/ChatPage'
import MockInterviewPage from '../pages/MockInterviewPage'
import InterviewResults from '../pages/InterviewResults'
import AboutUs from '../pages/AboutUs'

// Exploring flow pages
import ExploringIntro from '../pages/ExploringIntro'
import ExploringActivity from '../pages/ExploringActivity'
import ExploringAnalysis from '../pages/ExploringAnalysis'
import ExploringResults from '../pages/ExploringResults'

// Domain selection and assessment
import DomainSelection from '../pages/DomainSelection'
import DomainAssessment from '../pages/DomainAssessment'
import DomainAnalysis from '../pages/DomainAnalysis'
import DomainResults from '../pages/DomainResults'

// Resume flow pages
import ResumeUpload from '../pages/ResumeUpload'
import ResumeAnalysis from '../pages/ResumeAnalysis'
import ResumeInsights from '../pages/ResumeInsights'
import ResumeAssessment from '../pages/ResumeAssessment'
import ResumeResults from '../pages/ResumeResults'
import CareerMatch from '../pages/CareerMatch'
import SkillGap from '../pages/SkillGap'
import ProtectedRoute from '../auth/ProtectedRoute'

function AppRoutes() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        <Route element={<ProtectedRoute />}>

        {/* I'm Exploring Flow */}
        <Route path="explore/assessment" element={<ExploringIntro />} />
        <Route path="explore/assessment/activity/:activityNum" element={<ExploringActivity />} />
        <Route path="explore/assessment/analysis" element={<ExploringAnalysis />} />
        <Route path="explore/assessment/results" element={<ExploringResults />} />

        {/* I Have a Domain in Mind Flow */}
        <Route path="explore/domain-selection" element={<DomainSelection />} />
        <Route path="explore/domain-assessment/:domainId" element={<DomainAssessment />} />
        <Route path="explore/domain-assessment/:domainId/:activityNum" element={<DomainAssessment />} />
        <Route path="explore/domain-assessment/:domainId/analysis" element={<DomainAnalysis />} />
        <Route path="explore/domain-assessment/:domainId/results" element={<DomainResults />} />

        {/* My Resume Flow */}
        <Route path="explore/resume" element={<ResumeUpload />} />
        <Route path="explore/resume/analysis" element={<ResumeAnalysis />} />
        <Route path="explore/resume/insights" element={<ResumeInsights />} />
        <Route path="explore/resume/assessment/:activityNum" element={<ResumeAssessment />} />
        <Route path="explore/resume/results" element={<ResumeResults />} />
        <Route path="explore/resume/career-match" element={<CareerMatch />} />
        <Route path="explore/resume/skill-gap/:careerId" element={<SkillGap />} />

        {/* /explore is the category-based start page */}
        <Route path="explore" element={<ExplorePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="explore/roadmap" element={<RoadmapPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="mock-interview" element={<MockInterviewPage />} />
        <Route path="mock-interview/results" element={<InterviewResults />} />
        <Route path="about" element={<AboutUs />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
