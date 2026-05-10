"use client"

import type { PRD } from "@/types/wish"
import { CheckCircle2 } from "lucide-react"

interface AcceptanceCriteriaProps {
  prd: PRD
  checklist?: boolean[]
}

export function AcceptanceCriteria({ prd, checklist }: AcceptanceCriteriaProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        <h4 className="text-sm font-medium text-foreground">Acceptance Criteria</h4>
      </div>

      <ul className="space-y-2">
        {prd.acceptanceCriteria.map((criterion, index) => {
          const isChecked = checklist?.[index] ?? false
          return (
            <li key={index} className="flex items-start gap-2">
              <div
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                  isChecked
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-border"
                }`}
              >
                {isChecked && (
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${isChecked ? "text-emerald-400" : "text-muted-foreground"}`}>
                {criterion}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
