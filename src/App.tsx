import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import type { SignInValues } from "./components/SignInForm"
import type { SignUpValues } from "./components/SignUpForm"
import "./App.css"

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleSignIn = (_values: SignInValues) => {
    setIsSignedIn(true)
  }

  const handleSignUp = (_values: SignUpValues) => {
    setIsSignedIn(true)
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
  }

  return (
    <div className="app-shell">
      <Header isSignedIn={isSignedIn} />
      <MainContent
        isSignedIn={isSignedIn}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
      />
      <Footer />
    </div>
  )
}

export default App
