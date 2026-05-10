import { clusterApiUrl } from "@solana/web3.js"

// Mock Program ID - replace with real program ID after deployment
export const PROGRAM_ID = "WishBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

// Platform Treasury - receives protocol fees
export const PLATFORM_TREASURY = "Treasury11111111111111111111111111111111111"

// Network configuration
export const NETWORK = "devnet"
export const RPC_ENDPOINT = clusterApiUrl("devnet")

// Explorer URL
export const EXPLORER_URL = "https://explorer.solana.com"

// Fee basis points
export const SELF_CONFIRM_FEE_BPS = 1000 // 10%
export const PLATFORM_CONFIRM_FEE_BPS = 3000 // 30%

// LAMPORTS per SOL
export const LAMPORTS_PER_SOL = 1_000_000_000
