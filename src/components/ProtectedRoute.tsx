import type { FC, ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

type ProtectedRouteProps = {
  isSignedIn: boolean
  children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ isSignedIn, children }) => {
  const location = useLocation()

  if (!isSignedIn) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export default ProtectedRoute
