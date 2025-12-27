import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProcessList from './pages/ProcessList'
import ProcessEditor from './pages/ProcessEditor'
import Login from './pages/Login'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/processes" element={<ProcessList />} />
          <Route path="/processes/new" element={<ProcessEditor />} />
          <Route path="/processes/:id" element={<ProcessEditor />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
