export function NewsList() {
  return (
    <section className="px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="text-2xl">📢</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest News</h2>
        </div>
        <div className="space-y-3">
          {[
            { date: "2025-05-29", content: "Sync favorite servers to the cloud.", isNew: true },
            { date: "2025-05-22", content: "You can add your servers for other people, server list sort by more choice" },
            { date: "2025-05-19", content: "Server list sort by github stars" },
            { date: "2025-05-16", content: "Online MCP servers store preview — over 600 servers" },
            { date: "2025-05-08", content: "Support adding custom servers" }
          ].map((news, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
              <span className="text-sm font-mono text-blue-600 dark:text-blue-400 whitespace-nowrap">
                {news.date}
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {news.content}
                {news.isNew && (
                  <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full">
                    NEW
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
