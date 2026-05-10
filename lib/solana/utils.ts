import { EXPLORER_URL, LAMPORTS_PER_SOL, NETWORK } from "./constants"

/**
 * Format wallet address to short form
 * e.g., "3pQwEr...m4rS"
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return ""
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Format hash to short form
 * e.g., "0x9a21...f03c"
 */
export function formatHash(hash: string, chars = 4): string {
  if (!hash) return ""
  const prefix = hash.startsWith("0x") ? "" : "0x"
  const cleanHash = hash.replace("0x", "")
  if (cleanHash.length <= chars * 2 + 3) return `${prefix}${cleanHash}`
  return `${prefix}${cleanHash.slice(0, chars)}...${cleanHash.slice(-chars)}`
}

/**
 * Convert lamports to SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / LAMPORTS_PER_SOL
}

/**
 * Convert SOL to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL)
}

/**
 * Format SOL amount with specified decimals
 */
export function formatSol(lamports: number, decimals = 2): string {
  return lamportsToSol(lamports).toFixed(decimals)
}

/**
 * Get Solana Explorer URL for address
 */
export function getExplorerAddressUrl(address: string): string {
  return `${EXPLORER_URL}/address/${address}?cluster=${NETWORK}`
}

/**
 * Get Solana Explorer URL for transaction
 */
export function getExplorerTxUrl(signature: string): string {
  return `${EXPLORER_URL}/tx/${signature}?cluster=${NETWORK}`
}

/**
 * Calculate fee and payout amounts
 */
export function calculateSettlement(bountyPoolLamports: number, feeBps: number) {
  const platformFeeLamports = Math.floor((bountyPoolLamports * feeBps) / 10000)
  const builderPayoutLamports = bountyPoolLamports - platformFeeLamports
  return {
    platformFeeLamports,
    builderPayoutLamports,
    platformFeeSol: lamportsToSol(platformFeeLamports),
    builderPayoutSol: lamportsToSol(builderPayoutLamports),
    totalSol: lamportsToSol(bountyPoolLamports),
  }
}
