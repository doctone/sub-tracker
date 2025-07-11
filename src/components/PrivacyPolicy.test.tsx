import { render, screen } from '@testing-library/react'
import { PrivacyPolicy } from './PrivacyPolicy'

describe('PrivacyPolicy', () => {
  it('renders privacy policy title', () => {
    render(<PrivacyPolicy />)
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('contains required OAuth sections', () => {
    render(<PrivacyPolicy />)

    expect(screen.getByText('Third-Party Data Sharing')).toBeInTheDocument()
    expect(screen.getByText('OAuth Permissions')).toBeInTheDocument()
    expect(screen.getByText('Your Rights and Data Control')).toBeInTheDocument()
  })

  it('includes data deletion contact information', () => {
    render(<PrivacyPolicy />)

    expect(screen.getByText('privacy@sub-tracker.app')).toBeInTheDocument()
  })

  it('mentions YNAB API compliance', () => {
    render(<PrivacyPolicy />)

    expect(screen.getByText(/YNAB API Terms of Service/)).toBeInTheDocument()
  })

  it('guarantees no third-party sharing', () => {
    render(<PrivacyPolicy />)

    expect(
      screen.getByText(
        /We guarantee that data obtained through YNAB API will not be shared with any third parties/
      )
    ).toBeInTheDocument()
  })
})
