import type { FC, MouseEvent } from "react"
import { brand } from "../config/brand"
import type { AppView } from "../types/navigation"

type HeaderProps = {
  isSignedIn: boolean
  activeView?: AppView
  onNavigate?: (view: AppView) => void
}

type GuestLink = {
  href: string
  label: string
  isPrimary?: boolean
}

type MemberLink = {
  view: AppView
  label: string
}

const guestLinks: GuestLink[] = [
  { href: "#login", label: "Login" },
  { href: "#signup", label: "Sign Up", isPrimary: true },
]

const memberLinks: MemberLink[] = [
  { view: "home", label: "Home" },
  { view: "fatura", label: "Fatura" },
  { view: "clients", label: "Clients" },
  { view: "users", label: "Users" },
]

const Header: FC<HeaderProps> = ({ isSignedIn, activeView = "home", onNavigate }) => {
  const handleMemberLinkClick = (event: MouseEvent<HTMLAnchorElement>, view: AppView) => {
    event.preventDefault()
    onNavigate?.(view)
  }

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src={brand.logoSrc} alt={`${brand.name} logo`} className="brand-logo" />
          <span className="brand-name">{brand.name}</span>
        </div>
        <nav className="primary-nav" aria-label="Primary">
          {isSignedIn
            ? memberLinks.map(({ view, label }) => {
                const isActive = activeView === view
                return (
                  <a
                    key={view}
                    href={`#view-${view}`}
                    className={isActive ? "secondary-link nav-link-active" : "secondary-link"}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(event) => handleMemberLinkClick(event, view)}
                  >
                    {label}
                  </a>
                )
              })
            : guestLinks.map(({ href, label, isPrimary }) => (
                <a key={href} href={href} className={isPrimary ? "primary-link" : "secondary-link"}>
                  {label}
                </a>
              ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
