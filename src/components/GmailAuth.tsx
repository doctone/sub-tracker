import { useState } from 'react'
import { useGmailAuth } from '../hooks/useGmailAuth'

interface GmailAuthProps {
  onClick?: () => void
}

export function GmailAuth({ onClick }: GmailAuthProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { authenticate } = useGmailAuth()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await authenticate()
      onClick?.()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? 'Authenticating...' : 'Authenticate with Gmail'}
    </button>
  )
}
