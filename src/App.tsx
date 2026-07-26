import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Validator from './pages/Validator'
import CamelToe from './pages/CamelToe'
import MeetTheTeam from './pages/MeetTheTeam'

function Navigation() {
  const location = useLocation()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? 'bg-green-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`

  return (
    <nav className="bg-gray-950 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold text-lg">DP</span>
          </div>
          <div className="flex gap-1">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/collection" className={linkClass('/collection')}>Collection</Link>
            <Link to="/validator" className={linkClass('/validator')}>Validator</Link>
            <Link to="/cameltoe" className={linkClass('/cameltoe')}>CamelToe</Link>
            <Link to="/team" className={linkClass('/team')}>Meet the Team</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/validator" element={<Validator />} />
            <Route path="/cameltoe" element={<CamelToe />} />
            <Route path="/team" element={<MeetTheTeam />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App