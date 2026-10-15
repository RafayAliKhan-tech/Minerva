import { Outlet, useLocation, Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useAuth } from '../../auth/AuthContext'

const AUTH_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password']
const ASSESSMENT_PREFIXES = [
  '/explore/assessment',
  '/explore/domain-',
  '/explore/resume',
]

function Layout() {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const isAuthPage = AUTH_ROUTES.includes(pathname)
  const isChatPage = pathname === '/chat'
  const isAssessmentFlow = ASSESSMENT_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  const hideChatFab =
    isChatPage ||
    isAuthPage ||
    (!isAuthenticated && pathname === '/')

  return (
    <div
      className={`page-shell${isAuthPage ? ' auth-page-shell' : ''}${isChatPage ? ' chat-app-shell' : ''}`}
    >
      {!isChatPage && <Navbar />}
      <main
        className={`page-main-content${isAuthPage ? ' auth-page-main' : ''}${isChatPage ? ' chat-app-main' : ''}`}
      >
        <Outlet />
      </main>
      {!isAuthPage && !isChatPage && !isAssessmentFlow && <Footer />}
      {!hideChatFab && isAuthenticated && (
        <Link to="/chat" aria-label="Open Minerva chat" className="chat-fab">
          <MessageCircle size={22} />
        </Link>
      )}
    </div>
  )
}

export default Layout
