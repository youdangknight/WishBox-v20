"use client"

import { formatAddress, formatSol, formatHash, getExplorerTxUrl } from "@/lib/solana/utils"
import { getBuilderStats } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  CheckCircle,
  Zap,
  Shield,
  ExternalLink,
  Link,
  GitBranch,
  Hash,
  Copy,
} from "lucide-react"
import { useState } from "react"

interface BuilderProfileDialogProps {
  builderWallet: string | null
  open: boolean
  onClose: () => void
}

export function BuilderProfileDialog({
  builderWallet,
  open,
  onClose,
}: BuilderProfileDialogProps) {
  const [copiedAddress, setCopiedAddress] = useState(false)

  if (!builderWallet) return null

  const stats = getBuilderStats(builderWallet)

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(builderWallet)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Builder Profile
          </DialogTitle>
          <DialogDescription className="sr-only">
            View builder stats and completed deliveries
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4 py-4">
            {/* Wallet Address */}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wallet</p>
                  <code className="text-sm font-mono">{formatAddress(builderWallet, 6)}</code>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                <Copy className={`h-4 w-4 ${copiedAddress ? "text-primary" : ""}`} />
              </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-5 w-5 mx-auto text-emerald-400 mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.completedWishes}</p>
                  <p className="text-xs text-muted-foreground">Completed Wishes</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="h-5 w-5 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">
                    {formatSol(stats.totalEarned)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Earned (SOL)</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-5 w-5 mx-auto text-emerald-400 mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.selfConfirmedCount}</p>
                  <p className="text-xs text-muted-foreground">Self Confirmed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Shield className="h-5 w-5 mx-auto text-amber-400 mb-2" />
                  <p className="text-2xl font-bold text-foreground">{stats.platformConfirmedCount}</p>
                  <p className="text-xs text-muted-foreground">Platform Confirmed</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Deliveries */}
            {stats.recentDeliveries.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Recent Deliveries</h4>
                <div className="space-y-2">
                  {stats.recentDeliveries.map((delivery) => (
                    <Card key={delivery.wishId}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h5 className="text-sm font-medium text-foreground line-clamp-1">
                            {delivery.wishTitle}
                          </h5>
                          <Badge
                            variant="outline"
                            className={
                              delivery.confirmationMode === "SelfConfirm"
                                ? "border-emerald-500/30 text-emerald-400"
                                : "border-amber-500/30 text-amber-400"
                            }
                          >
                            {delivery.confirmationMode === "SelfConfirm" ? "10%" : "30%"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span className="flex items-center gap-1 text-primary">
                            <Zap className="h-3 w-3" />
                            {formatSol(delivery.reward)} SOL
                          </span>
                          <span>
                            {new Date(delivery.settledAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {delivery.demoUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => window.open(delivery.demoUrl, "_blank")}
                            >
                              <Link className="h-3 w-3" />
                              Demo
                            </Button>
                          )}
                          {delivery.githubPr && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() => window.open(delivery.githubPr, "_blank")}
                            >
                              <GitBranch className="h-3 w-3" />
                              Code
                            </Button>
                          )}
                          {delivery.settlementTx && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1"
                              onClick={() =>
                                window.open(getExplorerTxUrl(delivery.settlementTx!), "_blank")
                              }
                            >
                              <ExternalLink className="h-3 w-3" />
                              Tx
                            </Button>
                          )}
                        </div>

                        <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                          <Hash className="h-3 w-3" />
                          <code>{formatHash(delivery.deliveryHash, 8)}</code>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {stats.recentDeliveries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed deliveries yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
