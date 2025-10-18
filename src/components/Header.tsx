import type { FC } from "react"
import logo from "/vite.svg"

type HeaderProps = {
  isSignedIn: boolean
}

type NavLink = {
  href: string
  label: string
  isPrimary?: boolean
}

const guestLinks: NavLink[] = [
  { href: "#login", label: "Login" },
  { href: "#signup", label: "Sign Up", isPrimary: true },
]

const memberLinks: NavLink[] = [
  { href: "#home", label: "Home" },
  { href: "#xyz", label: "Xyz" },
  { href: "#zxy", label: "Zxy" },
]

const logoPath = "/galani.jpg";

const Header: FC<HeaderProps> = ({ isSignedIn }) => {
  const links = isSignedIn ? memberLinks : guestLinks

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src={logoPath} alt="Galani logo" className="brand-logo" />
          <span className="brand-name">Galani</span>
        </div>
        <nav className="primary-nav" aria-label="Primary">
          {links.map(({ href, label, isPrimary }) => (
            <a
              key={href}
              href={href}
              className={isPrimary ? "primary-link" : "secondary-link"}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
