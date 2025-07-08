export function useGmailAuth() {
  const authenticate = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = window.location.origin
    const scope = 'https://www.googleapis.com/auth/gmail.readonly'

    const authUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}`

    window.open(authUrl, 'gmail-auth', 'width=500,height=600')
  }

  return { authenticate }
}
