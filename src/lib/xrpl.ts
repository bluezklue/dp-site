import { Client } from 'xrpl'

// Change this one line to switch networks
const NETWORK = 'mainnet' // 'mainnet' or 'testnet'

const SERVERS = {
  mainnet: 'wss://xrplcluster.com',
  testnet: 'wss://s.altnet.rippletest.net:51233',
}

export const client = new Client(SERVERS[NETWORK])

export async function ensureConnected() {
  if (!client.isConnected()) {
    await client.connect()
  }
  return client
}

export function getNetworkName() {
  return NETWORK
}