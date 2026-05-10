"use client"

import type { WishAccount } from "@/types/wish"
import { calculateSettlement, formatSol } from "@/lib/solana/utils"
import { Badge } from "@/components/ui/badge"
import { Zap, ArrowRight, Wallet, Building2 } from "lucide-react"

interface SettlementPreviewProps {
  wish: WishAccount
}

export function SettlementPreview({ wish }: SettlementPreviewProps) {
  const settlement = calculateSettlement(wish.bountyPoolLamports, wish.platformFeeBps)
  const feePercent = wish.platformFeeBps / 100

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-foreground">Settlement Preview</h4>
        <Badge
          variant="outline"
          className={
            wish.confirmationMode === "SelfConfirm"
              ? "border-emerald-500/30 text-emerald-400"
              : "border-amber-500/30 text-amber-400"
          }
        >
          {wish.confirmationMode === "SelfConfirm" ? "Self Confirm" : "Platform Confirm"} · {feePercent}% fee
        </Badge>
      </div>

      <div className="space-y-3">
        {/* Current Pool */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>Bounty Pool</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {settlement.totalSol.toFixed(2)} SOL
          </span>
        </div>

        {/* Distribution */}
        <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
          <span className="text-sm">Distribution</span>
          <ArrowRight className="h-4 w-4" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Builder Payout */}
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Wallet className="h-4 w-4" />
              <span className="text-xs font-medium">Builder Receives</span>
            </div>
            <p className="text-lg font-bold text-emerald-400">
              {settlement.builderPayoutSol.toFixed(2)} SOL
            </p>
            <p className="text-xs text-emerald-400/70">{100 - feePercent}% of pool</p>
          </div>

          {/* Platform Fee */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium">Protocol Fee</span>
            </div>
            <p className="text-lg font-bold text-amber-400">
              {settlement.platformFeeSol.toFixed(2)} SOL
            </p>
            <p className="text-xs text-amber-400/70">{feePercent}% of pool</p>
          </div>
        </div>
      </div>
    </div>
  )
}
