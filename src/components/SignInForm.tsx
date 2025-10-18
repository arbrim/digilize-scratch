import type { FC, FormEvent } from "react"

export type SignInValues = {
  username: string
  password: string
}

type SignInFormProps = {
  onSubmit: (values: SignInValues) => void
}

const SignInForm: FC<SignInFormProps> = ({ onSubmit }) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries()) as Record<string, FormDataEntryValue>

    onSubmit({
      username: String(values.username ?? ""),
      password: String(values.password ?? ""),
    })
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input id="username" name="username" type="text" placeholder="Enter username" required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter password" required />
      </div>
      <button type="submit" className="primary-action">
        Sign in
      </button>
    </form>
  )
}

export default SignInForm
