import styles from './YnabAuth.module.css'

export function YnabAuth() {
  const clientId = import.meta.env.VITE_YNAB_CLIENT_ID
  const redirectUri =
    import.meta.env.VITE_YNAB_REDIRECT_URI || window.location.origin

  return (
    <a
      className={styles.ynabAuthButton}
      href={`https://app.ynab.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token`}
    >
      Authenticate with YNAB{' '}
    </a>
  )
}
