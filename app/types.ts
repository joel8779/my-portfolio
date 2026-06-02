export type Repository = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  stargazerCount: number;
  primaryLanguage: {
    name: string;
    color: string | null;
  } | null;
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
  pushedAt: string | null;
  isFork: boolean;
};

export type GitHubPortfolioData = {
  pinned: Repository[];
  repositories: Repository[];
};
