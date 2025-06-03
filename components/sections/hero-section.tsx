interface TermProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function HeroSection({ searchTerm, setSearchTerm }: TermProps) {
  return (
    <section className="text-center py-8 sm:py-16 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="hidden text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
            MCP Server Hub
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4 sm:px-0">
          Discover, share, and deploy Model Context Protocol servers for AI
          applications
        </p>
        <div className="max-w-xl mx-auto relative px-4 sm:px-0">
          <div className="relative">
            <input
              type="text"
              className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-sm sm:text-base border-none rounded-full bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:ring-2 focus:ring-indigo-300 focus:outline-none"
              placeholder="Search servers, tools, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm?.trim().length > 0 &&
              searchTerm?.trim().length <= 2 && (
                <div className="absolute mt-2 w-full text-sm text-center text-yellow-100 bg-yellow-600/90 rounded-md py-1">
                  Please enter at least 3 characters to search
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}
