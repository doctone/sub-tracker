import './App.css'
import { YnabAuth } from './components/YnabAuth'
import { YnabDashboard } from './components/YnabDashboard'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { useYnabAuth } from './hooks/useYnabAuth'
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  const { isAuthenticated } = useYnabAuth()
  

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sub Tracker</h1>
        <p>Track your subscriptions by connecting to YNAB</p>
        <nav>
          <Link to="/">Home</Link> | <Link to="/policy">Privacy Policy</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="hero-section">
                {isAuthenticated ? <YnabDashboard /> : <YnabAuth />}
              </div>
            }
          />
          <Route path="/policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
