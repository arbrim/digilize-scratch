import type { FC } from "react"
import { useEffect } from "react"
import { Link, useLocation, useNavigate, type Location } from "react-router-dom"
import type { SignInValues } from "../components/SignInForm"
import SignInForm from "../components/SignInForm"
import type { SignUpValues } from "../components/SignUpForm"
import SignUpForm from "../components/SignUpForm"

export type AuthPageMode = "sign-in" | "sign-up"

type AuthPageProps = {
  mode: AuthPageMode
  isSubmitting: boolean
  errorMessage: string | null
  onDismissError: () => void
  onSignIn: (values: SignInValues) => Promise<boolean>
  onSignUp: (values: SignUpValues) => Promise<boolean>
}

const AuthPage: FC<AuthPageProps> = ({
  mode,
  isSubmitting,
  errorMessage,
  onDismissError,
  onSignIn,
  onSignUp,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { from?: Location } | undefined
  const nextPath = state?.from?.pathname ?? "/"

  useEffect(() => {
    if (errorMessage) {
      onDismissError()
    }
  }, [mode, errorMessage, onDismissError])

  const handleSignIn = async (values: SignInValues) => {
    const success = await onSignIn(values)
    if (success) {
      navigate(nextPath, { replace: true })
    }
  }

  const handleSignUp = async (values: SignUpValues) => {
    const success = await onSignUp(values)
    if (success) {
      navigate(nextPath, { replace: true })
    }
  }

  return (
    <div className="auth-panel" aria-busy={isSubmitting}>
      <div className="auth-switch">
        <Link
          to="/signin"
          className={mode === "sign-in" ? "switch-tab switch-tab-active" : "switch-tab"}
        >
          Hyr
        </Link>
        <Link
          to="/signup"
          className={mode === "sign-up" ? "switch-tab switch-tab-active" : "switch-tab"}
        >
          Regjistrohu
        </Link>
      </div>

      {errorMessage ? (
        <div className="form-error" role="alert">
          <span>{errorMessage}</span>
          <button type="button" onClick={onDismissError} aria-label="Fshi gabimin">
            Mbyll
          </button>
        </div>
      ) : null}

      {mode === "sign-in" ? (
        <SignInForm onSubmit={handleSignIn} isSubmitting={isSubmitting} />
      ) : (
        <SignUpForm onSubmit={handleSignUp} isSubmitting={isSubmitting} />
      )}

      <p className="auth-footer">
        {mode === "sign-in" ? (
          <>
            Nuk ke llogari? <Link className="inline-link" to="/signup">Krijo llogari</Link>
          </>
        ) : (
          <>
            Ke llogari? <Link className="inline-link" to="/signin">Hyr ketu</Link>
          </>
        )}
      </p>
    </div>
  )
}

export default AuthPage
