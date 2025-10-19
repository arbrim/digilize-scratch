import type { FC } from "react"
import { useEffect, useMemo, useState } from "react"
import { brand } from "../config/brand"
import type { AuthSession } from "../services/auth"
import type { AppView } from "../types/navigation"
import type { Client, Fatura } from "../data/sampleData"
import { formatDate, getFaturasByClient } from "../data/sampleData"
import ClientFaturasCard from "./ClientFaturasCard"
import ClientsTable from "./ClientsTable"
import FaturaDetailCard from "./FaturaDetailCard"
import FaturaTable from "./FaturaTable"
import SignInForm, { type SignInValues } from "./SignInForm"
import SignUpForm, { type SignUpValues } from "./SignUpForm"
import UsersTable from "./UsersTable"

type AuthView = "sign-in" | "sign-up"

type MainContentProps = {
  isSignedIn: boolean
  isLoading: boolean
  session: AuthSession | null
  activeView: AppView
  clients: Client[]
  faturas: Fatura[]
  selectedClient: Client | null
  selectedFatura: Fatura | null
  errorMessage: string | null
  onDismissError: () => void
  onSignIn: (values: SignInValues) => Promise<void> | void
  onSignUp: (values: SignUpValues) => Promise<void> | void
  onSignOut: () => void
  onNavigate: (view: AppView) => void
  onSelectClient: (clientId: string) => void
  onSelectFatura: (fatura: Fatura) => void
  onBackToClient: (clientId: string) => void
}

const MainContent: FC<MainContentProps> = ({
  isSignedIn,
  isLoading,
  session,
  activeView,
  clients,
  faturas,
  selectedClient,
  selectedFatura,
  errorMessage,
  onDismissError,
  onSignIn,
  onSignUp,
  onSignOut,
  onNavigate,
  onSelectClient,
  onSelectFatura,
  onBackToClient,
}) => {
  const [view, setView] = useState<AuthView>("sign-in")

  useEffect(() => {
    if (!isSignedIn) {
      setView("sign-in")
    }
  }, [isSignedIn])

  const sessionExpiresText = useMemo(() => {
    if (!session) {
      return null
    }

    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(session.expiresAt))
    } catch (error) {
      console.warn("Unable to format session expiry", error)
      return null
    }
  }, [session])

  const renderSignedInContent = () => {
    switch (activeView) {
      case "clients": {
        const clientFaturas = selectedClient ? getFaturasByClient(selectedClient.id) : []
        return (
          <div className="dashboard-section-stack">
            <ClientsTable
              clients={clients}
              onSelect={onSelectClient}
              selectedClientId={selectedClient?.id}
            />
            {selectedClient ? (
              <ClientFaturasCard
                client={selectedClient}
                faturas={clientFaturas}
                onSelectFatura={onSelectFatura}
              />
            ) : null}
          </div>
        )
      }
      case "users":
        return <UsersTable />
      case "fatura": {
        if (selectedFatura) {
          const client = clients.find((entry) => entry.id === selectedFatura.clientId)
          return (
            <FaturaDetailCard
              fatura={selectedFatura}
              client={client}
              onBackToClient={client ? onBackToClient : undefined}
            />
          )
        }
        return (
          <FaturaTable
            faturas={faturas}
            clients={clients}
            onSelect={onSelectFatura}
          />
        )
      }
      case "home":
      default: {
        if (selectedClient) {
          const clientFaturas = getFaturasByClient(selectedClient.id)
          return (
            <ClientFaturasCard
              client={selectedClient}
              faturas={clientFaturas}
              onSelectFatura={onSelectFatura}
            />
          )
        }

        const upcomingInvoices = [...faturas]
          .filter((fatura) => !fatura.paid)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 3)

        return (
          <div className="placeholder-card">
            <h2>Mire se erdhe serish!</h2>
            <p>
              Zgjidh "Clients" per te punuar me klientet, "Users" per te pare ekipin ose perzgjidh nje fature
              poshte per te pare detajet.
            </p>
            <div className="placeholder-actions">
              <button type="button" className="secondary-action" onClick={() => onNavigate("clients")}>
                Shiko klientet
              </button>
              <button type="button" className="secondary-action" onClick={() => onNavigate("fatura")}>
                Hap faturat
              </button>
            </div>
            <div className="home-invoices">
              <h3>Fatura qe duhen ndjekur</h3>
              <ul>
                {upcomingInvoices.map((fatura) => (
                  <li key={fatura.id}>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onSelectFatura(fatura)}
                    >
                      {fatura.nr}  -  {fatura.description}  -  {formatDate(fatura.date)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <main className="app-main">
      <div className="container main-inner">
        <h1 className="headline">Welcome to {brand.name}</h1>
        <p className="subcopy">
          {isSignedIn
            ? `Explore your personalized ${brand.name} dashboard and jump back into what matters most.`
            : `Sign in to access your ${brand.name} workspace or create an account to get started.`}
        </p>

        {errorMessage ? (
          <div className="form-error" role="alert">
            <span>{errorMessage}</span>
            <button type="button" onClick={onDismissError} aria-label="Dismiss error">
              Mbyll
            </button>
          </div>
        ) : null}

        {isSignedIn ? (
          <div className="signed-in-wrapper">
            <div className="dashboard-header">
              {sessionExpiresText ? (
                <p className="session-note">Sesioni qendron aktiv deri me {sessionExpiresText}.</p>
              ) : null}
              <button type="button" className="primary-action" onClick={onSignOut}>
                Sign out
              </button>
            </div>
            {renderSignedInContent()}
          </div>
        ) : (
          <div className="auth-panel" aria-busy={isLoading}>
            <div className="auth-switch">
              <button
                type="button"
                className={view === "sign-in" ? "switch-tab switch-tab-active" : "switch-tab"}
                onClick={() => setView("sign-in")}
                disabled={isLoading}
              >
                Sign in
              </button>
              <button
                type="button"
                className={view === "sign-up" ? "switch-tab switch-tab-active" : "switch-tab"}
                onClick={() => setView("sign-up")}
                disabled={isLoading}
              >
                Sign up
              </button>
            </div>

            {view === "sign-in" ? (
              <SignInForm onSubmit={onSignIn} isSubmitting={isLoading} />
            ) : (
              <SignUpForm onSubmit={onSignUp} isSubmitting={isLoading} />
            )}

            <p className="auth-footer">
              {view === "sign-in" ? (
                <>
                  New here?{' '}
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => setView("sign-up")}
                    disabled={isLoading}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="inline-link"
                    onClick={() => setView("sign-in")}
                    disabled={isLoading}
                  >
                    Sign in instead
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContent

