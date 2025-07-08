import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GmailAuth } from './GmailAuth'

describe('GmailAuth', () => {
  it('renders authenticate button', () => {
    render(<GmailAuth />)
    expect(screen.getByText('Authenticate with Gmail')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', async () => {
    const mockOnClick = vi.fn()
    render(<GmailAuth onClick={mockOnClick} />)

    fireEvent.click(screen.getByText('Authenticate with Gmail'))

    await vi.waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledOnce()
    })
  })

  it('shows loading state when authenticating', () => {
    render(<GmailAuth />)

    fireEvent.click(screen.getByText('Authenticate with Gmail'))

    expect(screen.getByText('Authenticating...')).toBeInTheDocument()
  })
})
