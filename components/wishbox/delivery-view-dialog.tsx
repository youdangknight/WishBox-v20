"use client"

import type { WishAccount } from "@/types/wish"
import { formatHash, formatSol, calculateSettlement } from "@/lib/solana/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Eye,
  Link,
  GitBranch,
  TestTube,
  FileText,
  CheckCircle2,
  ExternalLink,
  Hash,
  Wallet,
  Building2,
} from "lucide-react"

interface DeliveryViewDialogProps {
  wish: WishAccount | null
  open: boolean
  onClose: () => void
}

export function DeliveryViewDialog({ wish, open, onClose }: DeliveryViewDialogProps) {
  if (!wish || !wish.delivery) return null

  const isSettled = wish.status === "Settled"
  const settlement = calculateSettlement(wish.bountyPoolLamports, wish.platformFeeBps)

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            {isSettled ? "Settlement Details" : "Delivery Details"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            View the delivery proof and settlement details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4 py-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  isSettled
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-blue-500/30 text-blue-400"
                }
              >
                {isSettled ? "Settled" : "Submitted"}
              </Badge>
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

            {/* Delivery Hash */}
            {wish.deliveryHash && (
              <div className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Hash className="h-4 w-4" />
                  delivery_hash
                </div>
                <code className="text-sm text-foreground break-all">
                  {formatHash(wish.deliveryHash, 12)}
                </code>
              </div>
            )}

            {/* Settlement Info (if settled) */}
            {isSettled && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                <h4 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Settlement Complete
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Wallet className="h-4 w-4 mx-auto text-emerald-400 mb-1" />
                    <p className="text-lg font-bold text-emerald-400">
                      {formatSol(wish.builderPayoutLamports || 0)} SOL
                    </p>
                    <p className="text-xs text-muted-foreground">Builder Payout</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50">
                    <Building2 className="h-4 w-4 mx-auto text-amber-400 mb-1" />
                    <p className="text-lg font-bold text-amber-400">
                      {formatSol(wish.platformFeeLamports || 0)} SOL
                    </p>
                    <p className="text-xs text-muted-foreground">Protocol Fee</p>
                  </div>
                </div>
              </div>
            )}

            {/* Demo URL */}
            {wish.delivery.demoUrl && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Link className="h-4 w-4" />
                  Demo URL
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => window.open(wish.delivery?.demoUrl, "_blank")}
                >
                  <span className="truncate">{wish.delivery.demoUrl}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </Button>
              </div>
            )}

            {/* GitHub PR */}
            {wish.delivery.githubPr && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4" />
                  GitHub PR / Commit
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => window.open(wish.delivery?.githubPr, "_blank")}
                >
                  <span className="truncate">{wish.delivery.githubPr}</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </Button>
              </div>
            )}

            {/* Test Result */}
            {wish.delivery.testResult && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TestTube className="h-4 w-4" />
                  Test Result
                </div>
                <p className="text-sm text-foreground rounded-lg bg-muted/50 p-2">
                  {wish.delivery.testResult}
                </p>
              </div>
            )}

            {/* Delivery Note */}
            {wish.delivery.deliveryNote && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Delivery Note
                </div>
                <p className="text-sm text-foreground rounded-lg bg-muted/50 p-2">
                  {wish.delivery.deliveryNote}
                </p>
              </div>
            )}

            {/* Acceptance Checklist */}
            {wish.prd && wish.delivery.acceptanceChecklist && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Acceptance Checklist
                </div>
                <div className="space-y-1.5 rounded-lg border border-border p-3">
                  {wish.prd.acceptanceCriteria.map((criterion, index) => {
                    const isChecked = wish.delivery?.acceptanceChecklist[index]
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-border"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            isChecked ? "text-emerald-400" : "text-muted-foreground"
                          }`}
                        >
                          {criterion}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Submitted At */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
              Submitted {new Date(wish.delivery.submittedAt).toLocaleString()}
              {wish.settledAt && (
                <>
                  {" "}
                  • Settled {new Date(wish.settledAt).toLocaleString()}
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
