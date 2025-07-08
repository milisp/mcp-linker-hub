import { ServerDetail, ServerListResponse, ServerResponse } from "@/types";
import axios from "axios";
import { api } from ".";

export async function fetchServer(
  qualified_name: string,
): Promise<ServerDetail> {
  const url = `/servers/@${qualified_name}`;
  try {
    // Try the main API first
    return await api.get<ServerDetail>(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });
  } catch (error) {
    // If failed, try to fetch README from GitHub if qualified_name is owner/repo
    // qualified_name should be in the form owner/repo
    if (/^[^/]+\/[^/]+$/.test(qualified_name)) {
      const [owner, repo] = qualified_name.split("/");
      try {
        // Fetch README using GitHub REST API
        const githubReadmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const readmeRes = await axios.get(githubReadmeUrl, {
          headers: { Accept: "application/vnd.github.v3.raw" },
        });
        // Compose a minimal ServerDetail object
        return {
          id: qualified_name,
          name: repo,
          qualifiedName: qualified_name,
          description:
            typeof readmeRes.data === "string"
              ? readmeRes.data.split(/\s+/).slice(0, 30).join(" ")
              : "",
          logoUrl: undefined,
          source: `https://github.com/${owner}/${repo}`,
          developer: owner,
          isOfficial: false,
          rating: 0,
          githubStars: 0,
          downloads: 0,
          views: 0,
          isFavorited: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          serverConfigs: [],
        } as ServerDetail;
      } catch (githubError) {
        // If GitHub also fails, throw the original error
        throw error;
      }
    } else {
      // If not a valid qualified_name, throw the original error
      throw error;
    }
  }
}

export async function fetchRecommendedServer(): Promise<ServerResponse[]> {
  const url = `/servers/recommended`;
  const response = await api.get<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  return response.servers;
}

export async function fetchOfficialServer(): Promise<ServerResponse[]> {
  const url = `/servers/recommendations/official`;
  const response = await api.get<ServerListResponse>(url, {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });
  console.log(response);
  return response.servers;
}

// Example of other potential server operations with appropriate HTTP methods
export async function createServer(serverData: any): Promise<ServerResponse> {
  const url = `/servers`;
  return api.post<ServerResponse>(url, serverData);
}

export async function updateServer(
  serverId: string,
  serverData: any,
): Promise<ServerResponse> {
  const url = `/servers/${serverId}`;
  return api.put<ServerResponse>(url, serverData);
}

export async function deleteServer(serverId: string): Promise<void> {
  const url = `/servers/${serverId}`;
  return api.delete<void>(url);
}
