import { NextRequest } from "next/server"

type RateLimitEntry = {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12

const globalRateLimitStore = globalThis as typeof globalThis & {
  __gmkSignedUrlRateLimit?: Map<string, RateLimitEntry>
}

function getRateLimitStore() {
  if (!globalRateLimitStore.__gmkSignedUrlRateLimit) {
    globalRateLimitStore.__gmkSignedUrlRateLimit = new Map()
  }

  return globalRateLimitStore.__gmkSignedUrlRateLimit
}

function getAllowedOrigins(request: NextRequest) {
  const origins = new Set<string>([request.nextUrl.origin])
  const configuredOrigins =
    process.env.ALLOWED_CHAT_ORIGINS
      ?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []

  for (const origin of configuredOrigins) {
    origins.add(origin)
  }

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000")
    origins.add("http://127.0.0.1:3000")
  }

  return origins
}

function isAllowedOrigin(origin: string, allowedOrigins: Set<string>) {
  if (origin === "null") return false
  return allowedOrigins.has(origin)
}

export function isTrustedRequestOrigin(request: NextRequest) {
  const allowedOrigins = getAllowedOrigins(request)
  const secFetchSite = request.headers.get("sec-fetch-site")

  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site" &&
    secFetchSite !== "none"
  ) {
    return false
  }

  const origin = request.headers.get("origin")
  if (origin) {
    return isAllowedOrigin(origin, allowedOrigins)
  }

  const referer = request.headers.get("referer")
  if (!referer) {
    return process.env.NODE_ENV !== "production"
  }

  try {
    return isAllowedOrigin(new URL(referer).origin, allowedOrigins)
  } catch {
    return false
  }
}

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",")
    if (firstIp) return firstIp.trim()
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown"
}

export function consumeSignedUrlRateLimit(key: string) {
  const now = Date.now()
  const resetAt = now + RATE_LIMIT_WINDOW_MS
  const store = getRateLimitStore()

  for (const [existingKey, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(existingKey)
    }
  }

  const currentEntry = store.get(key)

  if (!currentEntry || currentEntry.resetAt <= now) {
    store.set(key, { count: 1, resetAt })
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt,
    }
  }

  if (currentEntry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: currentEntry.resetAt,
    }
  }

  currentEntry.count += 1
  store.set(key, currentEntry)

  return {
    allowed: true,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - currentEntry.count),
    resetAt: currentEntry.resetAt,
  }
}
