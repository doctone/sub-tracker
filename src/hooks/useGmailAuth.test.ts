import { describe, it, expect, vi } from 'vitest'
import { useGmailAuth } from './useGmailAuth'
import { renderHook } from '@testing-library/react'

describe('useGmailAuth', () => {
  it('returns authenticate function', () => {
    const { result } = renderHook(() => useGmailAuth())
    
    expect(result.current.authenticate).toBeDefined()
    expect(typeof result.current.authenticate).toBe('function')
  })

  it('opens OAuth popup window when authenticate is called', async () => {
    const mockOpen = vi.fn()
    Object.defineProperty(window, 'open', { value: mockOpen })
    
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client-id')
    
    const { result } = renderHook(() => useGmailAuth())
    
    await result.current.authenticate()
    
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('accounts.google.com'),
      'gmail-auth',
      expect.any(String)
    )
  })
})