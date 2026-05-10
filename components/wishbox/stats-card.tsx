"use client"

import type { WishAccount } from "@/types/wish"
import { formatSol } from "@/lib/solana/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, CheckCircle, Users, Clock } from "lucide-react"

interface StatsCardProps {
  wishes: WishAccount[]
}

export function StatsCard({ wishes }: StatsCardProps) {
  const totalBounty = wishes.reduce((sum, w) => sum + w.bountyPoolLamports, 0)
  const completedWishes = wishes.filter((w) => w.status === "Settled").length
  const totalContributors = wishes.reduce((sum, w) => sum + w.contributorCount, 0)
  const openWishes = wishes.filter((w) => w.status === "Open").length

  const stats = [
    {
      label: "Total Bounty",
      value: `${formatSol(totalBounty)} SOL`,
      icon: Zap,
      color: "text-primary",
    },
    {
      label: "Completed",
      value: completedWishes.toString(),
      icon: CheckCircle,
      color: "text-emerald-400",
    },
    {
      label: "Contributors",
      value: totalContributors.toString(),
      icon: Users,
      color: "text-amber-400",
    },
    {
      label: "Open Wishes",
      value: openWishes.toString(),
      icon: Clock,
      color: "text-blue-400",
    },
  ]

  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon className={`mx-auto h-5 w-5 ${stat.color} mb-1`} />
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
