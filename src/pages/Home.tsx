import { useEffect, useState } from 'react'
import { ensureConnected, client, getNetworkName } from '../lib/xrpl'
import { createSignInPayload, getPayloadStatus } from '../lib/xaman'

export default function Home() {
  const [status, setStatus] = useState('Connecting...')
  const [ledgerIndex, setLedgerIndex] = useState<number | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const network = getNetworkName()

  // Connect to XRPL on load
  useEffect(() => {
    async function connect() {
      try {
        await ensureConnected()
        setStatus(`Connected to XRPL ${network.toUpperCase()}`)

        const response = await client.request({
          command: 'ledger',
          ledger_index: 'validated',
        })
        setLedgerIndex(response.result.ledger_index)
      } catch (err) {
        console.error(err)
        setStatus('Failed to connect to XRPL')
      }
    }
    connect()
  }, [])

  // Connect with Xaman
  async function handleConnectXaman() {
    setConnecting(true)
    setQr(null)

    try {
      const payload = await createSignInPayload()
      setQr(payload.qr)

      // Poll every 2 seconds until the user signs or rejects
      const interval = setInterval(async () => {
        try {
          const status = await getPayloadStatus(payload.uuid)

          if (status.resolved) {
            clearInterval(interval)
            setConnecting(false)

            if (status.signed && status.account) {
              setAccount(status.account)
              setQr(null)
            } else {
              alert('Sign-in was rejected or expired')
              setQr(null)
            }
          }
        } catch (err) {
          console.error(err)
        }
      }, 2000)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Could not start Xaman connection')
      setConnecting(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Home</h1>
      <p className="mb-6">Welcome to the DP site.</p>

      {/* XRPL Status */}
      <div className="mb-6 p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400 mb-1">XRPL Status</p>
        <p className="text-lg">{status}</p>
        {ledgerIndex && (
          <p className="mt-2 text-green-400">Latest ledger: {ledgerIndex}</p>
        )}
      </div>

      {/* Wallet Connection */}
      <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
        <p className="text-sm text-gray-400 mb-3">Wallet</p>

        {account ? (
          <div>
            <p className="text-green-400 font-mono text-sm break-all">{account}</p>
            <button
              onClick={() => setAccount(null)}
              className="mt-3 text-sm text-gray-400 hover:text-white"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={handleConnectXaman}
              disabled={connecting}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 rounded-lg font-medium"
            >
              {connecting ? 'Waiting for Xaman...' : 'Connect with Xaman'}
            </button>

            {qr && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Scan with Xaman:</p>
                <img src={qr} alt="Xaman QR" className="w-48 h-48 bg-white p-2 rounded" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}