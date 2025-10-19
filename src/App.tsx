import { useEffect, useMemo, useState } from "react"
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
import { clients as sampleClients, faturas as sampleFaturas, getClientById } from "./data/sampleData"
import type { Client, Fatura } from "./data/sampleData"
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
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [selectedFaturaId, setSelectedFaturaId] = useState<string | null>(null)

  useEffect(() => {
    const stored = loadSession()
    if (stored) {
      setSession(stored)
    }
  }, [])

  const isSubmitting = status === "submitting"
  const isSignedIn = isSessionValid(session)

  const clients = sampleClients
  const faturas = sampleFaturas

  const selectedClient: Client | null = useMemo(() => {
    if (!selectedClientId) {
      return null
    }
    return getClientById(selectedClientId) ?? null
  }, [selectedClientId])

  const selectedFatura: Fatura | null = useMemo(() => {
    if (!selectedFaturaId) {
      return null
    }
    const found = faturas.find((entry) => entry.id === selectedFaturaId)
    return found ?? null
  }, [selectedFaturaId, faturas])

  const resetToHome = () => {
    setActiveView("home")
  }

  const resetSelections = () => {
    setSelectedClientId(null)
    setSelectedFaturaId(null)
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
    resetSelections()
    resetToHome()
  }

  const handleNavigate = (view: AppView) => {
    setActiveView(view)
  }

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId)
    setSelectedFaturaId(null)
    setActiveView("home")
  }

  const handleFaturaSelect = (fatura: Fatura) => {
    setSelectedFaturaId(fatura.id)
    if (fatura.clientId) {
      setSelectedClientId(fatura.clientId)
    }
    setActiveView("fatura")
  }

  const handleBackToClient = (clientId: string) => {
    setSelectedClientId(clientId)
    setActiveView("home")
  }

  return (
    <div className="app-shell">
      <Header isSignedIn={isSignedIn} activeView={activeView} onNavigate={handleNavigate} />
      <MainContent
        session={session}
        isSignedIn={isSignedIn}
        isLoading={isSubmitting}
        activeView={activeView}
        clients={clients}
        faturas={faturas}
        selectedClient={selectedClient}
        selectedFatura={selectedFatura}
        errorMessage={error?.message ?? null}
        onDismissError={() => setError(null)}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
        onNavigate={handleNavigate}
        onSelectClient={handleClientSelect}
        onSelectFatura={handleFaturaSelect}
        onBackToClient={handleBackToClient}
      />
      <Footer />
    </div>
  )
}

export default App
