import type { FC, FormEvent } from "react"

export type SignInValues = {
  username: string
  password: string
}

type SignInFormProps = {
  onSubmit: (values: SignInValues) => Promise<void> | void
  isSubmitting?: boolean
}

const SignInForm: FC<SignInFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>

    await onSubmit({
      username: String(values.username ?? ""),
      password: String(values.password ?? ""),
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Enter username"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          required
          disabled={isSubmitting}
        />
      </div>
      <button type="submit" className="primary-action" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}

export default SignInForm
