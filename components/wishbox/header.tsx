"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Box, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onPostWish?: () => void
}

export function Header({ onPostWish }: HeaderProps) {
  const { connected } = useWallet()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Box className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">WishBox</span>
          <span className="hidden rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
            Devnet
          </span>
        </div>

        <div className="flex items-center gap-3">
          {connected && (
            <Button onClick={onPostWish} className="gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Post Wish</span>
            </Button>
          )}
          <WalletMultiButton className="!bg-secondary !text-secondary-foreground hover:!bg-secondary/80 !rounded-lg !h-10 !px-4 !text-sm !font-medium" />
        </div>
      </div>
    </header>
  )
}
