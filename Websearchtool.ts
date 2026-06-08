import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import model from './model.ts';

const gh = (path: string) =>
	fetch(`https://api.github.com${path}`, {
		headers: {
			'User-Agent': `candidate-scout-workshop`,
			Accept: `application/vnd.github+json`,
			...(process.env.GITHUB_TOKEN
				? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
				: {}),
		},
	});

const searchGithubUsers = tool({
	name: `search_github_users`,
	description: `Search GitHub users by query, e.g. language, location, followers. Return matching usernames and profile URLs.`,
	parameters: z.object({
		query: z.string(),
		limit: z.number().int().min(1).max(10).default(5),
	}),
	async execute({ query, limit }) {
		const res = await gh(
			`/search/users?q=${encodeURIComponent(query)}&per_page=${limit}`,
		);
		if (!res.ok) return `GitHub search error ${res.status}`;
		const data = (await res.json()) as {
			items?: { login: string; html_url: string }[];
		};
		return JSON.stringify(
			(data.items ?? []).map((item) => ({
				login: item.login,
				url: item.html_url,
			})),
		);
	},
});

const getPinnedRepos = tool({
	name: `get_pinned_repos`,
	description: `Retrieve a GitHub user's pinned repositories using the GitHub GraphQL API.`,
	parameters: z.object({ login: z.string() }),
	async execute({ login }) {
		const token = process.env.GITHUB_TOKEN;
		if (!token) return `GITHUB_TOKEN is required to fetch pinned repos.`;

		const query = `
			query ($login: String!) {
				user(login: $login) {
					pinnedItems(first: 6, types: REPOSITORY) {
						nodes {
							... on Repository {
								name
								url
								description
								stargazerCount
								primaryLanguage {
									name
								}
							}
						}
					}
				}
			`;

		const res = await fetch(`https://api.github.com/graphql`, {
			method: `POST`,
			headers: {
				'Content-Type': `application/json`,
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ query, variables: { login } }),
		});

		if (!res.ok) return `GitHub GraphQL error ${res.status}`;
		const json = await res.json();
		const nodes = (json as { data?: { user?: { pinnedItems?: { nodes?: any[] } } } })?.data?.user?.pinnedItems?.nodes ?? [];

		return JSON.stringify(
			nodes.map((repo: any) => ({
				name: repo.name,
				url: repo.url,
				description: repo.description,
				stars: repo.stargazerCount,
				language: repo.primaryLanguage?.name ?? null,
			})),
		);
	},
});

const recruiter = new Agent({
	name: `Recruiter Agent`,
	instructions: `You are a recruiter focused on finding full stack web developers from Github.

	Your task:
1) Identify strong candidates based on their GitHub profiles, contributions, and activity. Look for indicators of expertise in JavaScript, TypeScript, and relevant frameworks, as well as overall engagement with the developer community.
2) Look for pinned repositories or highlgighted projects that demonstrate their skills and interests.
3) Match them to full-stack criteria (frontend + backend)

Return: 
Candidate name
why they qualify (based on their profile and repos)
Key repositories

Keep the answer under 120 words.`,
	model,
	tools: [searchGithubUsers, getPinnedRepos],
});

const prompt = `Search for Fullstack devs in Amman via GitHub?`;

const result = await run(recruiter, prompt);

console.log(result.finalOutput);
