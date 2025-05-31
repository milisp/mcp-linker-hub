export function FeaturesSection() {
  return (
    <section className="px-6 py-8 max-w-6xl mx-auto">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🚀", title: "One-click Setup", desc: "Add MCP servers instantly" },
            { icon: "⚙️", title: "Server Management", desc: "Add, delete, and favorite servers" },
            { icon: "🎯", title: "No Technical Skills", desc: "User-friendly interface for everyone" },
            { icon: "🌍", title: "Open Source", desc: "Community-driven development" },
            { icon: "⭐", title: "Favorites & History", desc: "Quick access to your preferred servers" },
            { icon: "💻", title: "Cross-platform", desc: "macOS, Windows, Linux support" },
            { icon: "🌐", title: "Multi-language", desc: "Localized user interface" },
            { icon: "📦", title: "Easy Install", desc: "uvx or npx installation support" }
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
