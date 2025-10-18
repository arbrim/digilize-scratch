import type { FC } from "react"

type MainContentProps = {
  isSignedIn: boolean
  onToggleAuth: () => void
}

const MainContent: FC<MainContentProps> = ({ isSignedIn, onToggleAuth }) => {
  return (
    <main className="app-main">
      <div className="container main-inner">
        <h1 className="headline">Welcome to Galani</h1>
        <p className="subcopy">
          Toggle the button below to simulate the authenticated and guest experiences. The header will
          adapt to show the correct navigation for each state across desktop and mobile breakpoints.
        </p>
        <button type="button" className="auth-toggle" onClick={onToggleAuth}>
          {isSignedIn ? "Sign out" : "Sign in"}
        </button>
      </div>
    </main>
  )
}

export default MainContent
