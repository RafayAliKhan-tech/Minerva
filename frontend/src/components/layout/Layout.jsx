import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const AUTH_ROUTES = ['/login', '/signup']

function Layout({ showFooter = true }) {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <div className={`page-shell${isAuthPage ? ' auth-page-shell' : ''}`}>
      <Navbar />
      <main className={`page-main-content${isAuthPage ? ' auth-page-main' : ''}`}>
        <Outlet />
      </main>
      {showFooter && <Footer compact={isAuthPage} />}
      {isAuthenticated && <Link to="/chat" aria-label="Open Minerva chat" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#c38d66] text-white shadow-lg transition-transform hover:-translate-y-1"><MessageCircle size={23} /></Link>}
    </div>
  )
}

export default Layout
