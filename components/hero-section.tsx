interface TermProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function Hero({ searchTerm, setSearchTerm }: TermProps) {
  // Hero section component
  // Includes the search input
  return (
    <section className="text-center py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            MCP Server Hub
          </span>
        </h1>
        <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Discover, share, and deploy Model Context Protocol servers for AI
          applications
        </p>
        <div className="max-w-xl mx-auto relative">
          <input
            type="text"
            className="w-full py-3 px-6 text-base border-none rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
            placeholder="Search servers, tools, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
