import { useState, useEffect } from 'react'
import {
  parseTokenFromUrl,
  clearTokenFromUrl,
  isTokenValid,
} from '../utils/auth'
import type { YnabTokenInfo } from '../utils/auth'

export function useYnabAuth() {
  const [tokenInfo, setTokenInfo] = useState<YnabTokenInfo | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for token in URL fragment
    const urlToken = parseTokenFromUrl()
    if (urlToken) {
      setTokenInfo(urlToken)
      setIsAuthenticated(isTokenValid(urlToken))
      clearTokenFromUrl()
      return
    }

    // Check for existing token in sessionStorage
    const storedToken = sessionStorage.getItem('ynab_token')
    if (storedToken) {
      try {
        const parsed = JSON.parse(storedToken) as YnabTokenInfo
        if (isTokenValid(parsed)) {
          setTokenInfo(parsed)
          setIsAuthenticated(true)
        } else {
          sessionStorage.removeItem('ynab_token')
        }
      } catch {
        sessionStorage.removeItem('ynab_token')
      }
    }
  }, [])

  useEffect(() => {
    if (tokenInfo && isTokenValid(tokenInfo)) {
      sessionStorage.setItem('ynab_token', JSON.stringify(tokenInfo))
    }
  }, [tokenInfo])

  const logout = () => {
    setTokenInfo(null)
    setIsAuthenticated(false)
    sessionStorage.removeItem('ynab_token')
  }

  return {
    tokenInfo,
    isAuthenticated,
    accessToken: tokenInfo?.accessToken || null,
    logout,
  }
}
