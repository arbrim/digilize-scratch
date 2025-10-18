import type { FC } from "react"
import { useEffect, useState } from "react"
import SignInForm, { type SignInValues } from "./SignInForm"
import SignUpForm, { type SignUpValues } from "./SignUpForm"

type AuthView = "sign-in" | "sign-up"

type MainContentProps = {
  isSignedIn: boolean
  onSignIn: (values: SignInValues) => void
  onSignUp: (values: SignUpValues) => void
  onSignOut: () => void
}

const MainContent: FC<MainContentProps> = ({ isSignedIn, onSignIn, onSignUp, onSignOut }) => {
  const [view, setView] = useState<AuthView>("sign-in")

  useEffect(() => {
    if (!isSignedIn) {
      setView("sign-in")
    }
  }, [isSignedIn])

  return (
    <main className="app-main">
      <div className="container main-inner">
        <h1 className="headline">Welcome to Galani</h1>
        <p className="subcopy">
          {isSignedIn
            ? "Explore your personalized dashboard and jump back into what matters most."
            : "Sign in to access your Galani workspace or create an account to get started."}
        </p>

        {isSignedIn ? (
          <div className="welcome-actions">
            <button type="button" className="primary-action" onClick={onSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="auth-panel">
            <div className="auth-switch">
              <button
                type="button"
                className={view === "sign-in" ? "switch-tab switch-tab-active" : "switch-tab"}
                onClick={() => setView("sign-in")}
              >
                Sign in
              </button>
              <button
                type="button"
                className={view === "sign-up" ? "switch-tab switch-tab-active" : "switch-tab"}
                onClick={() => setView("sign-up")}
              >
                Sign up
              </button>
            </div>

            {view === "sign-in" ? (
              <SignInForm onSubmit={onSignIn} />
            ) : (
              <SignUpForm onSubmit={onSignUp} />
            )}

            <p className="auth-footer">
              {view === "sign-in" ? (
                <>
                  New here?{' '}
                  <button type="button" className="inline-link" onClick={() => setView("sign-up")}>
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" className="inline-link" onClick={() => setView("sign-in")}>
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
