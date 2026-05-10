import type { ConfirmationMode, PRD } from "@/types/wish"

interface PRDGeneratorResult {
  prd: PRD
  recommendedMode: ConfirmationMode
  title: string
  summary: string
}

/**
 * Generate PRD from a one-line wish description
 * This is a lightweight template-based implementation
 */
export function generatePRD(wishDescription: string): PRDGeneratorResult {
  const lowerDesc = wishDescription.toLowerCase()

  // Determine recommended confirmation mode based on keywords
  let recommendedMode: ConfirmationMode = "SelfConfirm"

  const platformConfirmKeywords = [
    "security",
    "money",
    "wallet",
    "contract",
    "production",
    "smart contract",
    "solana program",
    "token",
    "payment",
    "financial",
  ]

  const selfConfirmKeywords = [
    "writing",
    "translation",
    "research",
    "summary",
    "article",
    "blog",
    "content",
    "document",
  ]

  // Check for platform confirm keywords first (higher priority)
  for (const keyword of platformConfirmKeywords) {
    if (lowerDesc.includes(keyword)) {
      recommendedMode = "PlatformConfirm"
      break
    }
  }

  // Only check self confirm if not already platform confirm
  if (recommendedMode !== "PlatformConfirm") {
    for (const keyword of selfConfirmKeywords) {
      if (lowerDesc.includes(keyword)) {
        recommendedMode = "SelfConfirm"
        break
      }
    }
  }

  // Determine category and generate appropriate PRD
  const isDevelopment =
    lowerDesc.includes("code") ||
    lowerDesc.includes("develop") ||
    lowerDesc.includes("build") ||
    lowerDesc.includes("implement") ||
    lowerDesc.includes("api") ||
    lowerDesc.includes("app")

  const isDesign =
    lowerDesc.includes("design") ||
    lowerDesc.includes("ui") ||
    lowerDesc.includes("ux") ||
    lowerDesc.includes("figma") ||
    lowerDesc.includes("mockup")

  // Generate title (capitalize first letter of each word)
  const title = wishDescription
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .slice(0, 100)

  // Generate summary
  const summary = `Build a solution that ${wishDescription.toLowerCase()}.`

  // Generate PRD based on type
  const prd: PRD = {
    goal: `Deliver a high-quality solution that ${wishDescription.toLowerCase()}`,
    userScenario: generateUserScenario(wishDescription),
    scope: generateScope(wishDescription, isDevelopment, isDesign),
    outOfScope: generateOutOfScope(isDevelopment, isDesign),
    deliverables: generateDeliverables(isDevelopment, isDesign),
    acceptanceCriteria: generateAcceptanceCriteria(wishDescription, isDevelopment, isDesign),
    recommendedPath: isDevelopment
      ? "Start with requirements analysis, then implement core functionality, followed by testing and documentation."
      : isDesign
        ? "Begin with research and mood boards, create wireframes, then develop high-fidelity mockups."
        : "Research the topic, create an outline, draft the content, then review and refine.",
  }

  return {
    prd,
    recommendedMode,
    title,
    summary,
  }
}

function generateUserScenario(description: string): string {
  return `As a user, I want to ${description.toLowerCase()} so that I can achieve my desired outcome efficiently and effectively.`
}

function generateScope(description: string, isDevelopment: boolean, isDesign: boolean): string[] {
  if (isDevelopment) {
    return [
      "Core functionality implementation",
      "Basic error handling and validation",
      "Clean and maintainable code",
      "Basic documentation",
    ]
  }
  if (isDesign) {
    return [
      "Visual design concepts",
      "UI component layouts",
      "Responsive design considerations",
      "Design file deliverables",
    ]
  }
  return [
    "Research and analysis",
    "Content creation",
    "Quality review",
    "Final deliverable preparation",
  ]
}

function generateOutOfScope(isDevelopment: boolean, isDesign: boolean): string[] {
  if (isDevelopment) {
    return [
      "Production deployment",
      "Ongoing maintenance",
      "Third-party integrations not specified",
      "Performance optimization beyond MVP",
    ]
  }
  if (isDesign) {
    return [
      "Development implementation",
      "Animation and motion design",
      "Brand identity creation",
      "User testing",
    ]
  }
  return [
    "Implementation or execution",
    "Ongoing updates",
    "Related but unspecified topics",
    "Translation to other languages",
  ]
}

function generateDeliverables(isDevelopment: boolean, isDesign: boolean): string[] {
  if (isDevelopment) {
    return [
      "Source code repository or files",
      "Demo URL or working prototype",
      "Brief documentation or README",
    ]
  }
  if (isDesign) {
    return [
      "Design files (Figma/Sketch/XD)",
      "Exported assets if applicable",
      "Design specifications document",
    ]
  }
  return ["Final document or content", "Source files if applicable", "Summary or overview"]
}

function generateAcceptanceCriteria(
  description: string,
  isDevelopment: boolean,
  isDesign: boolean
): string[] {
  if (isDevelopment) {
    return [
      "Code compiles and runs without errors",
      "Core functionality works as described",
      "Code follows basic best practices",
      "Demo or documentation provided",
      "Meets the specified requirements",
    ]
  }
  if (isDesign) {
    return [
      "Design matches the requested style",
      "All required screens/components included",
      "Design is visually consistent",
      "Files are properly organized",
      "Responsive considerations addressed",
    ]
  }
  return [
    "Content is accurate and well-researched",
    "Deliverable is complete and comprehensive",
    "Quality meets professional standards",
    "Formatting is clean and readable",
    "Meets the original request requirements",
  ]
}
