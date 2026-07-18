import { useState } from 'react'
import { AdminLogin } from './AdminLogin'
import { AdminPanel } from './AdminPanel'

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem('zc_admin') === '1'
  )

  const handleLogout = () => {
    sessionStorage.removeItem('zc_admin')
    setIsLoggedIn(false)
  }

  return isLoggedIn
    ? <AdminPanel onLogout={handleLogout} />
    : <AdminLogin onLogin={() => setIsLoggedIn(true)} />
}
