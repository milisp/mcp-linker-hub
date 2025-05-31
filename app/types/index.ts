export interface ServerInfo {
  id: string;
  name: string;
  author: string;
  description: string;
  category: string;
  tags: string[];
  githubStars: number;
  downloads: number;
  tools: string[];
  github: string;
}

export interface ServerGridType {
  servers: ServerInfo[];
}
