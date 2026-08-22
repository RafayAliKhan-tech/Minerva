import AppRoutes from './routes/AppRoutes'
import GlobalCinematicBackground from './components/layout/GlobalCinematicBackground'
import AuthProvider from './auth/AuthContext'

function App() {
  return (
    <AuthProvider>
      <GlobalCinematicBackground />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
