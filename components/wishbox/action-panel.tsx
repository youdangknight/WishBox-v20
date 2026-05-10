"use client"

import type { WishAccount } from "@/types/wish"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Zap, UserPlus, Send, Eye, CheckCircle, User } from "lucide-react"

interface ActionPanelProps {
  wish: WishAccount
  onAddBounty: () => void
  onAcceptWish: () => void
  onSubmitDelivery: () => void
  onViewDelivery: () => void
  onSettleWish: () => void
  onViewBuilderProfile: () => void
}

export function ActionPanel({
  wish,
  onAddBounty,
  onAcceptWish,
  onSubmitDelivery,
  onViewDelivery,
  onSettleWish,
  onViewBuilderProfile,
}: ActionPanelProps) {
  const { connected, publicKey } = useWallet()
  const isBuilder = publicKey?.toBase58() === wish.builder

  if (!connected) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-3">
            Connect your wallet to add bounty, accept this Wish, or submit delivery proof.
          </p>
          <WalletMultiButton className="!bg-primary !text-primary-foreground hover:!bg-primary/90 !rounded-lg !h-10 !px-6 !text-sm !font-medium mx-auto" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="text-sm font-medium text-foreground mb-3">Actions</h4>
      <div className="space-y-2">
        {wish.status === "Open" && (
          <>
            <Button onClick={onAddBounty} className="w-full gap-2">
              <Zap className="h-4 w-4" />
              Add Bounty
            </Button>
            <Button
              onClick={onAcceptWish}
              variant="secondary"
              className="w-full gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Accept Wish
            </Button>
          </>
        )}

        {wish.status === "Accepted" && (
          <>
            <Button onClick={onAddBounty} className="w-full gap-2">
              <Zap className="h-4 w-4" />
              Add Bounty
            </Button>
            {isBuilder && (
              <Button
                onClick={onSubmitDelivery}
                variant="secondary"
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Delivery
              </Button>
            )}
          </>
        )}

        {wish.status === "Submitted" && (
          <>
            <Button
              onClick={onViewDelivery}
              variant="outline"
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              View Delivery
            </Button>
            <Button onClick={onSettleWish} className="w-full gap-2">
              <CheckCircle className="h-4 w-4" />
              Confirm & Settle
            </Button>
          </>
        )}

        {wish.status === "Settled" && (
          <>
            <Button
              onClick={onViewDelivery}
              variant="outline"
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              View Settlement
            </Button>
            {wish.builder && (
              <Button
                onClick={onViewBuilderProfile}
                variant="secondary"
                className="w-full gap-2"
              >
                <User className="h-4 w-4" />
                View Builder Profile
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
