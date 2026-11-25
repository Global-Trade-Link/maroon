export function adminRedirectUrl(href) {
  const url = new URL(href)
  if (!/^\/admin(?:\/|$)/.test(url.pathname)) return null
  if (!url.hostname.startsWith('admin.')) {
    const loopback = url.hostname === 'localhost' || url.hostname === '[::1]' || /^127\./.test(url.hostname)
    url.hostname = loopback ? 'admin.localhost' : `admin.${url.hostname.replace(/^www\./, '')}`
  }
  url.pathname = url.pathname.replace(/^\/admin/, '') || '/'
  return url.href
}
