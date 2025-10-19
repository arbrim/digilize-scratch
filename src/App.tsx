import { useEffect, useState } from "react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import AuthPage from "./pages/AuthPage"
import ClientsPage from "./pages/ClientsPage"
import ClientDetailsPage from "./pages/ClientDetailsPage"
import ClientCreatePage from "./pages/ClientCreatePage"
import FaturaPage from "./pages/FaturaPage"
import FaturaDetailPage from "./pages/FaturaDetailPage"
import FaturaCreatePage from "./pages/FaturaCreatePage"
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
import { clients as sampleClients, faturas as sampleFaturas, type Fatura } from "./data/sampleData"
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

  const handleSignIn = async (values: SignInValues): Promise<boolean> => {
    setStatus("submitting")
    setError(null)
    try {
      const result = await signInRequest(values)
      setSession(result)
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
    navigate("/signin", { replace: true })
  }

  const handleSelectClient = (clientId: string) => {
    navigate(`/clients/${clientId}`)
  }

  const handleSelectFatura = (fatura: Fatura) => {
    navigate(`/fatura/${fatura.id}`)
  }

  const handleBackToClient = (clientId: string) => {
    navigate(`/clients/${clientId}`)
  }

  const handleCreateClient = () => {
    navigate("/clients/new")
  }

  const handleCreateFatura = () => {
    navigate("/fatura/new")
  }

  return (
    <Routes>
      <Route element={<AppLayout isSignedIn={isSignedIn} onSignOut={handleSignOut} />}>
        <Route
          path="/"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <HomePage
                onAddClient={handleCreateClient}
                onAddFatura={handleCreateFatura}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <ClientsPage clients={clients} onSelectClient={handleSelectClient} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <ClientCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:clientId"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <ClientDetailsPage clients={clients} faturas={faturas} onSelectFatura={handleSelectFatura} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fatura"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <FaturaPage faturas={faturas} clients={clients} onSelectFatura={handleSelectFatura} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fatura/new"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <FaturaCreatePage clients={clients} onBackToList={() => navigate("/fatura")} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fatura/:faturaId"
          element={
            <ProtectedRoute isSignedIn={isSignedIn}>
              <FaturaDetailPage faturas={faturas} clients={clients} onBackToClient={handleBackToClient} />
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
