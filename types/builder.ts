import type { ConfirmationMode } from "./wish"

export interface BuilderProfile {
  wallet: string
  completedWishes: number
  totalEarned: number
  selfConfirmedCount: number
  platformConfirmedCount: number
}

export interface BuilderDelivery {
  wishId: string
  wishTitle: string
  reward: number
  confirmationMode: ConfirmationMode
  deliveryHash: string
  specHash: string
  settlementTx?: string
  demoUrl?: string
  githubPr?: string
  settledAt: number
}
