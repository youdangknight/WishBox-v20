"use client"

import { cn } from "@/lib/utils"
import type { WishCategory, SortOption } from "@/types/wish"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bot, Shield, Coins, Code, Palette, Languages, FileText, LayoutGrid, ArrowDownUp } from "lucide-react"

interface WishFiltersProps {
  selectedCategory: WishCategory | "All"
  onCategoryChange: (category: WishCategory | "All") => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
}

const categories: { value: WishCategory | "All"; label: string; icon: React.ReactNode }[] = [
  { value: "All", label: "All", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "AI Agent", label: "AI Agent", icon: <Bot className="h-4 w-4" /> },
  { value: "Security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  { value: "DeFi", label: "DeFi", icon: <Coins className="h-4 w-4" /> },
  { value: "Development", label: "Dev", icon: <Code className="h-4 w-4" /> },
  { value: "Design", label: "Design", icon: <Palette className="h-4 w-4" /> },
  { value: "Content", label: "Content", icon: <FileText className="h-4 w-4" /> },
  { value: "Translation", label: "i18n", icon: <Languages className="h-4 w-4" /> },
  { value: "Other", label: "Other", icon: <LayoutGrid className="h-4 w-4" /> },
]

export function WishFilters({
  selectedCategory,
  onCategoryChange,
  sortOption,
  onSortChange,
}: WishFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className={cn(
              "gap-1.5",
              selectedCategory === category.value && "bg-primary text-primary-foreground"
            )}
          >
            {category.icon}
            <span className="hidden sm:inline">{category.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
        <Select value={sortOption} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bounty">Bounty</SelectItem>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="hot">Hot</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
