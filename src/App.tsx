import './App.css'
import { GmailAuth } from './components/GmailAuth'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Sub Tracker</h1>
        <p>Track your subscriptions by analyzing your emails</p>
      </header>
      <main className="app-main">
        <div className="hero-section">
          <GmailAuth />
        </div>
      </main>
    </div>
  )
}

export default App
