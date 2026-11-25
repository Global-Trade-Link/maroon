let csrf = ''
export function setCsrf(value) { csrf = value }
export async function api(url, options = {}) {
  const headers = { ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...options.headers }
  const response = await fetch(url, { ...options, headers, credentials: 'same-origin', body: options.body && !(options.body instanceof FormData) ? JSON.stringify(options.body) : options.body })
  const data = await response.json().catch(() => ({ error: 'Unable to reach the server. Please try again.' }))
  if (!response.ok) { const error = new Error(data.error || 'The request failed.'); error.status = response.status; throw error }
  return data
}
export const freshKey = () => [...crypto.getRandomValues(new Uint8Array(32))].map((n) => n.toString(16).padStart(2, '0')).join('')
