import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import type { SignInValues } from "./components/SignInForm"
import type { SignUpValues } from "./components/SignUpForm"
import {
  clearSession,
  isSessionValid,
  loadSession,
  signInRequest,
  signUpRequest,
  type AuthSession,
} from "./services/auth"
import type { AppView } from "./types/navigation"
import "./App.css"

type AuthStatus = "idle" | "submitting"

type AuthError = {
  message: string
}

function App() {
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [status, setStatus] = useState<AuthStatus>("idle")
  const [error, setError] = useState<AuthError | null>(null)
  const [activeView, setActiveView] = useState<AppView>("home")

  useEffect(() => {
    const stored = loadSession()
    if (stored) {
      setSession(stored)
    }
  }, [])

  const isSubmitting = status === "submitting"
  const isSignedIn = isSessionValid(session)

  const resetToHome = () => {
    setActiveView("home")
  }

  const handleSignIn = async (values: SignInValues) => {
    setStatus("submitting")
    setError(null)
    try {
      const result = await signInRequest(values)
      setSession(result)
      resetToHome()
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : "Unable to sign in. Please try again."
      setError({ message })
    } finally {
      setStatus("idle")
    }
  }

  const handleSignUp = async (values: SignUpValues) => {
    setStatus("submitting")
    setError(null)
    try {
      const result = await signUpRequest(values)
      setSession(result)
      resetToHome()
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : "Unable to sign up. Please try again."
      setError({ message })
    } finally {
      setStatus("idle")
    }
  }

  const handleSignOut = () => {
    clearSession()
    setSession(null)
    setError(null)
    resetToHome()
  }

  const handleNavigate = (view: AppView) => {
    setActiveView(view)
  }

  return (
    <div className="app-shell">
      <Header isSignedIn={isSignedIn} activeView={activeView} onNavigate={handleNavigate} />
      <MainContent
        session={session}
        isSignedIn={isSignedIn}
        isLoading={isSubmitting}
        activeView={activeView}
        errorMessage={error?.message ?? null}
        onDismissError={() => setError(null)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
      />
      <Footer />
    </div>
  )
}

export default App
