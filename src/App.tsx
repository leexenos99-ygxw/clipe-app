import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Workspace } from '@/components/Workspace'
import { Home } from '@/components/HomePage'
import { Library } from '@/components/Library'
import { History } from '@/components/History'
import { UserProfile } from '@/components/UserProfile'
import { Settings } from '@/components/Settings'
import { Stats } from '@/components/Stats'
import { Login } from '@/components/Login'
import { API_BASE_URL } from '@/config/api'

function App() {
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online')
  const [questionCount] = useState(0)
  const [currentStep, setCurrentStep] = useState<'upload' | 'detect' | 'edit' | 'export'>('upload')

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await fetch(`${API_BASE_URL}/health`)
        setConnectionStatus('online')
      } catch {
        setConnectionStatus('offline')
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleStepClick = (step: 'upload' | 'detect' | 'edit' | 'export') => {
    setCurrentStep(step)
  }

  return (
    <Router>
      <div className="app">
        <Header
          connectionStatus={connectionStatus}
          questionCount={questionCount}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workspace" element={<Workspace onStepChange={setCurrentStep} />} />
            <Route path="/library" element={<Library />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <style>{`
          .app {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .main-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            padding-top: 108px;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.4); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
          }

          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes slide-in-left {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }

          @keyframes slide-in-right {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    </Router>
  )
}

export default App