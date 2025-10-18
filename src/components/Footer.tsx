import type { FC } from "react"

const Footer: FC = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <small>&copy; {new Date().getFullYear()} Galani. All rights reserved.</small>
        <span className="footer-copy">Built for a polished desktop and mobile experience.</span>
      </div>
    </footer>
  )
}

export default Footer
