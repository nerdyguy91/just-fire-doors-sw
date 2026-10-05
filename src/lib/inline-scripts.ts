/**
 * The only inline script on the site. It runs in <head> before first paint so CSS can style the
 * JS and no-JS states without a flash or layout shift. Its SHA-256 hash is allowed in the CSP
 * script-src (public/_headers, step 11): if this string changes, the hash must be updated.
 */
export const noJsSwap = "document.documentElement.classList.replace('no-js','js')";
