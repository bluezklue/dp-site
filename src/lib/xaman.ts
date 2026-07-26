export type XamanPayloadResponse = {
  uuid: string
  qr: string
  deeplink: string
}

export type XamanStatusResponse = {
  resolved: boolean
  signed: boolean
  account?: string
  txid?: string
}

// Create a SignIn payload
export async function createSignInPayload(): Promise<XamanPayloadResponse> {
  const res = await fetch('/api/xaman-payload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'signin' }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create Xaman payload')
  }

  return res.json()
}

// Check if the user has signed
export async function getPayloadStatus(uuid: string): Promise<XamanStatusResponse> {
  const res = await fetch(`/api/xaman-payload?uuid=${uuid}`)

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to check payload status')
  }

  return res.json()
}