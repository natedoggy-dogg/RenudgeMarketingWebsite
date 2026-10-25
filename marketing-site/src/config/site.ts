// Site-wide constants. The product name is provisional: change it here.

export const SITE_NAME = 'renudge.it';
export const SITE_URL = 'https://www.renudge.it';
export const SITE_LANG = 'en-US';

export const APP_URL = 'https://app.renudge.it';
// [Unverified] The dashboard's sign-up route. Check it against dashboard-app
// before launch (brief, Phase 1 "Signup links").
export const SIGN_UP_URL = `${APP_URL}/sign-up`;

export function signUpUrl(libraryTemplateId?: string): string {
  return libraryTemplateId ? `${SIGN_UP_URL}?template=${encodeURIComponent(libraryTemplateId)}` : SIGN_UP_URL;
}
