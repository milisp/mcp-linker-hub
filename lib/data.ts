export const initialServers = [
  {
    id: "f08f2af6-5b37-400e-94e0-1fd753483de5",
    name: "blender",
    qualifiedName: "ahujasid/blender-mcp",
    description:
      "BlenderMCP connects Blender to Claude AI through the Model Context Protocol (MCP), allowing Claude to directly interact with and control Blender. This integration enables prompt assisted 3D modeling,...",
    source: "https://github.com/ahujasid/blender-mcp",
    developer: "ahujasid",
    isOfficial: false,
    rating: 0,
    githubStars: 11376,
    downloads: 0,
    views: 5,
    isFavorited: false,
    tags: [],
    tools: null,
    cat: "Aggregators",
    createdAt: "2025-05-26T03:14:56.087000Z",
    updatedAt: "2025-06-02T02:27:46.964000Z",
  },
  {
    id: "6b9c614e-9ef8-41f5-bdcf-4eba012fd4c2",
    name: "context7",
    qualifiedName: null,
    description:
      "Context7 MCP Server -- Up-to-date code documentation for LLMs and AI code editors",
    source: "https://github.com/upstash/context7",
    developer: "upstash",
    isOfficial: false,
    rating: 0,
    githubStars: 10233,
    downloads: 0,
    views: 0,
    isFavorited: false,
    tags: ["vibe-coding"],
    tools: null,
    cat: "Developer Tools",
    createdAt: "2025-06-02T23:07:42.400000Z",
    updatedAt: "2025-06-02T23:07:42.400000Z",
  },
];

export const cats = [
  "Sports",
  "Multimedia Process",
  "Monitoring",
  "Version Control",
  "Translation Services",
  "Travel & Transportation",
  "Cloud Platforms",
  "Data Science Tools",
  "Search & Data Extraction",
  "Databases",
  "Support & Service Management",
  "Embedded system",
  "Other Tools and Integrations",
  "File Systems",
  "Marketing",
  "Art & Culture",
  "Aggregators",
  "Browser Automation",
  "Code Execution",
  "Finance & Fintech",
  "Communication",
  "Knowledge & Memory",
  "Security",
  "Developer Tools",
  "Social Media",
  "Gaming",
  "Text-to-Speech",
  "Coding Agents",
  "Customer Data Platforms",
  "Command Line",
  "Location Services",
];

export const mockServer = {
  id: "1",
  name: "Neon MCP Server",
  developer: "Neon",
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
    {
      name: "merge_branch",
      description: "Merge a branch into the main branch",
    },
    { name: "delete_branch", description: "Delete a branch" },
    { name: "create_database", description: "Create a new database" },
    {
      name: "list_databases",
      description: "List all databases in a project",
    },
    { name: "delete_database", description: "Delete a database" },
  ],
};
