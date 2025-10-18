import type { FC } from "react"
import { brand } from "../config/brand"

const Footer: FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <small>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</small>
        <span className="footer-copy">{brand.tagline}</span>
      </div>
    </footer>
  )
}

export default Footer
