import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ServerDetails } from "@/components/server-details"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default function ServerPage({ params }: ServerPageProps) {
  // In a real app, you would fetch the server details from your database
  // For now, we'll use mock data
  const mockServer = {
    id: params.id,
    name: "Neon MCP Server",
    author: "Neon",
    description:
      "The Neon MCP Server enables natural language interaction with Neon Postgres databases, offering a simplified way to perform database management tasks. You can perform actions such as creating new Neon projects and databases, managing branches, executing SQL queries, and making schema changes, all through conversational requests. Features like branch-based migrations contribute to safer schema modifications.",
    longDescription: `
      ## Overview
      
      The Neon MCP Server enables natural language interaction with Neon Postgres databases, offering a simplified way to perform database management tasks. You can perform actions such as creating new Neon projects and databases, managing branches, executing SQL queries, and making schema changes, all through conversational requests.
      
      ## Features
      
      - **Natural Language Interaction**: Communicate with your database using plain English
      - **Project Management**: Create, list, and manage Neon projects
      - **Database Operations**: Execute SQL queries, modify schemas, and manage data
      - **Branch-Based Migrations**: Safely test schema changes in isolated branches
      
      ## Example Interactions
      
      - **List projects:** "List my Neon projects"
      - **Create a new project:** "Create a Neon project named 'my-test-project'"
      - **List tables in a database:** "What tables are in the database 'my-database' in project 'my-project'?"
      - **Add a column to a table:** "Add a column 'email' of type VARCHAR to the 'users' table in database 'main' of project 'my-project'"
      - **Run a query:** "Show me the first 10 rows from the 'users' table in database 'my-database'"
    `,
    tags: ["database", "postgres", "sql"],
    githubStars: 1200,
    downloads: 45000,
    toolCount: 12,
    imageUrl: "/placeholder.svg?height=100&width=100",
    githubUrl: "https://github.com/neondatabase/mcp-server",
    documentation: "https://neon.tech/docs/ai/neon-mcp-server",
    createdAt: "2023-09-15T00:00:00.000Z",
    updatedAt: "2024-05-10T00:00:00.000Z",
    tools: [
      { name: "list_projects", description: "List all Neon projects" },
      { name: "create_project", description: "Create a new Neon project" },
      { name: "list_tables", description: "List tables in a database" },
      { name: "add_column", description: "Add a column to a table" },
      { name: "run_query", description: "Execute a SQL query" },
      { name: "create_branch", description: "Create a new branch" },
      { name: "list_branches", description: "List all branches in a project" },
      { name: "merge_branch", description: "Merge a branch into the main branch" },
      { name: "delete_branch", description: "Delete a branch" },
      { name: "create_database", description: "Create a new database" },
      { name: "list_databases", description: "List all databases in a project" },
      { name: "delete_database", description: "Delete a database" },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-background/80">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="relative z-10">
        <Navbar />
        <ServerDetails server={mockServer} />
        <Footer />
      </div>
    </div>
  )
}
