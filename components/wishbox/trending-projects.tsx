"use client"

import type { WishAccount } from "@/types/wish"
import { formatSol } from "@/lib/solana/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Zap, Users } from "lucide-react"

interface TrendingProjectsProps {
  wishes: WishAccount[]
  onWishClick: (wish: WishAccount) => void
}

export function TrendingProjects({ wishes, onWishClick }: TrendingProjectsProps) {
  // Get top 3 by bounty
  const trending = [...wishes]
    .filter((w) => w.status === "Open")
    .sort((a, b) => b.bountyPoolLamports - a.bountyPoolLamports)
    .slice(0, 3)

  if (trending.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-background to-background border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          Trending Wishes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trending.map((wish, index) => (
          <div
            key={wish.id}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onWishClick(wish)}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {wish.title}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {formatSol(wish.bountyPoolLamports)} SOL
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {wish.contributorCount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
