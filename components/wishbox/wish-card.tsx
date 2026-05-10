"use client"

import type { WishAccount } from "@/types/wish"
import { formatSol, formatAddress } from "@/lib/solana/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface WishCardProps {
  wish: WishAccount
  onClick?: () => void
}

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Accepted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Settled: "bg-primary/20 text-primary border-primary/30",
}

const categoryColors: Record<string, string> = {
  "AI Agent": "bg-violet-500/10 text-violet-400",
  Security: "bg-red-500/10 text-red-400",
  DeFi: "bg-emerald-500/10 text-emerald-400",
  Development: "bg-blue-500/10 text-blue-400",
  Design: "bg-pink-500/10 text-pink-400",
  Content: "bg-amber-500/10 text-amber-400",
  Translation: "bg-cyan-500/10 text-cyan-400",
  Other: "bg-gray-500/10 text-gray-400",
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

export function WishCard({ wish, onClick }: WishCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("border", statusColors[wish.status])}>
              {wish.status}
            </Badge>
            <Badge variant="secondary" className={categoryColors[wish.category]}>
              {wish.category}
            </Badge>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border font-mono text-sm",
              wish.confirmationMode === "SelfConfirm"
                ? "border-emerald-500/30 text-emerald-400"
                : "border-amber-500/30 text-amber-400"
            )}
          >
            {wish.confirmationMode === "SelfConfirm" ? "10%" : "30%"}
          </Badge>
        </div>
        <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {wish.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">{wish.description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{wish.contributorCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{formatTimeAgo(wish.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-primary font-semibold">
          <Zap className="h-4 w-4" />
          <span>{formatSol(wish.bountyPoolLamports)} SOL</span>
        </div>
      </CardFooter>
    </Card>
  )
}
