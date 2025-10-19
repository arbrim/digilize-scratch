export type AuthUser = {
  username: string
  email?: string
}

export type AuthSession = {
  token: string
  expiresAt: string
  user: AuthUser
}

const TOKEN_COOKIE_NAME = "galani_auth_token"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30 // 30 days
const DEFAULT_API_BASE_URL = "http://localhost:3000"

type BufferLike = {
  from: (input: string, encoding: string) => { toString: (encoding: string) => string }
}

type JwtPayload = {
  sub?: string
  email?: string
  exp?: number
  [key: string]: unknown
}

type SignResponse = {
  token: string
  user?: {
    username?: string
    email?: string
  }
}

const getNodeBuffer = (): BufferLike | null => {
  if (typeof globalThis === "undefined") {
    return null
  }

  const candidate = (globalThis as { Buffer?: BufferLike }).Buffer
  if (candidate && typeof candidate.from === "function") {
    return candidate
  }

  return null
}

const encodeBase64Url = (value: string): string => {
  const nodeBuffer = getNodeBuffer()

  const base64 = nodeBuffer
    ? nodeBuffer.from(value, "utf8").toString("base64")
    : window
        .btoa(
          encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_match, hex) =>
            String.fromCharCode(Number.parseInt(hex, 16)),
          ),
        )

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

const decodeBase64Url = (value: string): string => {
  const nodeBuffer = getNodeBuffer()
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4))
  const base64 = normalized + padding

  if (nodeBuffer) {
    return nodeBuffer.from(base64, "base64").toString("utf8")
  }

  if (typeof window === "undefined" || typeof window.atob !== "function") {
    return ""
  }

  const binary = window.atob(base64)
  let result = ""
  for (let index = 0; index < binary.length; index += 1) {
    const hex = binary.charCodeAt(index).toString(16).padStart(2, "0")
    result += `%${hex}`
  }

  try {
    return decodeURIComponent(result)
  } catch {
    return ""
  }
}

const createFakeJwt = (user: AuthUser, expiresAt: Date): string => {
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  const payload = {
    sub: user.username,
    email: user.email ?? undefined,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000),
  }

  const encodedHeader = encodeBase64Url(JSON.stringify(header))
  const encodedPayload = encodeBase64Url(JSON.stringify(payload))
  const signature = encodeBase64Url("mock-signature")

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

const simulateNetworkDelay = async () => {
  const min = 320
  const max = 820
  const timeout = Math.floor(Math.random() * (max - min + 1)) + min

  await new Promise((resolve) => setTimeout(resolve, timeout))
}

const buildSession = (user: AuthUser): AuthSession => {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  return {
    user,
    expiresAt: expiresAt.toISOString(),
    token: createFakeJwt(user, expiresAt),
  }
}

const setCookie = (token: string, expiresAt: Date) => {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Lax`
}

const readCookie = (): string | null => {
  if (typeof document === "undefined") {
    return null
  }

  const entries = document.cookie ? document.cookie.split("; ") : []
  for (const entry of entries) {
    const [name, ...rest] = entry.split("=")
    if (name === TOKEN_COOKIE_NAME) {
      return decodeURIComponent(rest.join("=") ?? "")
    }
  }

  return null
}

const deleteCookie = () => {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

const sessionFromToken = (token: string, fallbackUser?: AuthUser): AuthSession => {
  const segments = token.split(".")
  const payloadSegment = segments.length >= 2 ? segments[1] : ""
  let payload: JwtPayload | null = null

  try {
    payload = JSON.parse(decodeBase64Url(payloadSegment)) as JwtPayload
  } catch {
    payload = null
  }

  const usernameCandidate = payload?.sub
  const emailCandidate = payload?.email
  const expCandidate = typeof payload?.exp === "number" ? payload.exp : null

  const username =
    typeof usernameCandidate === "string" && usernameCandidate.length > 0
      ? usernameCandidate
      : fallbackUser?.username ?? "user"

  const expiresAt = expCandidate
    ? new Date(expCandidate * 1000)
    : new Date(Date.now() + SESSION_DURATION_MS)

  const user: AuthUser = {
    username,
    ...(typeof emailCandidate === "string" && emailCandidate.length > 0 ? { email: emailCandidate } : {}),
  }

  return {
    token,
    user,
    expiresAt: expiresAt.toISOString(),
  }
}

const postJson = async <TResponse>(path: string, body: unknown): Promise<TResponse> => {
  if (typeof fetch !== "function") {
    throw new Error("Fetch is not available in this environment.")
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_API_BASE_URL
  const endpoint = `${baseUrl}${path}`

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as TResponse
}

export const signInRequest = async (values: { username: string; password: string }): Promise<AuthSession> => {
  await simulateNetworkDelay()

  if (!values.username || !values.password) {
    throw new Error("Please provide both username and password.")
  }

  if (values.password.length < 4) {
    throw new Error("Password is too short.")
  }

  try {
    const data = await postJson<SignResponse>("/signin", values)
    if (!data?.token) {
      throw new Error("Sign-in response did not include a token.")
    }

    const session = sessionFromToken(data.token, {
      username: values.username,
      email: data.user?.email,
    })
    persistSession(session)
    return session
  } catch (error) {
    console.warn("Falling back to simulated sign-in", error)
  }

  const session = buildSession({ username: values.username })
  persistSession(session)
  return session
}

export const signUpRequest = async (values: { username: string; email: string; password: string }): Promise<AuthSession> => {
  await simulateNetworkDelay()

  if (!values.username || !values.email || !values.password) {
    throw new Error("Please fill out all fields.")
  }

  if (!values.email.includes("@")) {
    throw new Error("Enter a valid email address.")
  }

  if (values.password.length < 6) {
    throw new Error("Choose a stronger password (6+ characters).")
  }

  try {
    const data = await postJson<SignResponse>("/signup", values)
    if (!data?.token) {
      throw new Error("Sign-up response did not include a token.")
    }

    const session = sessionFromToken(data.token, {
      username: values.username,
      email: values.email,
    })
    persistSession(session)
    return session
  } catch (error) {
    console.warn("Falling back to simulated sign-up", error)
  }

  const session = buildSession({ username: values.username, email: values.email })
  persistSession(session)
  return session
}

export const loadSession = (): AuthSession | null => {
  const token = readCookie()
  if (!token) {
    return null
  }

  const session = sessionFromToken(token)
  if (!isSessionValid(session)) {
    clearSession()
    return null
  }

  return session
}

export const persistSession = (session: AuthSession) => {
  const expiresAt = new Date(session.expiresAt)
  setCookie(session.token, expiresAt)
}

export const clearSession = () => {
  deleteCookie()
}

export const isSessionValid = (session: AuthSession | null): session is AuthSession => {
  if (!session) {
    return false
  }

  return new Date(session.expiresAt).getTime() > Date.now()
}
