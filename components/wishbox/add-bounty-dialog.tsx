"use client"

import { useState } from "react"
import type { WishAccount } from "@/types/wish"
import type { TransactionStatus } from "@/lib/solana/program"
import { useWallet } from "@solana/wallet-adapter-react"
import { solToLamports, formatSol } from "@/lib/solana/utils"
import { addBounty } from "@/lib/solana/program"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TransactionStatusDisplay } from "./transaction-status"
import { Zap, AlertCircle } from "lucide-react"

interface AddBountyDialogProps {
  wish: WishAccount | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddBountyDialog({ wish, open, onClose, onSuccess }: AddBountyDialogProps) {
  const { publicKey } = useWallet()
  const [amount, setAmount] = useState("")
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle")
  const [txSignature, setTxSignature] = useState<string>()
  const [txError, setTxError] = useState<string>()

  if (!wish) return null

  const amountNumber = parseFloat(amount) || 0
  const isValidAmount = amountNumber > 0 && amountNumber <= 100

  const handleSubmit = async () => {
    if (!publicKey || !isValidAmount) return

    setTxStatus("signing")
    const lamports = solToLamports(amountNumber)
    const result = await addBounty(wish.id, publicKey.toBase58(), lamports, setTxStatus)

    if (result.success) {
      setTxSignature(result.signature)
    } else {
      setTxError(result.error)
    }
  }

  const handleTxClose = () => {
    if (txStatus === "success") {
      setAmount("")
      onSuccess()
    }
    setTxStatus("idle")
    setTxSignature(undefined)
    setTxError(undefined)
  }

  const handleClose = () => {
    setAmount("")
    onClose()
  }

  const newTotal = wish.bountyPoolLamports + solToLamports(amountNumber)

  return (
    <>
      <Dialog open={open && txStatus === "idle"} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Add Bounty
            </DialogTitle>
            <DialogDescription>
              Add SOL to the bounty pool for &quot;{wish.title}&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Current Pool */}
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Pool</span>
                <span className="font-semibold text-primary">
                  {formatSol(wish.bountyPoolLamports)} SOL
                </span>
              </div>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.5"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.1"
                  min="0.01"
                  max="100"
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  SOL
                </span>
              </div>
              {amount && !isValidAmount && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Please enter a valid amount (0.01 - 100 SOL)
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="flex gap-2">
              {[0.5, 1, 2, 5].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setAmount(val.toString())}
                >
                  {val} SOL
                </Button>
              ))}
            </div>

            {/* New Total Preview */}
            {isValidAmount && (
              <div className="rounded-lg border border-primary/30 bg-primary/10 p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">New Total</span>
                  <span className="font-semibold text-primary">
                    {formatSol(newTotal)} SOL
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!isValidAmount} className="gap-2">
              <Zap className="h-4 w-4" />
              Add {isValidAmount ? `${amountNumber} SOL` : "Bounty"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TransactionStatusDisplay
        status={txStatus}
        signature={txSignature}
        error={txError}
        onClose={handleTxClose}
      />
    </>
  )
}
