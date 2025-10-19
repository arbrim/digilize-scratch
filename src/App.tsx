import { useEffect, useMemo, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPage from "./pages/AuthPage"
import ClientsPage from "./pages/ClientsPage"
import FaturaPage from "./pages/FaturaPage"
import HomePage from "./pages/HomePage"
import UsersPage from "./pages/UsersPage"
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
import {
  clients as sampleClients,
  faturas as sampleFaturas,
  getClientById,
} from "./data/sampleData"
import type { Client, Fatura } from "./data/sampleData"
import "./App.css"

type AuthStatus = "idle" | "submitting"

type AuthError = {
  message: string
}

function App() {
  const navigate = useNavigate()
  const [session, setSession] = useState<AuthSession | null>(() => loadSession())
  const [status, setStatus] = useState<AuthStatus>("idle")
  const [error, setError] = useState<AuthError | null>(null)
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
    return faturas.find((entry) => entry.id === selectedFaturaId) ?? null
  }, [selectedFaturaId, faturas])

  const resetSelections = () => {
    setSelectedClientId(null)
    setSelectedFaturaId(null)
  }

  const handleSignIn = async (values: SignInValues): Promise<boolean> => {
    setStatus("submitting")
    setError(null)
    try {
      const result = await signInRequest(values)
      setSession(result)
      resetSelections()
      return true
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : "Nuk u arrit hyrja. Provo perseri."
      setError({ message })
      return false
    } finally {
      setStatus("idle")
    }
  }

  const handleSignUp = async (values: SignUpValues): Promise<boolean> => {
    setStatus("submitting")
    setError(null)
    try {
      const result = await signUpRequest(values)
      setSession(result)
      resetSelections()
      return true
    } catch (error_) {
      const message = error_ instanceof Error ? error_.message : "Nuk u arrit regjistrimi. Provo perseri."
      setError({ message })
      return false
    } finally {
      setStatus("idle")
    }
  }

  const handleSignOut = () => {
    clearSession()
    setSession(null)
    setError(null)
    resetSelections()
    navigate("/signin", { replace: true })
  }

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId)
    setSelectedFaturaId(null)
  }

  const handleSelectFatura = (fatura: Fatura) => {
    setSelectedFaturaId(fatura.id)
    setSelectedClientId(fatura.clientId)
    navigate("/fatura")
  }

  const handleBackToClient = (clientId: string) => {
    setSelectedClientId(clientId)
    setSelectedFaturaId(null)
    navigate("/clients")
  }

  return (
    <Routes>
      <Route element={<AppLayout isSignedIn={isSignedIn} onSignOut={handleSignOut} />}>
        <Route
          path="/"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <HomePage
                selectedClient={selectedClient}
                faturas={faturas}
                onSelectFatura={handleSelectFatura}
                onGoToClients={() => navigate("/clients")}
                onGoToFaturas={() => navigate("/fatura")}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <ClientsPage
                clients={clients}
                selectedClient={selectedClient}
                onSelectClient={handleSelectClient}
                onSelectFatura={handleSelectFatura}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fatura"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <FaturaPage
                faturas={faturas}
                clients={clients}
                selectedFatura={selectedFatura}
                onSelectFatura={handleSelectFatura}
                onBackToClient={handleBackToClient}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={
            isSignedIn ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage
                mode="sign-in"
                isSubmitting={isSubmitting}
                errorMessage={error?.message ?? null}
                onDismissError={() => setError(null)}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isSignedIn ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage
                mode="sign-up"
                isSubmitting={isSubmitting}
                errorMessage={error?.message ?? null}
                onDismissError={() => setError(null)}
                onSignIn={handleSignIn}
                onSignUp={handleSignUp}
              />
            )
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={isSignedIn ? "/" : "/signin"} replace />} />
    </Routes>
  )
}

export default App
