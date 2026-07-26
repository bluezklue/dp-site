const XAMAN_API_BASE = 'https://xumm.app/api/v1/platform/payload'

function xamanHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.XAMAN_API_KEY,
    'X-API-Secret': process.env.XAMAN_API_SECRET,
  }
}

export default async function handler(req, res) {
  if (!process.env.XAMAN_API_KEY || !process.env.XAMAN_API_SECRET) {
    return res.status(500).json({
      error: 'Xaman API credentials are not configured. Set XAMAN_API_KEY and XAMAN_API_SECRET.',
    })
  }

  if (req.method === 'POST') {
    const { type, txjson } = req.body
    const payload = type === 'signin' ? { txjson: { TransactionType: 'SignIn' } } : { txjson }

    const xamanRes = await fetch(XAMAN_API_BASE, {
      method: 'POST',
      headers: xamanHeaders(),
      body: JSON.stringify(payload),
    })
    const data = await xamanRes.json()

    if (!xamanRes.ok) {
      return res.status(xamanRes.status).json({ error: data.message || 'Xaman request failed' })
    }

    return res.status(200).json({
      uuid: data.uuid,
      qr: data.refs?.qr_png,
      deeplink: data.next?.always,
    })
  }

  if (req.method === 'GET') {
    const { uuid } = req.query
    if (!uuid) return res.status(400).json({ error: 'Missing uuid' })

    const xamanRes = await fetch(`${XAMAN_API_BASE}/${uuid}`, { headers: xamanHeaders() })
    const data = await xamanRes.json()

    if (!xamanRes.ok) {
      return res.status(xamanRes.status).json({ error: data.message || 'Could not fetch payload status' })
    }

    return res.status(200).json({
      resolved: !!data.meta?.resolved,
      signed: !!data.meta?.signed,
      account: data.response?.account,
      txid: data.response?.txid,
    })
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end('Method Not Allowed')
}