import type { FC } from "react"
import { useEffect, useMemo, useState } from "react"
import { brand } from "../config/brand"
import type { AuthSession } from "../services/auth"
import SignInForm, { type SignInValues } from "./SignInForm"
import SignUpForm, { type SignUpValues } from "./SignUpForm"

type AuthView = "sign-in" | "sign-up"

type MainContentProps = {
  isSignedIn: boolean
  isLoading: boolean
  session: AuthSession | null
  errorMessage: string | null
  onDismissError: () => void
  onSignIn: (values: SignInValues) => Promise<void> | void
  onSignUp: (values: SignUpValues) => Promise<void> | void
  onSignOut: () => void
}

const MainContent: FC<MainContentProps> = ({
  isSignedIn,
  isLoading,
  session,
  errorMessage,
  onDismissError,
  onSignIn,
  onSignUp,
  onSignOut,
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
              Close
            </button>
          </div>
        ) : null}

        {isSignedIn ? (
          <div className="welcome-actions">
            {sessionExpiresText ? (
              <p className="session-note">Session stays active until {sessionExpiresText}.</p>
            ) : null}
            <button type="button" className="primary-action" onClick={onSignOut}>
              Sign out
            </button>
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
