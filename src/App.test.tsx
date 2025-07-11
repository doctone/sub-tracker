import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Sub Tracker')).toBeInTheDocument()
  })

  it('renders the app description', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByText('Track your subscriptions by connecting to YNAB')
    ).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
  })

  it('renders the ynab auth component on home route', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('Authenticate with YNAB')).toBeInTheDocument()
  })

  it('renders privacy policy on /policy route', () => {
    render(
      <MemoryRouter initialEntries={['/policy']}>
        <App />
      </MemoryRouter>
    )
    expect(
      screen.getByRole('heading', { name: 'Privacy Policy' })
    ).toBeInTheDocument()
    expect(screen.getByText('Introduction')).toBeInTheDocument()
  })
})
