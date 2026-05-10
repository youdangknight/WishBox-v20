import type { WishAccount } from "@/types/wish"
import { LAMPORTS_PER_SOL } from "./solana/constants"

// Mock wishes data representing various states
// TOP 3: Based on real data from Superteam Earn, Immunefi, Layer3, DoraHacks
// These are the highest heat, highest overlap bounties across platforms
export const mockWishes: WishAccount[] = [
  // #1 HOT: AI Agent Development - from Superteam Earn + Layer3
  // High demand across platforms, $5k-$50k range, Agent-ready tasks
  {
    id: "wish_001",
    creator: "3pQwErTyUiOpAsDfGhJkLzXcVbNm4rS1",
    builder: undefined,
    title: "Build AI Trading Agent for Solana DeFi",
    description:
      "Create an AI-powered trading agent that can analyze on-chain data, execute swaps on Jupiter/Raydium, and manage positions based on configurable strategies. Agent should expose MCP interface for external orchestration.",
    titleHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    specHash: "spec_hash_001_abcdef1234567890abcdef1234567890abcdef123456",
    bountyPoolLamports: 45.0 * LAMPORTS_PER_SOL,
    contributorCount: 23,
    status: "Open",
    confirmationMode: "PlatformConfirm",
    platformFeeBps: 3000,
    category: "AI Agent",
    createdAt: Date.now() - 86400000 * 2,
    prd: {
      goal: "Deliver a production-ready AI trading agent for Solana DeFi protocols",
      userScenario:
        "As a DeFi trader, I want an AI agent to monitor markets and execute trades based on my strategies so that I can automate my trading workflow.",
      scope: [
        "On-chain data analysis (prices, liquidity, volume)",
        "Jupiter/Raydium integration for swaps",
        "Strategy configuration interface",
        "MCP protocol support for agent orchestration",
        "Risk management and position sizing",
      ],
      outOfScope: [
        "Financial advice or guaranteed returns",
        "Cross-chain trading",
        "Margin/leverage trading",
        "Mobile app interface",
      ],
      deliverables: [
        "Working AI agent on devnet",
        "MCP interface documentation",
        "Strategy configuration guide",
        "Source code repository",
      ],
      acceptanceCriteria: [
        "Agent connects to Solana mainnet/devnet via RPC",
        "Agent can execute swaps on Jupiter aggregator",
        "Agent responds to MCP commands correctly",
        "Strategy configuration is validated and applied",
        "Risk limits are enforced (max position size, stop-loss)",
      ],
    },
  },
  // #2 HOT: Smart Contract Security Audit - from Immunefi + HackerOne
  // Highest bounty range ($50k-$3M), critical for all Web3 projects
  {
    id: "wish_002",
    creator: "7xYzAbCdEfGhIjKlMnOpQrStUvWx8yZ2",
    builder: undefined,
    title: "Security Audit for Solana AMM Program",
    description:
      "Conduct a comprehensive security audit of our Anchor-based AMM program. Looking for vulnerabilities including but not limited to: reentrancy, arithmetic overflow, access control, oracle manipulation, and economic exploits.",
    titleHash: "b2c3d4e5f67890123456789012345678901234abcdef1234567890abcdef1234",
    specHash: "spec_hash_002_bcdef1234567890abcdef1234567890abcdef12345",
    bountyPoolLamports: 80.0 * LAMPORTS_PER_SOL,
    contributorCount: 15,
    status: "Open",
    confirmationMode: "PlatformConfirm",
    platformFeeBps: 3000,
    category: "Security",
    createdAt: Date.now() - 86400000 * 1,
    prd: {
      goal: "Identify and report all security vulnerabilities in the AMM program",
      userScenario:
        "As a protocol team, we want our smart contracts audited before mainnet launch so that user funds are protected.",
      scope: [
        "Full Anchor program audit (~5000 lines)",
        "Economic model review",
        "Access control verification",
        "Arithmetic safety checks",
        "Integration risk assessment",
      ],
      outOfScope: [
        "Frontend/backend code",
        "Off-chain infrastructure",
        "Legal compliance review",
        "Ongoing monitoring",
      ],
      deliverables: [
        "Detailed audit report (PDF)",
        "Vulnerability severity classification (Critical/High/Medium/Low)",
        "Proof-of-concept exploits where applicable",
        "Remediation recommendations",
      ],
      acceptanceCriteria: [
        "All critical and high vulnerabilities identified with PoC",
        "Report follows industry-standard format (similar to Immunefi)",
        "Remediation steps are actionable and specific",
        "Audit completed within 14 days",
        "One round of re-audit for fixed issues",
      ],
    },
  },
  // #3 HOT: Solana DeFi Protocol Development - from Superteam Earn + DoraHacks
  // Core infrastructure demand, $10k-$100k range, Frontier Hackathon featured
  {
    id: "wish_003",
    creator: "4mNoPqRsTuVwXyZaBcDeFgHiJkLmNoPq",
    builder: "2bCdEfGhIjKlMnOpQrStUvWxYzAbCdEf",
    title: "Build Perpetual DEX on Solana with vAMM",
    description:
      "Develop a perpetual futures DEX using virtual AMM (vAMM) model on Solana. Support long/short positions, leverage up to 10x, and integrate with Pyth oracle for price feeds.",
    titleHash: "c3d4e5f678901234567890123456789012345abcdef1234567890abcdef12345",
    specHash: "spec_hash_003_cdef1234567890abcdef1234567890abcdef123456",
    deliveryHash: "delivery_hash_003_abcdef1234567890abcdef1234567890abcdef",
    bountyPoolLamports: 120.0 * LAMPORTS_PER_SOL,
    contributorCount: 31,
    status: "Submitted",
    confirmationMode: "PlatformConfirm",
    platformFeeBps: 3000,
    category: "DeFi",
    createdAt: Date.now() - 86400000 * 10,
    acceptedAt: Date.now() - 86400000 * 7,
    submittedAt: Date.now() - 86400000 * 1,
    prd: {
      goal: "Create a functional perpetual DEX with vAMM mechanics on Solana",
      userScenario:
        "As a derivatives trader, I want to trade perpetual futures on Solana with leverage so that I can amplify my positions without expiry dates.",
      scope: [
        "vAMM smart contract (Anchor)",
        "Long/short position management",
        "Leverage up to 10x with liquidation engine",
        "Pyth oracle integration",
        "Basic trading frontend",
      ],
      outOfScope: [
        "Mobile app",
        "Advanced order types (limit, stop-loss)",
        "Cross-margin",
        "Referral system",
      ],
      deliverables: [
        "Anchor program deployed on devnet",
        "Frontend trading interface",
        "Technical documentation",
        "Devnet Program ID and demo",
      ],
      acceptanceCriteria: [
        "Users can open long/short positions",
        "Leverage applies correctly up to 10x",
        "Liquidation triggers at correct threshold",
        "Oracle prices update within 1 second",
        "All transactions succeed on devnet",
      ],
    },
    delivery: {
      demoUrl: "https://perp-demo.solana.example.com",
      githubPr: "https://github.com/example/perp-dex/pull/42",
      testResult: "100+ positions opened/closed on devnet, liquidation engine tested with 50 scenarios",
      deliveryNote:
        "Full vAMM perpetual DEX with Pyth integration. Frontend supports Phantom/Solflare. Gas optimized for sub-$0.01 trades.",
      acceptanceChecklist: [true, true, true, true, true],
      submittedAt: Date.now() - 86400000 * 1,
    },
  },
  {
    id: "wish_004",
    creator: "8qRsTuVwXyZaBcDeFgHiJkLmNoPqRsTu",
    builder: "5eFgHiJkLmNoPqRsTuVwXyZaBcDeFgHi",
    title: "Implement Wallet Analytics API",
    description:
      "Build a REST API that analyzes Solana wallet activity, providing insights on token holdings, transaction patterns, and portfolio performance.",
    titleHash: "d4e5f6789012345678901234567890123456abcdef1234567890abcdef123456",
    specHash: "spec_hash_004_def1234567890abcdef1234567890abcdef1234567",
    deliveryHash: "delivery_hash_004_bcdef1234567890abcdef1234567890abcdef12",
    bountyPoolLamports: 8.0 * LAMPORTS_PER_SOL,
    contributorCount: 6,
    status: "Settled",
    confirmationMode: "PlatformConfirm",
    platformFeeBps: 3000,
    category: "Development",
    createdAt: Date.now() - 86400000 * 20,
    acceptedAt: Date.now() - 86400000 * 15,
    submittedAt: Date.now() - 86400000 * 5,
    settledAt: Date.now() - 86400000 * 3,
    builderPayoutLamports: 5.6 * LAMPORTS_PER_SOL,
    platformFeeLamports: 2.4 * LAMPORTS_PER_SOL,
    prd: {
      goal: "Deliver a production-ready wallet analytics API",
      userScenario:
        "As a DeFi platform, I want to integrate wallet analytics so that I can provide users with portfolio insights.",
      scope: [
        "Token holdings endpoint",
        "Transaction history endpoint",
        "Portfolio performance calculations",
        "Rate limiting and caching",
      ],
      outOfScope: [
        "Frontend dashboard",
        "Real-time websocket updates",
        "Multi-chain support",
        "Historical data beyond 90 days",
      ],
      deliverables: ["API documentation", "Working API endpoints", "Deployment guide"],
      acceptanceCriteria: [
        "API returns accurate token holdings",
        "Transaction history is paginated",
        "Performance metrics are calculated correctly",
        "API handles rate limiting gracefully",
        "Documentation is comprehensive",
      ],
    },
    delivery: {
      demoUrl: "https://api.example.com/wallet-analytics",
      githubPr: "https://github.com/example/api/pull/456",
      testResult: "All endpoints tested with 100+ wallets, 99.9% accuracy",
      deliveryNote:
        "Full REST API with OpenAPI spec, deployed on Vercel with edge caching. Supports all SPL tokens.",
      acceptanceChecklist: [true, true, true, true, true],
      submittedAt: Date.now() - 86400000 * 5,
    },
  },
  {
    id: "wish_005",
    creator: "1aBcDeFgHiJkLmNoPqRsTuVwXyZaBcDe",
    builder: undefined,
    title: "Translate DApp to Chinese",
    description:
      "Translate the entire user interface and documentation of our Solana DApp from English to Simplified Chinese, maintaining technical accuracy.",
    titleHash: "e5f67890123456789012345678901234567abcdef1234567890abcdef1234567",
    specHash: "spec_hash_005_ef1234567890abcdef1234567890abcdef12345678",
    bountyPoolLamports: 2.0 * LAMPORTS_PER_SOL,
    contributorCount: 2,
    status: "Open",
    confirmationMode: "SelfConfirm",
    platformFeeBps: 1000,
    category: "Translation",
    createdAt: Date.now() - 86400000 * 1,
    prd: {
      goal: "Provide high-quality Chinese localization for our DApp",
      userScenario:
        "As a Chinese-speaking user, I want to use the DApp in my native language so that I can understand all features clearly.",
      scope: [
        "UI text translation",
        "Error message localization",
        "Documentation translation",
        "Technical term glossary",
      ],
      outOfScope: [
        "Other language translations",
        "Video subtitles",
        "Marketing content",
        "Ongoing maintenance",
      ],
      deliverables: [
        "Translated JSON/YAML files",
        "Translated documentation",
        "Glossary of technical terms",
      ],
      acceptanceCriteria: [
        "All UI elements are translated",
        "Technical terms are accurate",
        "Grammar and spelling are correct",
        "Context is preserved",
        "File format is maintained",
      ],
    },
  },
  {
    id: "wish_006",
    creator: "6fGhIjKlMnOpQrStUvWxYzAbCdEfGhIj",
    builder: undefined,
    title: "Create Solana Wallet Chrome Extension",
    description:
      "Build a lightweight Chrome extension wallet for Solana with basic send/receive functionality, token display, and connection to dApps.",
    titleHash: "f6789012345678901234567890123456789abcdef1234567890abcdef12345678",
    specHash: "spec_hash_006_f1234567890abcdef1234567890abcdef123456789",
    bountyPoolLamports: 12.5 * LAMPORTS_PER_SOL,
    contributorCount: 8,
    status: "Open",
    confirmationMode: "PlatformConfirm",
    platformFeeBps: 3000,
    category: "Development",
    createdAt: Date.now() - 86400000 * 2,
    prd: {
      goal: "Deliver a functional Solana wallet Chrome extension",
      userScenario:
        "As a Solana user, I want a simple browser wallet so that I can interact with dApps without installing a full wallet application.",
      scope: [
        "Wallet creation and import",
        "Send/receive SOL and SPL tokens",
        "dApp connection (Wallet Standard)",
        "Basic transaction history",
      ],
      outOfScope: [
        "Mobile app",
        "NFT display",
        "Swap functionality",
        "Hardware wallet support",
      ],
      deliverables: [
        "Chrome extension package",
        "Source code",
        "User guide",
        "Security audit recommendations",
      ],
      acceptanceCriteria: [
        "Extension installs and runs on Chrome",
        "Users can create new wallet",
        "Users can import existing wallet",
        "Send/receive transactions work",
        "dApp connection follows Wallet Standard",
      ],
    },
  },
]

// Get builder statistics from settled wishes
export function getBuilderStats(builderWallet: string) {
  const settledWishes = mockWishes.filter(
    (w) => w.builder === builderWallet && w.status === "Settled"
  )

  const selfConfirmed = settledWishes.filter((w) => w.confirmationMode === "SelfConfirm").length
  const platformConfirmed = settledWishes.filter(
    (w) => w.confirmationMode === "PlatformConfirm"
  ).length
  const totalEarned = settledWishes.reduce((sum, w) => sum + (w.builderPayoutLamports || 0), 0)

  return {
    completedWishes: settledWishes.length,
    totalEarned,
    selfConfirmedCount: selfConfirmed,
    platformConfirmedCount: platformConfirmed,
    recentDeliveries: settledWishes.map((w) => ({
      wishId: w.id,
      wishTitle: w.title,
      reward: w.bountyPoolLamports,
      confirmationMode: w.confirmationMode,
      deliveryHash: w.deliveryHash || "",
      specHash: w.specHash,
      settlementTx: `tx_${w.id}_settlement`,
      demoUrl: w.delivery?.demoUrl,
      githubPr: w.delivery?.githubPr,
      settledAt: w.settledAt || 0,
    })),
  }
}
