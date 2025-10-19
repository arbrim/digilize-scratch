import type { FC } from "react"
import { NavLink } from "react-router-dom"
import { brand } from "../config/brand"

const memberNav = [
  { to: "/", label: "Ballina" },
  { to: "/clients", label: "Klientet" },
  { to: "/fatura", label: "Faturat" },
  { to: "/users", label: "Perdoruesit" },
]

type HeaderProps = {
  isSignedIn: boolean
  onSignOut: () => void
}

const Header: FC<HeaderProps> = ({ isSignedIn, onSignOut }) => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src={brand.logoSrc} alt={`${brand.name} logo`} className="brand-logo" />
          <span className="brand-name">{brand.name}</span>
        </div>
        <nav className="primary-nav" aria-label="Navigimi kryesor">
          {isSignedIn ? (
            <>
              {memberNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? "secondary-link nav-link-active" : "secondary-link"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button type="button" className="secondary-link sign-out-link" onClick={onSignOut}>
                Dil
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={({ isActive }) =>
                isActive ? "secondary-link nav-link-active" : "secondary-link"
              }>
                Hyr
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) =>
                isActive ? "primary-link nav-link-active" : "primary-link"
              }>
                Regjistrohu
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
