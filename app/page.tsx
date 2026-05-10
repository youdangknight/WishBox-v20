"use client"

import { useState, useEffect } from "react"
import type { WishAccount, WishCategory, SortOption } from "@/types/wish"
import { getAllWishes } from "@/lib/solana/program"
import { Header } from "@/components/wishbox/header"
import { WishFilters } from "@/components/wishbox/wish-filters"
import { WishList } from "@/components/wishbox/wish-list"
import { HotWishes } from "@/components/wishbox/hot-wishes"
import { StatsCard } from "@/components/wishbox/stats-card"
import { TrendingProjects } from "@/components/wishbox/trending-projects"
import { WishDetailDialog } from "@/components/wishbox/wish-detail-dialog"
import { PostWishDialog } from "@/components/wishbox/post-wish-dialog"

export default function Home() {
  const [wishes, setWishes] = useState<WishAccount[]>([])
  const [selectedCategory, setSelectedCategory] = useState<WishCategory | "All">("All")
  const [sortOption, setSortOption] = useState<SortOption>("bounty")
  const [selectedWish, setSelectedWish] = useState<WishAccount | null>(null)
  const [showPostWish, setShowPostWish] = useState(false)

  // Load wishes
  useEffect(() => {
    setWishes(getAllWishes())
  }, [])

  // Refresh wishes after any action
  const refreshWishes = () => {
    setWishes(getAllWishes())
    if (selectedWish) {
      const updated = getAllWishes().find((w) => w.id === selectedWish.id)
      if (updated) {
        setSelectedWish(updated)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onPostWish={() => setShowPostWish(true)} />

      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="mb-6">
          <StatsCard wishes={wishes} />
        </div>

        {/* Hot Wishes - Featured Section */}
        <HotWishes wishes={wishes} onWishClick={setSelectedWish} />

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Wishes section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">All Wishes</h2>
              <p className="text-sm text-muted-foreground">
                Browse all available bounties and find your next project
              </p>
            </div>

            <WishFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />

            <WishList
              wishes={wishes}
              selectedCategory={selectedCategory}
              sortOption={sortOption}
              onWishClick={setSelectedWish}
              excludeHotWishes={true}
            />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <TrendingProjects wishes={wishes} onWishClick={setSelectedWish} />

            {/* How it works */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-semibold text-foreground mb-3">How It Works</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    1
                  </span>
                  <span>Post a wish or add bounty to existing ones</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    2
                  </span>
                  <span>Builders accept and deliver proof on-chain</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    3
                  </span>
                  <span>Settle with 10% or 30% platform fee</span>
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </main>

      {/* Wish Detail Dialog */}
      <WishDetailDialog
        wish={selectedWish}
        onClose={() => setSelectedWish(null)}
        onRefresh={refreshWishes}
      />

      {/* Post Wish Dialog */}
      <PostWishDialog
        open={showPostWish}
        onClose={() => setShowPostWish(false)}
        onSuccess={refreshWishes}
      />
    </div>
  )
}
