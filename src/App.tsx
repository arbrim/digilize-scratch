import { useState } from "react"
import Footer from "./components/Footer"
import Header from "./components/Header"
import MainContent from "./components/MainContent"
import "./App.css"

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  return (
    <div className="app-shell">
      <Header isSignedIn={isSignedIn} />
      <MainContent isSignedIn={isSignedIn} onToggleAuth={() => setIsSignedIn((value) => !value)} />
      <Footer />
    </div>
  )
}

export default App
