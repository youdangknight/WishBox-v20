"use client"

import type { WishAccount, ConfirmationMode, WishStatus, DeliveryData, PRD } from "@/types/wish"
import { mockWishes } from "@/lib/mock-data"
import { SELF_CONFIRM_FEE_BPS, PLATFORM_CONFIRM_FEE_BPS, LAMPORTS_PER_SOL } from "./constants"
import { generateSpecHash, generateDeliveryHash } from "@/lib/hash"

// Simulated transaction delay
const TX_DELAY = 1500

// In-memory state for mock
let wishes = [...mockWishes]

export type TransactionStatus =
  | "idle"
  | "signing"
  | "submitted"
  | "confirming"
  | "success"
  | "error"

export interface TransactionResult {
  success: boolean
  signature?: string
  error?: string
}

/**
 * Simulate transaction execution with status updates
 */
async function simulateTransaction(
  onStatusChange?: (status: TransactionStatus) => void
): Promise<string> {
  onStatusChange?.("signing")
  await new Promise((r) => setTimeout(r, TX_DELAY / 3))

  onStatusChange?.("submitted")
  await new Promise((r) => setTimeout(r, TX_DELAY / 3))

  onStatusChange?.("confirming")
  await new Promise((r) => setTimeout(r, TX_DELAY / 3))

  // Generate mock transaction signature
  const signature = `mock_tx_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  return signature
}

/**
 * Get all wishes
 */
export function getAllWishes(): WishAccount[] {
  return [...wishes]
}

/**
 * Get a single wish by ID
 */
export function getWishById(id: string): WishAccount | undefined {
  return wishes.find((w) => w.id === id)
}

/**
 * Create a new Wish
 */
export async function createWish(
  creatorWallet: string,
  title: string,
  description: string,
  category: WishAccount["category"],
  confirmationMode: ConfirmationMode,
  prd: PRD,
  initialBountyLamports: number,
  onStatusChange?: (status: TransactionStatus) => void
): Promise<TransactionResult> {
  try {
    const signature = await simulateTransaction(onStatusChange)

    const titleHash = await generateSpecHash({ title })
    const specHash = await generateSpecHash(prd)

    const newWish: WishAccount = {
      id: `wish_${Date.now()}`,
      creator: creatorWallet,
      title,
      description,
      titleHash,
      specHash,
      bountyPoolLamports: initialBountyLamports,
      contributorCount: initialBountyLamports > 0 ? 1 : 0,
      status: "Open",
      confirmationMode,
      platformFeeBps: confirmationMode === "SelfConfirm" ? SELF_CONFIRM_FEE_BPS : PLATFORM_CONFIRM_FEE_BPS,
      category,
      createdAt: Date.now(),
      prd,
    }

    wishes = [newWish, ...wishes]
    onStatusChange?.("success")

    return { success: true, signature }
  } catch (error) {
    onStatusChange?.("error")
    return { success: false, error: String(error) }
  }
}

/**
 * Add bounty to an existing Wish
 */
export async function addBounty(
  wishId: string,
  contributorWallet: string,
  amountLamports: number,
  onStatusChange?: (status: TransactionStatus) => void
): Promise<TransactionResult> {
  try {
    const wish = wishes.find((w) => w.id === wishId)
    if (!wish) {
      throw new Error("Wish not found")
    }

    if (wish.status !== "Open" && wish.status !== "Accepted") {
      throw new Error("Cannot add bounty to this Wish")
    }

    if (amountLamports <= 0) {
      throw new Error("Amount must be greater than 0")
    }

    const signature = await simulateTransaction(onStatusChange)

    // Update wish
    wishes = wishes.map((w) =>
      w.id === wishId
        ? {
            ...w,
            bountyPoolLamports: w.bountyPoolLamports + amountLamports,
            contributorCount: w.contributorCount + 1,
          }
        : w
    )

    onStatusChange?.("success")
    return { success: true, signature }
  } catch (error) {
    onStatusChange?.("error")
    return { success: false, error: String(error) }
  }
}

/**
 * Accept a Wish (become the builder)
 */
export async function acceptWish(
  wishId: string,
  builderWallet: string,
  onStatusChange?: (status: TransactionStatus) => void
): Promise<TransactionResult> {
  try {
    const wish = wishes.find((w) => w.id === wishId)
    if (!wish) {
      throw new Error("Wish not found")
    }

    if (wish.status !== "Open") {
      throw new Error("Wish is not open for acceptance")
    }

    if (wish.builder) {
      throw new Error("Wish already has a builder")
    }

    const signature = await simulateTransaction(onStatusChange)

    // Update wish
    wishes = wishes.map((w) =>
      w.id === wishId
        ? {
            ...w,
            builder: builderWallet,
            status: "Accepted" as WishStatus,
            acceptedAt: Date.now(),
          }
        : w
    )

    onStatusChange?.("success")
    return { success: true, signature }
  } catch (error) {
    onStatusChange?.("error")
    return { success: false, error: String(error) }
  }
}

/**
 * Submit delivery proof
 */
export async function submitDelivery(
  wishId: string,
  builderWallet: string,
  deliveryData: Omit<DeliveryData, "submittedAt">,
  onStatusChange?: (status: TransactionStatus) => void
): Promise<TransactionResult> {
  try {
    const wish = wishes.find((w) => w.id === wishId)
    if (!wish) {
      throw new Error("Wish not found")
    }

    if (wish.status !== "Accepted") {
      throw new Error("Wish is not in Accepted status")
    }

    if (wish.builder !== builderWallet) {
      throw new Error("Only the builder can submit delivery")
    }

    const signature = await simulateTransaction(onStatusChange)

    const submittedAt = Date.now()
    const deliveryHash = await generateDeliveryHash({
      wishId,
      builderWallet,
      demoUrl: deliveryData.demoUrl,
      githubPr: deliveryData.githubPr,
      testResult: deliveryData.testResult,
      deliveryNote: deliveryData.deliveryNote,
      acceptanceChecklist: deliveryData.acceptanceChecklist,
      submittedAt,
    })

    // Update wish
    wishes = wishes.map((w) =>
      w.id === wishId
        ? {
            ...w,
            status: "Submitted" as WishStatus,
            submittedAt,
            deliveryHash,
            delivery: {
              ...deliveryData,
              submittedAt,
            },
          }
        : w
    )

    onStatusChange?.("success")
    return { success: true, signature }
  } catch (error) {
    onStatusChange?.("error")
    return { success: false, error: String(error) }
  }
}

/**
 * Settle a Wish (confirm and pay out)
 */
export async function settleWish(
  wishId: string,
  confirmerWallet: string,
  onStatusChange?: (status: TransactionStatus) => void
): Promise<TransactionResult> {
  try {
    const wish = wishes.find((w) => w.id === wishId)
    if (!wish) {
      throw new Error("Wish not found")
    }

    if (wish.status !== "Submitted") {
      throw new Error("Wish is not in Submitted status")
    }

    if (!wish.builder) {
      throw new Error("Wish has no builder")
    }

    if (wish.bountyPoolLamports <= 0) {
      throw new Error("No bounty to settle")
    }

    const signature = await simulateTransaction(onStatusChange)

    // Calculate settlement amounts
    const platformFeeLamports = Math.floor(
      (wish.bountyPoolLamports * wish.platformFeeBps) / 10000
    )
    const builderPayoutLamports = wish.bountyPoolLamports - platformFeeLamports

    // Update wish
    wishes = wishes.map((w) =>
      w.id === wishId
        ? {
            ...w,
            status: "Settled" as WishStatus,
            settledAt: Date.now(),
            builderPayoutLamports,
            platformFeeLamports,
          }
        : w
    )

    onStatusChange?.("success")
    return { success: true, signature }
  } catch (error) {
    onStatusChange?.("error")
    return { success: false, error: String(error) }
  }
}

/**
 * Reset mock data (for testing)
 */
export function resetMockData() {
  wishes = [...mockWishes]
}
