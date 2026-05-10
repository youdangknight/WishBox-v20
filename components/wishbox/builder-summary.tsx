"use client"

import { formatAddress, formatSol } from "@/lib/solana/utils"
import { getBuilderStats } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, Zap, Shield, ExternalLink } from "lucide-react"

interface BuilderSummaryProps {
  builderWallet: string
  onViewProfile?: () => void
}

export function BuilderSummary({ builderWallet, onViewProfile }: BuilderSummaryProps) {
  const stats = getBuilderStats(builderWallet)

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Builder
        </h4>
        <Badge variant="outline" className="text-xs">
          <code>{formatAddress(builderWallet, 4)}</code>
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="text-center p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
            <CheckCircle className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-bold text-foreground">{stats.completedWishes}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>

        <div className="text-center p-2 rounded-lg bg-muted/50">
          <div className="flex items-center justify-center gap-1 text-primary mb-1">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <p className="text-lg font-bold text-foreground">{formatSol(stats.totalEarned)}</p>
          <p className="text-xs text-muted-foreground">Earned SOL</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-emerald-400" />
          Self: {stats.selfConfirmedCount}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-amber-400" />
          Platform: {stats.platformConfirmedCount}
        </span>
      </div>

      {onViewProfile && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={onViewProfile}
        >
          View Builder Profile
          <ExternalLink className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
