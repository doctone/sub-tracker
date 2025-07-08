import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('Sub Tracker')).toBeInTheDocument()
  })

  it('renders the app description', () => {
    render(<App />)
    expect(
      screen.getByText('Track your subscriptions by analyzing your emails')
    ).toBeInTheDocument()
  })

  it('renders the skeleton placeholder', () => {
    render(<App />)
    expect(screen.getByText('Find my subscriptions')).toBeInTheDocument()
  })
})
