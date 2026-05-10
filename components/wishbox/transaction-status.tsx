"use client"

import type { TransactionStatus } from "@/lib/solana/program"
import { getExplorerTxUrl } from "@/lib/solana/utils"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, ExternalLink, Wallet, Send, Clock } from "lucide-react"

interface TransactionStatusDisplayProps {
  status: TransactionStatus
  signature?: string
  error?: string
  onClose?: () => void
}

const statusConfig: Record<
  TransactionStatus,
  { icon: React.ReactNode; label: string; color: string }
> = {
  idle: {
    icon: null,
    label: "",
    color: "",
  },
  signing: {
    icon: <Wallet className="h-5 w-5 animate-pulse" />,
    label: "Waiting for wallet signature...",
    color: "text-amber-400",
  },
  submitted: {
    icon: <Send className="h-5 w-5" />,
    label: "Transaction submitted",
    color: "text-blue-400",
  },
  confirming: {
    icon: <Clock className="h-5 w-5 animate-spin" />,
    label: "Confirming on devnet...",
    color: "text-primary",
  },
  success: {
    icon: <CheckCircle className="h-5 w-5" />,
    label: "Transaction successful!",
    color: "text-emerald-400",
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    label: "Transaction failed",
    color: "text-red-400",
  },
}

export function TransactionStatusDisplay({
  status,
  signature,
  error,
  onClose,
}: TransactionStatusDisplayProps) {
  if (status === "idle") return null

  const config = statusConfig[status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="rounded-lg border border-border bg-card p-6 w-full max-w-sm mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 ${config.color}`}>{config.icon}</div>
          <h3 className={`text-lg font-semibold mb-2 ${config.color}`}>
            {config.label}
          </h3>

          {status === "error" && error && (
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
          )}

          {status === "success" && signature && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mb-4"
              onClick={() => window.open(getExplorerTxUrl(signature), "_blank")}
            >
              View Transaction
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}

          {(status === "success" || status === "error") && onClose && (
            <Button onClick={onClose} className="w-full">
              {status === "success" ? "Done" : "Close"}
            </Button>
          )}

          {status !== "success" && status !== "error" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Please wait...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
