"use client"

import type { WishAccount } from "@/types/wish"
import { formatAddress, formatHash, getExplorerAddressUrl } from "@/lib/solana/utils"
import { PROGRAM_ID, NETWORK } from "@/lib/solana/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, Database, Key, FileCode, FileCheck } from "lucide-react"
import { useState } from "react"

interface OnChainPoolProps {
  wish: WishAccount
}

function CopyableField({
  label,
  value,
  icon: Icon,
  explorerUrl,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  explorerUrl?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <code className="text-sm font-mono text-foreground">
          {value.length > 20 ? formatAddress(value, 6) : value}
        </code>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleCopy}
        >
          <Copy className={`h-3 w-3 ${copied ? "text-primary" : ""}`} />
        </Button>
        {explorerUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => window.open(explorerUrl, "_blank")}
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  )
}

export function OnChainPool({ wish }: OnChainPoolProps) {
  const vaultPda = `vault_${wish.id}_pda`

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          On-chain Pool
        </h4>
        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
          {NETWORK === "devnet" ? "Devnet Live" : "Mainnet"}
        </Badge>
      </div>

      <div className="divide-y divide-border">
        <CopyableField
          label="Wish ID"
          value={wish.id}
          icon={Key}
        />
        <CopyableField
          label="Vault PDA"
          value={vaultPda}
          icon={Database}
          explorerUrl={getExplorerAddressUrl(vaultPda)}
        />
        <CopyableField
          label="Program ID"
          value={PROGRAM_ID}
          icon={FileCode}
          explorerUrl={getExplorerAddressUrl(PROGRAM_ID)}
        />
        <CopyableField
          label="spec_hash"
          value={wish.specHash}
          icon={FileCode}
        />
        {wish.deliveryHash && (
          <CopyableField
            label="delivery_hash"
            value={wish.deliveryHash}
            icon={FileCheck}
          />
        )}
      </div>
    </div>
  )
}
