/**
 * Utility functions for working with cookies.
 * Note: HttpOnly cookies cannot be accessed via JavaScript directly.
 * These functions are for setting and deleting cookies that can be accessed.
 */

export const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
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

export function getToken(name = 'token') {
    return getCookie(name);
}
