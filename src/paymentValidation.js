export function validatePaymentDetails(reference, file) {
  const errors = {}
  const value = String(reference || '').trim()
  const hasScreenshot = !!file?.size
  if (value.length > 160) errors.reference = 'Keep the transaction reference under 160 characters.'
  else if (value.length < 3 && !hasScreenshot) {
    errors.reference = value
      ? 'Enter at least 3 characters for the transaction reference, or upload a payment screenshot below.'
      : 'Enter the transaction reference from your banking app, or upload a payment screenshot below.'
  }
  if (hasScreenshot && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) errors.proof = 'Choose a JPEG, PNG or WebP screenshot.'
  else if (file?.size > 5 * 1024 * 1024) errors.proof = 'This screenshot is too large. Choose an image under 5 MB.'
  return errors
}
