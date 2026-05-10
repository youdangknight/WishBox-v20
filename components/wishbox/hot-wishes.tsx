"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WishAccount } from "@/types/wish"
import { lamportsToSol } from "@/lib/solana/utils"
import { Flame, Users, ArrowRight, Zap, Shield, Bot, Coins } from "lucide-react"
import { cn } from "@/lib/utils"

// Top 3 hot wishes IDs
const HOT_WISH_IDS = ["wish_001", "wish_002", "wish_003"]

interface HotWishesProps {
  wishes: WishAccount[]
  onWishClick: (wish: WishAccount) => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  "AI Agent": <Bot className="h-5 w-5" />,
  Security: <Shield className="h-5 w-5" />,
  DeFi: <Coins className="h-5 w-5" />,
}

const categoryGradients: Record<string, string> = {
  "AI Agent": "from-violet-500/20 via-purple-500/10 to-transparent",
  Security: "from-red-500/20 via-orange-500/10 to-transparent",
  DeFi: "from-emerald-500/20 via-green-500/10 to-transparent",
}

const categoryBorders: Record<string, string> = {
  "AI Agent": "border-violet-500/30 hover:border-violet-500/50",
  Security: "border-red-500/30 hover:border-red-500/50",
  DeFi: "border-emerald-500/30 hover:border-emerald-500/50",
}

const rankBadges = [
  { label: "#1", gradient: "from-yellow-400 to-orange-500" },
  { label: "#2", gradient: "from-gray-300 to-gray-400" },
  { label: "#3", gradient: "from-amber-600 to-amber-700" },
]

export function HotWishes({ wishes, onWishClick }: HotWishesProps) {
  const hotWishes = HOT_WISH_IDS
    .map((id) => wishes.find((w) => w.id === id))
    .filter((w): w is WishAccount => w !== undefined)

  if (hotWishes.length === 0) return null

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Trending Bounties
            <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
              TOP 3
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground">
            Highest demand across Superteam Earn, Immunefi, and DoraHacks
          </p>
        </div>
      </div>

      {/* Hot Wishes Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {hotWishes.map((wish, index) => (
          <Card
            key={wish.id}
            className={cn(
              "group relative overflow-hidden cursor-pointer transition-all duration-300",
              "hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1",
              categoryBorders[wish.category] || "border-border"
            )}
            onClick={() => onWishClick(wish)}
          >
            {/* Background gradient */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-50",
                categoryGradients[wish.category] || "from-primary/10 to-transparent"
              )}
            />

            {/* Rank badge */}
            <div
              className={cn(
                "absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full",
                "bg-gradient-to-br text-white font-bold text-sm shadow-lg",
                rankBadges[index]?.gradient || "from-gray-500 to-gray-600"
              )}
            >
              {rankBadges[index]?.label || `#${index + 1}`}
            </div>

            <CardHeader className="relative pb-2">
              {/* Category + Status */}
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "gap-1.5",
                    wish.category === "AI Agent" && "bg-violet-500/10 text-violet-400",
                    wish.category === "Security" && "bg-red-500/10 text-red-400",
                    wish.category === "DeFi" && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {categoryIcons[wish.category]}
                  {wish.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    wish.status === "Open" && "border-green-500/50 text-green-400",
                    wish.status === "Accepted" && "border-blue-500/50 text-blue-400",
                    wish.status === "Submitted" && "border-amber-500/50 text-amber-400"
                  )}
                >
                  {wish.status}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors pr-10">
                {wish.title}
              </h3>
            </CardHeader>

            <CardContent className="relative pt-0">
              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {wish.description}
              </p>

              {/* Stats Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Bounty */}
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-bold text-foreground">
                      {lamportsToSol(wish.bountyPoolLamports).toFixed(1)} SOL
                    </span>
                  </div>
                  {/* Contributors */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">{wish.contributorCount}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-primary hover:text-primary-foreground hover:bg-primary group-hover:bg-primary/10"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>

              {/* Fee indicator */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {wish.confirmationMode === "PlatformConfirm" ? "Platform Review" : "Self Confirm"}
                  </span>
                  <span className="font-medium text-muted-foreground">
                    {wish.platformFeeBps / 100}% fee
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
