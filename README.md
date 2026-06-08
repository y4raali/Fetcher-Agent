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
# 🔍 Candidate Scout — AI-Powered GitHub Recruiter Agent

An AI agent built with the **OpenAI Agents SDK** that autonomously searches GitHub to identify and evaluate full-stack web developer candidates. Given a natural language prompt, the agent searches profiles, retrieves pinned repositories, and produces a concise recruiter-style summary.
✨ Features

- 🤖 **Agentic Workflow** — Uses the OpenAI Agents SDK to reason across multiple tool calls automatically
- 🔎 **GitHub User Search** — Queries the GitHub REST API to find developers by language, location, or followers
- 📌 **Pinned Repo Fetcher** — Pulls a candidate's pinned repositories via the GitHub GraphQL API
- 🧠 **AI Evaluation** — The agent scores candidates against full-stack criteria (JavaScript, TypeScript, frontend + backend)
- 📝 **Concise Output** — Returns a focused summary of each candidate in under 120 words

## ⚙️ Requirements

- [Node.js](https://nodejs.org/)
- An openrouter API key
- An OpenAI API key (used by the Agents SDK)

### Install Dependencies

```bash
npm install
```
## 🚀 How to Run

Set Up Environment Variables(if needed,or just copy code)

Run the Agent++add your own API key in code then run


The agent will:
1. Search GitHub for matching developer profiles
2. Fetch pinned repositories for each candidate
3. Print a recruiter-style evaluation to the console

## 🖥️ Example Output

```
Candidate: johndoe
Why they qualify: Active full-stack developer with strong TypeScript and Node.js
skills. Contributes to open-source React and Express projects with consistent
commit history.
Key repositories: portfolio-app (⭐ 120), rest-api-boilerplate (⭐ 84)
```

 Notes

- The GitHub GraphQL API (`getPinnedRepos`) **requires** a `GITHUB_TOKEN`. Without it, pinned repos will be skipped.
- The REST search API works without a token but is rate-limited to 10 requests/minute for unauthenticated calls.
- The `prompt` can be freely changed to scout any role or location, e.g. `"Find React Native developers in Dubai"`.
