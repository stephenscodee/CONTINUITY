import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, BookOpen, LayoutDashboard, LogOut, User } from 'lucide-react'
import useStore from '../store/useStore'

const Navbar = () => {
  const { user, logout } = useStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
          <Activity className="w-6 h-6" />
          <span>Mapa Vivo</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-primary">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/processes" className="flex items-center space-x-1 text-gray-600 hover:text-primary">
            <BookOpen className="w-4 h-4" />
            <span>Procesos</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-sm hidden sm:inline">{user.full_name}</span>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-danger rounded-full hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
