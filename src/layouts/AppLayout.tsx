import type { FC } from "react"
import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"

export type AppLayoutProps = {
  isSignedIn: boolean
  onSignOut: () => void
}

const AppLayout: FC<AppLayoutProps> = ({ isSignedIn, onSignOut }) => {
  return (
    <div className="app-shell">
      <Header isSignedIn={isSignedIn} onSignOut={onSignOut} />
      <main className="app-main">
        <div className="container main-inner">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AppLayout

