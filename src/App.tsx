import { Route, Routes } from 'react-router-dom'
import './App.css'
import { SupabaseProvider } from './contexts/SupabaseContext'
import Home from './pages/Home'
import Signup from './pages/Signup'
import BankLink from './pages/BankLink'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <SupabaseProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bank-link" element={<BankLink />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </SupabaseProvider>
  )
}

export default App
