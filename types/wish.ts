export type WishStatus = "Open" | "Accepted" | "Submitted" | "Settled"

export type ConfirmationMode = "SelfConfirm" | "PlatformConfirm"

export interface PRD {
  goal: string
  userScenario: string
  scope: string[]
  outOfScope: string[]
  deliverables: string[]
  acceptanceCriteria: string[]
  recommendedPath?: string
}

export interface DeliveryData {
  demoUrl?: string
  githubPr?: string
  testResult?: string
  deliveryNote?: string
  acceptanceChecklist: boolean[]
  submittedAt: number
}

export interface WishAccount {
  id: string
  creator: string
  builder?: string
  title: string
  description: string
  titleHash: string
  specHash: string
  deliveryHash?: string
  bountyPoolLamports: number
  contributorCount: number
  status: WishStatus
  confirmationMode: ConfirmationMode
  platformFeeBps: number
  category: WishCategory
  createdAt: number
  acceptedAt?: number
  submittedAt?: number
  settledAt?: number
  builderPayoutLamports?: number
  platformFeeLamports?: number
  // Frontend extended fields
  prd?: PRD
  delivery?: DeliveryData
}

export type WishCategory = 
  | "AI Agent" 
  | "Security" 
  | "DeFi" 
  | "Development" 
  | "Design" 
  | "Content" 
  | "Translation" 
  | "Other"

export interface Contributor {
  wallet: string
  amount: number
  timestamp: number
}

export type SortOption = "bounty" | "recent" | "hot"
