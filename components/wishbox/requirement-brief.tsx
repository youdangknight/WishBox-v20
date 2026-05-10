"use client"

import type { PRD } from "@/types/wish"
import { FileText, Target, User, CheckSquare, XSquare, Package } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface RequirementBriefProps {
  prd: PRD
}

export function RequirementBrief({ prd }: RequirementBriefProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <FileText className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-medium text-foreground">Requirement Brief</h4>
      </div>

      <Accordion type="single" collapsible defaultValue="goal" className="px-4">
        <AccordionItem value="goal">
          <AccordionTrigger className="text-sm py-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Goal
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-3">
            {prd.goal}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="userScenario">
          <AccordionTrigger className="text-sm py-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              User Scenario
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-3">
            {prd.userScenario}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="scope">
          <AccordionTrigger className="text-sm py-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-400" />
              Scope
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <ul className="space-y-1">
              {prd.scope.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="outOfScope">
          <AccordionTrigger className="text-sm py-3">
            <div className="flex items-center gap-2">
              <XSquare className="h-4 w-4 text-red-400" />
              Out of Scope
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <ul className="space-y-1">
              {prd.outOfScope.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-red-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="deliverables">
          <AccordionTrigger className="text-sm py-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-amber-400" />
              Deliverables
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <ul className="space-y-1">
              {prd.deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-amber-400 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
