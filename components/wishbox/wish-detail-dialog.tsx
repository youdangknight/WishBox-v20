"use client"

import { useState } from "react"
import type { WishAccount } from "@/types/wish"
import type { TransactionStatus } from "@/lib/solana/program"
import { useWallet } from "@solana/wallet-adapter-react"
import { formatAddress, formatSol } from "@/lib/solana/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Zap, ExternalLink } from "lucide-react"

import { ChainProgress } from "./chain-progress"
import { OnChainPool } from "./on-chain-pool"
import { SettlementPreview } from "./settlement-preview"
import { RequirementBrief } from "./requirement-brief"
import { AcceptanceCriteria } from "./acceptance-criteria"
import { ActionPanel } from "./action-panel"
import { BuilderSummary } from "./builder-summary"
import { TransactionStatusDisplay } from "./transaction-status"
import { AddBountyDialog } from "./add-bounty-dialog"
import { SubmitDeliveryDialog } from "./submit-delivery-dialog"
import { DeliveryViewDialog } from "./delivery-view-dialog"
import { addBounty, acceptWish, settleWish } from "@/lib/solana/program"

interface WishDetailDialogProps {
  wish: WishAccount | null
  onClose: () => void
  onRefresh: () => void
}

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Accepted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Settled: "bg-primary/20 text-primary border-primary/30",
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function WishDetailDialog({ wish, onClose, onRefresh }: WishDetailDialogProps) {
  const { publicKey } = useWallet()
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle")
  const [txSignature, setTxSignature] = useState<string>()
  const [txError, setTxError] = useState<string>()
  const [showAddBounty, setShowAddBounty] = useState(false)
  const [showSubmitDelivery, setShowSubmitDelivery] = useState(false)
  const [showDeliveryView, setShowDeliveryView] = useState(false)

  if (!wish) return null

  const handleAcceptWish = async () => {
    if (!publicKey) return
    setTxStatus("signing")
    const result = await acceptWish(wish.id, publicKey.toBase58(), setTxStatus)
    if (result.success) {
      setTxSignature(result.signature)
      onRefresh()
    } else {
      setTxError(result.error)
    }
  }

  const handleSettleWish = async () => {
    if (!publicKey) return
    setTxStatus("signing")
    const result = await settleWish(wish.id, publicKey.toBase58(), setTxStatus)
    if (result.success) {
      setTxSignature(result.signature)
      onRefresh()
    } else {
      setTxError(result.error)
    }
  }

  const handleTxClose = () => {
    setTxStatus("idle")
    setTxSignature(undefined)
    setTxError(undefined)
  }

  return (
    <>
      <Dialog open={!!wish} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="outline" className={statusColors[wish.status]}>
                    {wish.status}
                  </Badge>
                  <Badge variant="secondary">{wish.category}</Badge>
                  <Badge
                    variant="outline"
                    className={
                      wish.confirmationMode === "SelfConfirm"
                        ? "border-emerald-500/30 text-emerald-400"
                        : "border-amber-500/30 text-amber-400"
                    }
                  >
                    {wish.confirmationMode === "SelfConfirm" ? "10% fee" : "30% fee"}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {wish.title}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  View details and take actions on this wish
                </DialogDescription>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1.5 text-primary text-xl font-bold">
                  <Zap className="h-5 w-5" />
                  {formatSol(wish.bountyPoolLamports)} SOL
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {wish.contributorCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimeAgo(wish.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[calc(90vh-180px)]">
            <div className="p-6">
              {/* Description */}
              <p className="text-muted-foreground mb-6">{wish.description}</p>

              {/* Chain Progress */}
              <div className="mb-6">
                <ChainProgress status={wish.status} />
              </div>

              {/* Tabs */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="onchain">On-chain</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  {/* Settlement Preview */}
                  <SettlementPreview wish={wish} />

                  {/* PRD */}
                  {wish.prd && <RequirementBrief prd={wish.prd} />}

                  {/* Acceptance Criteria */}
                  {wish.prd && (
                    <AcceptanceCriteria
                      prd={wish.prd}
                      checklist={wish.delivery?.acceptanceChecklist}
                    />
                  )}
                </TabsContent>

                <TabsContent value="onchain" className="space-y-4">
                  {/* On-chain Pool Info */}
                  <OnChainPool wish={wish} />

                  {/* Builder Summary */}
                  {wish.builder && (wish.status === "Accepted" || wish.status === "Submitted" || wish.status === "Settled") && (
                    <BuilderSummary
                      builderWallet={wish.builder}
                      onViewProfile={() => {
                        // TODO: Navigate to builder profile
                      }}
                    />
                  )}

                  {/* Creator Info */}
                  <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Creator</h4>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">
                        {formatAddress(wish.creator, 6)}
                      </code>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground cursor-pointer hover:text-primary" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <ActionPanel
                    wish={wish}
                    onAddBounty={() => setShowAddBounty(true)}
                    onAcceptWish={handleAcceptWish}
                    onSubmitDelivery={() => setShowSubmitDelivery(true)}
                    onViewDelivery={() => setShowDeliveryView(true)}
                    onSettleWish={handleSettleWish}
                    onViewBuilderProfile={() => {
                      // TODO: Navigate to builder profile
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Add Bounty Dialog */}
      <AddBountyDialog
        wish={wish}
        open={showAddBounty}
        onClose={() => setShowAddBounty(false)}
        onSuccess={() => {
          setShowAddBounty(false)
          onRefresh()
        }}
      />

      {/* Submit Delivery Dialog */}
      <SubmitDeliveryDialog
        wish={wish}
        open={showSubmitDelivery}
        onClose={() => setShowSubmitDelivery(false)}
        onSuccess={() => {
          setShowSubmitDelivery(false)
          onRefresh()
        }}
      />

      {/* Delivery View Dialog */}
      <DeliveryViewDialog
        wish={wish}
        open={showDeliveryView}
        onClose={() => setShowDeliveryView(false)}
      />

      {/* Transaction Status Overlay */}
      <TransactionStatusDisplay
        status={txStatus}
        signature={txSignature}
        error={txError}
        onClose={handleTxClose}
      />
    </>
  )
}
