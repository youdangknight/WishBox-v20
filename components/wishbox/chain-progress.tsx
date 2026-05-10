"use client"

import type { WishStatus } from "@/types/wish"
import { cn } from "@/lib/utils"
import { Check, Circle, Loader2 } from "lucide-react"

interface ChainProgressProps {
  status: WishStatus
}

const steps = [
  { key: "Created", label: "Created" },
  { key: "BountyAdded", label: "Bounty Added" },
  { key: "Accepted", label: "Accepted" },
  { key: "Submitted", label: "Submitted" },
  { key: "Settled", label: "Settled" },
]

function getStepStatus(
  step: string,
  wishStatus: WishStatus
): "completed" | "current" | "pending" {
  const statusMap: Record<WishStatus, number> = {
    Open: 1, // Created + BountyAdded done, Accepted waiting
    Accepted: 2, // Accepted done, Submitted waiting
    Submitted: 3, // Submitted done, Settled waiting
    Settled: 4, // All done
  }

  const stepIndexMap: Record<string, number> = {
    Created: 0,
    BountyAdded: 1,
    Accepted: 2,
    Submitted: 3,
    Settled: 4,
  }

  const currentLevel = statusMap[wishStatus]
  const stepIndex = stepIndexMap[step]

  if (stepIndex < currentLevel) return "completed"
  if (stepIndex === currentLevel) return "current"
  return "pending"
}

export function ChainProgress({ status }: ChainProgressProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="text-sm font-medium text-foreground mb-4">Chain Progress</h4>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key, status)
          return (
            <div key={step.key} className="flex flex-col items-center relative flex-1">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-3 left-1/2 w-full h-0.5",
                    stepStatus === "completed" || getStepStatus(steps[index + 1].key, status) !== "pending"
                      ? "bg-primary"
                      : "bg-border"
                  )}
                />
              )}
              
              {/* Step circle */}
              <div
                className={cn(
                  "relative z-10 flex h-6 w-6 items-center justify-center rounded-full",
                  stepStatus === "completed" && "bg-primary",
                  stepStatus === "current" && "bg-primary/20 border-2 border-primary",
                  stepStatus === "pending" && "bg-muted border border-border"
                )}
              >
                {stepStatus === "completed" && (
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                )}
                {stepStatus === "current" && (
                  <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                )}
                {stepStatus === "pending" && (
                  <Circle className="h-3 w-3 text-muted-foreground" />
                )}
              </div>
              
              {/* Label */}
              <span
                className={cn(
                  "mt-2 text-xs text-center",
                  stepStatus === "completed" && "text-primary font-medium",
                  stepStatus === "current" && "text-primary font-medium",
                  stepStatus === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
