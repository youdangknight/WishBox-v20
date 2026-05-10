/**
 * Generate SHA-256 hash from string
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  return hashHex
}

/**
 * Generate canonical JSON string for hashing
 */
export function canonicalJson(obj: object): string {
  return JSON.stringify(obj, Object.keys(obj).sort())
}

/**
 * Generate spec_hash from PRD data
 */
export async function generateSpecHash(prd: object): Promise<string> {
  const canonical = canonicalJson(prd)
  return sha256(canonical)
}

/**
 * Generate delivery_hash from delivery data
 */
export async function generateDeliveryHash(deliveryData: {
  wishId: string
  builderWallet: string
  demoUrl?: string
  githubPr?: string
  testResult?: string
  deliveryNote?: string
  acceptanceChecklist: boolean[]
  submittedAt: number
}): Promise<string> {
  const canonical = canonicalJson(deliveryData)
  return sha256(canonical)
}
