import styles from './App.module.css'
import { YnabAuth } from './components/YnabAuth'
import { YnabDashboard } from './components/YnabDashboard'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { useYnabAuth } from './hooks/useYnabAuth'
import { Routes, Route, Link } from 'react-router-dom'

function App() {
  const { isAuthenticated } = useYnabAuth()

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Sub Tracker</h1>
        <p>Track your subscriptions by connecting to YNAB</p>
        <nav>
          <Link to="/">Home</Link> | <Link to="/policy">Privacy Policy</Link>
        </nav>
      </header>
      <main className={styles.appMain}>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.heroSection}>
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
