import AppRoutes from './routes/AppRoutes'
import GlobalCinematicBackground from './components/layout/GlobalCinematicBackground'
import AuthProvider from './auth/AuthContext'
import Journey1AssessmentProvider from './auth/Journey1AssessmentContext'
import Journey2AssessmentProvider from './auth/Journey2AssessmentContext'
import Route3AssessmentProvider from './auth/Route3AssessmentContext'

function App() {
  return (
    <AuthProvider>
      <Journey1AssessmentProvider>
        <Journey2AssessmentProvider>
          <Route3AssessmentProvider>
            <GlobalCinematicBackground />
            <AppRoutes />
          </Route3AssessmentProvider>
        </Journey2AssessmentProvider>
      </Journey1AssessmentProvider>
    </AuthProvider>
  )
}

export default App
