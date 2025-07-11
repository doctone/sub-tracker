export interface YnabTokenInfo {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number;
}

export function parseTokenFromUrl(): YnabTokenInfo | null {
  const fragment = window.location.hash.substring(1);
  if (!fragment) return null;

  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  const tokenType = params.get('token_type');
  const expiresIn = params.get('expires_in');

  if (!accessToken || !tokenType || !expiresIn) return null;

  return {
    accessToken,
    tokenType,
    expiresIn: parseInt(expiresIn, 10),
    expiresAt: Date.now() + parseInt(expiresIn, 10) * 1000,
  };
}

export function clearTokenFromUrl(): void {
  window.history.replaceState({}, document.title, window.location.pathname);
}

export function isTokenValid(tokenInfo: YnabTokenInfo): boolean {
  return Date.now() < tokenInfo.expiresAt;
}