"use client"

import { useState } from "react"
import type { WishCategory, ConfirmationMode, PRD } from "@/types/wish"
import type { TransactionStatus } from "@/lib/solana/program"
import { useWallet } from "@solana/wallet-adapter-react"
import { solToLamports } from "@/lib/solana/utils"
import { createWish } from "@/lib/solana/program"
import { generatePRD } from "@/lib/prd-generator"
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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { TransactionStatusDisplay } from "./transaction-status"
import {
  Sparkles,
  Wand2,
  Zap,
  Shield,
  ChevronRight,
  ChevronLeft,
  Target,
  CheckSquare,
  Package,
} from "lucide-react"

interface PostWishDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const categories: { value: WishCategory; label: string }[] = [
  { value: "Development", label: "Development" },
  { value: "Design", label: "Design" },
  { value: "Translation", label: "Translation" },
  { value: "Writing", label: "Writing" },
  { value: "Other", label: "Other" },
]

export function PostWishDialog({ open, onClose, onSuccess }: PostWishDialogProps) {
  const { publicKey } = useWallet()
  const [step, setStep] = useState(1)
  const [wishDescription, setWishDescription] = useState("")
  const [category, setCategory] = useState<WishCategory>("Development")
  const [generatedPRD, setGeneratedPRD] = useState<PRD | null>(null)
  const [title, setTitle] = useState("")
  const [confirmationMode, setConfirmationMode] = useState<ConfirmationMode>("SelfConfirm")
  const [initialBounty, setInitialBounty] = useState("")
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle")
  const [txSignature, setTxSignature] = useState<string>()
  const [txError, setTxError] = useState<string>()

  const handleGeneratePRD = () => {
    const result = generatePRD(wishDescription)
    setGeneratedPRD(result.prd)
    setTitle(result.title)
    setConfirmationMode(result.recommendedMode)
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!publicKey || !generatedPRD) return

    setTxStatus("signing")
    const bountyLamports = solToLamports(parseFloat(initialBounty) || 0)

    const result = await createWish(
      publicKey.toBase58(),
      title,
      wishDescription,
      category,
      confirmationMode,
      generatedPRD,
      bountyLamports,
      setTxStatus
    )

    if (result.success) {
      setTxSignature(result.signature)
    } else {
      setTxError(result.error)
    }
  }

  const handleTxClose = () => {
    if (txStatus === "success") {
      resetForm()
      onSuccess()
      onClose()
    }
    setTxStatus("idle")
    setTxSignature(undefined)
    setTxError(undefined)
  }

  const resetForm = () => {
    setStep(1)
    setWishDescription("")
    setCategory("Development")
    setGeneratedPRD(null)
    setTitle("")
    setConfirmationMode("SelfConfirm")
    setInitialBounty("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const bountyNumber = parseFloat(initialBounty) || 0
  const isValidBounty = bountyNumber >= 0 && bountyNumber <= 100

  return (
    <>
      <Dialog open={open && txStatus === "idle"} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Post a Wish
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Describe your wish and we'll generate a PRD for you"
                : "Review and customize your wish before posting"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            {step === 1 && (
              <div className="space-y-4 py-4">
                {/* Wish Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">What do you wish for?</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Build a Solana token launchpad with customizable parameters..."
                    value={wishDescription}
                    onChange={(e) => setWishDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={category}
                    onValueChange={(v) => setCategory(v as WishCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && generatedPRD && (
              <div className="space-y-4 py-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Wish title"
                  />
                </div>

                {/* Generated PRD Preview */}
                <div className="rounded-lg border border-border p-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Wand2 className="h-4 w-4" />
                    Generated PRD
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-3.5 w-3.5 text-primary" />
                      <span className="font-medium">Goal:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-5">{generatedPRD.goal}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-medium">Acceptance Criteria:</span>
                    </div>
                    <ul className="space-y-1 pl-5">
                      {generatedPRD.acceptanceCriteria.slice(0, 3).map((c, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {c}
                        </li>
                      ))}
                      {generatedPRD.acceptanceCriteria.length > 3 && (
                        <li className="text-sm text-muted-foreground/50">
                          +{generatedPRD.acceptanceCriteria.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-3.5 w-3.5 text-amber-400" />
                      <span className="font-medium">Deliverables:</span>
                    </div>
                    <ul className="space-y-1 pl-5">
                      {generatedPRD.deliverables.map((d, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Confirmation Mode */}
                <div className="space-y-3">
                  <Label>Confirmation Mode</Label>
                  <RadioGroup
                    value={confirmationMode}
                    onValueChange={(v) => setConfirmationMode(v as ConfirmationMode)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <Label
                      htmlFor="self"
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                        confirmationMode === "SelfConfirm"
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-border hover:border-emerald-500/50"
                      }`}
                    >
                      <RadioGroupItem value="SelfConfirm" id="self" className="sr-only" />
                      <Shield className="h-5 w-5 text-emerald-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Self Confirm</p>
                        <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 mt-1">
                          10% fee
                        </Badge>
                      </div>
                    </Label>
                    <Label
                      htmlFor="platform"
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                        confirmationMode === "PlatformConfirm"
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-border hover:border-amber-500/50"
                      }`}
                    >
                      <RadioGroupItem value="PlatformConfirm" id="platform" className="sr-only" />
                      <Shield className="h-5 w-5 text-amber-400" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Platform Confirm</p>
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30 mt-1">
                          30% fee
                        </Badge>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>

                {/* Initial Bounty */}
                <div className="space-y-2">
                  <Label htmlFor="bounty">Initial Bounty (optional)</Label>
                  <div className="relative">
                    <Input
                      id="bounty"
                      type="number"
                      placeholder="0"
                      value={initialBounty}
                      onChange={(e) => setInitialBounty(e.target.value)}
                      step="0.1"
                      min="0"
                      max="100"
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      SOL
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can add bounty later or let others contribute
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGeneratePRD}
                  disabled={!wishDescription.trim()}
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate PRD
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim() || !isValidBounty}
                  className="gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Post Wish
                  {bountyNumber > 0 && ` (${bountyNumber} SOL)`}
                </Button>
              </>
            )}
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
