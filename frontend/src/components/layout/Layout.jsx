import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const AUTH_ROUTES = ['/login', '/signup']

function Layout({ showFooter = true }) {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_ROUTES.includes(pathname)

  return (
    <div className={`page-shell${isAuthPage ? ' auth-page-shell' : ''}`}>
      <Navbar />
      <main className={`page-main-content${isAuthPage ? ' auth-page-main' : ''}`}>
        <Outlet />
      </main>
      {showFooter && <Footer compact={isAuthPage} />}
    </div>
  )
}

export default Layout
