export const BOJ_DOMAIN = 'www.acmicpc.net';
export const SOLVED_AC_DOMAIN = 'solved.ac';

export const PRODUCTION_DOMAIN = 'boj-ide.junghyunbak.site';
export const LOCALHOST_DOMAIN = 'localhost:3000';
export const FETCH_DOMAIN =
  process.env.NODE_ENV === 'production' ? `https://${PRODUCTION_DOMAIN}` : `http://${LOCALHOST_DOMAIN}`;
