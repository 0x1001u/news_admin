/**
 * Utility functions for working with cookies.
 * Note: HttpOnly cookies cannot be accessed via JavaScript directly.
 * These functions are for setting and deleting cookies that can be accessed.
 */

console.log('[Cookie] Domain:', import.meta.env.VITE_COOKIE_DOMAIN || window.location.hostname);
export const setCookie = (name, value, days) => {
    const maxAge = days * 24 * 60 * 60;
    const domain = import.meta.env.VITE_COOKIE_DOMAIN || window.location.hostname;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; domain=${domain}; Secure; SameSite=Lax`;
};

export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const deleteCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const setToken = (token, days = 7) => {
    setCookie('token', token, days);
};

export function getToken(name = 'token') {
    const token = getCookie(name);
    console.log('[Cookie] getToken result:', token);
    return token;
}

export function validateToken(token) {
  if (!token || token.length < 10) {
    console.error('[Cookie] Invalid token detected');
    return false;
  }
  return true;
}

