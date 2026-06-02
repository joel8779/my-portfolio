import { NextResponse } from "next/server";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";
const USERNAME = "joel8779";

const query = `
  query PortfolioRepositories($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            id
            name
            description
            url
            homepageUrl
            stargazerCount
            createdAt
            updatedAt
            pushedAt
            isFork
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 6) {
              nodes {
                topic {
                  name
                }
              }
            }
          }
        }
      }
      repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }, privacy: PUBLIC) {
        nodes {
          id
          name
          description
          url
          homepageUrl
          stargazerCount
          createdAt
          updatedAt
          pushedAt
          isFork
          primaryLanguage {
            name
            color
          }
          repositoryTopics(first: 8) {
            nodes {
              topic {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token is not configured." },
      { status: 503 },
    );
  }

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: {
        login: USERNAME,
      },
    }),
    next: {
      revalidate: 900,
    },
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "GitHub GraphQL request failed." },
      { status: response.status },
    );
  }

  const payload = await response.json();

  if (payload.errors?.length || !payload.data?.user) {
    return NextResponse.json(
      { error: payload.errors?.[0]?.message ?? "GitHub user data unavailable." },
      { status: 502 },
    );
  }

  const pinnedAll = payload.data.user.pinnedItems.nodes.filter(Boolean);
  const pinnedSorted = [...pinnedAll]
    .sort((a: { updatedAt: string }, b: { updatedAt: string }) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  return NextResponse.json({
    pinned: pinnedSorted,
    repositories: payload.data.user.repositories.nodes.filter(Boolean),
  });
}
