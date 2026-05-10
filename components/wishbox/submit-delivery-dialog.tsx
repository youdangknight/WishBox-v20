"use client"

import { useState } from "react"
import type { WishAccount } from "@/types/wish"
import type { TransactionStatus } from "@/lib/solana/program"
import { useWallet } from "@solana/wallet-adapter-react"
import { submitDelivery } from "@/lib/solana/program"
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
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TransactionStatusDisplay } from "./transaction-status"
import { Send, Link, GitBranch, TestTube, FileText, CheckCircle2 } from "lucide-react"

interface SubmitDeliveryDialogProps {
  wish: WishAccount | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SubmitDeliveryDialog({
  wish,
  open,
  onClose,
  onSuccess,
}: SubmitDeliveryDialogProps) {
  const { publicKey } = useWallet()
  const [demoUrl, setDemoUrl] = useState("")
  const [githubPr, setGithubPr] = useState("")
  const [testResult, setTestResult] = useState("")
  const [deliveryNote, setDeliveryNote] = useState("")
  const [acceptanceChecklist, setAcceptanceChecklist] = useState<boolean[]>([])
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle")
  const [txSignature, setTxSignature] = useState<string>()
  const [txError, setTxError] = useState<string>()

  if (!wish || !wish.prd) return null

  // Initialize checklist if needed
  if (acceptanceChecklist.length !== wish.prd.acceptanceCriteria.length) {
    setAcceptanceChecklist(new Array(wish.prd.acceptanceCriteria.length).fill(false))
  }

  const allChecked = acceptanceChecklist.every(Boolean)
  const hasRequiredFields = demoUrl.trim() || githubPr.trim()

  const handleChecklistChange = (index: number, checked: boolean) => {
    const newChecklist = [...acceptanceChecklist]
    newChecklist[index] = checked
    setAcceptanceChecklist(newChecklist)
  }

  const handleSubmit = async () => {
    if (!publicKey || !hasRequiredFields) return

    setTxStatus("signing")
    const result = await submitDelivery(
      wish.id,
      publicKey.toBase58(),
      {
        demoUrl: demoUrl.trim() || undefined,
        githubPr: githubPr.trim() || undefined,
        testResult: testResult.trim() || undefined,
        deliveryNote: deliveryNote.trim() || undefined,
        acceptanceChecklist,
      },
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
    }
    setTxStatus("idle")
    setTxSignature(undefined)
    setTxError(undefined)
  }

  const resetForm = () => {
    setDemoUrl("")
    setGithubPr("")
    setTestResult("")
    setDeliveryNote("")
    setAcceptanceChecklist(new Array(wish.prd?.acceptanceCriteria.length || 0).fill(false))
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <>
      <Dialog open={open && txStatus === "idle"} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="sm:max-w-lg max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit Delivery
            </DialogTitle>
            <DialogDescription>
              Submit your delivery proof for &quot;{wish.title}&quot;
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-4 py-4">
              {/* Demo URL */}
              <div className="space-y-2">
                <Label htmlFor="demoUrl" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Demo URL
                </Label>
                <Input
                  id="demoUrl"
                  placeholder="https://your-demo.vercel.app"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                />
              </div>

              {/* GitHub PR */}
              <div className="space-y-2">
                <Label htmlFor="githubPr" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  GitHub PR / Commit
                </Label>
                <Input
                  id="githubPr"
                  placeholder="https://github.com/org/repo/pull/123"
                  value={githubPr}
                  onChange={(e) => setGithubPr(e.target.value)}
                />
              </div>

              {/* Test Result */}
              <div className="space-y-2">
                <Label htmlFor="testResult" className="flex items-center gap-2">
                  <TestTube className="h-4 w-4" />
                  Test Result
                </Label>
                <Input
                  id="testResult"
                  placeholder="All tests passed, 100% coverage"
                  value={testResult}
                  onChange={(e) => setTestResult(e.target.value)}
                />
              </div>

              {/* Delivery Note */}
              <div className="space-y-2">
                <Label htmlFor="deliveryNote" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Delivery Note
                </Label>
                <Textarea
                  id="deliveryNote"
                  placeholder="Describe what you delivered and any additional notes..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Acceptance Checklist */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Acceptance Checklist
                </Label>
                <div className="space-y-2 rounded-lg border border-border p-3">
                  {wish.prd.acceptanceCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Checkbox
                        id={`criterion-${index}`}
                        checked={acceptanceChecklist[index] || false}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(index, checked === true)
                        }
                      />
                      <label
                        htmlFor={`criterion-${index}`}
                        className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                      >
                        {criterion}
                      </label>
                    </div>
                  ))}
                </div>
                {!allChecked && (
                  <p className="text-xs text-amber-400">
                    Check all items to confirm you have met the acceptance criteria
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!hasRequiredFields || !allChecked}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Submit Delivery
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
