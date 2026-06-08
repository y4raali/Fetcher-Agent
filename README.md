# Fetcher-Agent
AI-powered recruiter that automates developer recruiting directly from GitHub. Point it at a location or skill set, and it searches for matching profiles, pulls their pinned repositories via GraphQL, and returns a concise candidate brief — name, qualifications, and key projects.

**Built with:**
- Open AI agents SDK for the agentic loop
- GitHub REST API for user search
- GitHub GraphQL API for pinned repo data
- Zod for tool parameter validation

Setup:
# 1. Install dependencies
npm install

# 2. Set your env vars
export OPENROUTER_API_KEY=sk-or-...
export GITHUB_TOKEN=ghp_...

# 3. Run
node --import tsx index.ts
