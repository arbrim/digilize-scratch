import type { FC, FormEvent } from "react"

export type SignUpValues = {
  username: string
  email: string
  password: string
}

type SignUpFormProps = {
  onSubmit: (values: SignUpValues) => void
}

const SignUpForm: FC<SignUpFormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>

    onSubmit({
      username: String(values.username ?? ""),
      email: String(values.email ?? ""),
      password: String(values.password ?? ""),
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="signup-username">Username</label>
        <input id="signup-username" name="username" type="text" placeholder="Choose username" required />
      </div>
      <div className="form-group">
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" name="email" type="email" placeholder="name@example.com" required />
      </div>
      <div className="form-group">
        <label htmlFor="signup-password">Password</label>
        <input id="signup-password" name="password" type="password" placeholder="Create password" required />
      </div>
      <button type="submit" className="primary-action">
        Create account
      </button>
    </form>
  )
}

export default SignUpForm
