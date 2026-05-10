"use client"

import type { WishAccount, WishCategory, SortOption } from "@/types/wish"
import { WishCard } from "./wish-card"

// Top 3 hot wishes - always appear first (based on real competitor data)
const HOT_WISH_IDS = ["wish_001", "wish_002", "wish_003"]

interface WishListProps {
  wishes: WishAccount[]
  selectedCategory: WishCategory | "All"
  sortOption: SortOption
  onWishClick: (wish: WishAccount) => void
  excludeHotWishes?: boolean
}

export function WishList({
  wishes,
  selectedCategory,
  sortOption,
  onWishClick,
  excludeHotWishes = false,
}: WishListProps) {
  // Filter by category and optionally exclude hot wishes
  let filteredWishes = selectedCategory === "All"
    ? wishes
    : wishes.filter((w) => w.category === selectedCategory)
  
  // Exclude hot wishes if requested (they are shown in HotWishes section)
  if (excludeHotWishes) {
    filteredWishes = filteredWishes.filter((w) => !HOT_WISH_IDS.includes(w.id))
  }

  // Sort wishes
  const sortedWishes = [...filteredWishes].sort((a, b) => {
    switch (sortOption) {
      case "bounty":
        return b.bountyPoolLamports - a.bountyPoolLamports
      case "recent":
        return b.createdAt - a.createdAt
      case "hot":
        // Hot = combination of bounty and recency
        const aScore = a.bountyPoolLamports / 1e9 + (Date.now() - a.createdAt) / -86400000
        const bScore = b.bountyPoolLamports / 1e9 + (Date.now() - b.createdAt) / -86400000
        return bScore - aScore
      default:
        return 0
    }
  })

  if (sortedWishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No wishes found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {selectedCategory === "All"
            ? "Be the first to post a wish!"
            : `No ${selectedCategory.toLowerCase()} wishes yet.`}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sortedWishes.map((wish) => (
        <WishCard key={wish.id} wish={wish} onClick={() => onWishClick(wish)} />
      ))}
    </div>
  )
}
