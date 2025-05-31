export function QuickStartGuide() {
  return (
    <section className="px-6 py-8 max-w-4xl mx-auto">
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Select Server", desc: "Choose an MCP server from our curated list", icon: "🔍" },
            { step: "2", title: "View Config", desc: "Click Get to preview the server configuration", icon: "👁️" },
            { step: "3", title: "Add Integration", desc: "Click Add to integrate with your MCP client", icon: "➕" },
            { step: "4", title: "Manage", desc: "Access from favorites or history panel", icon: "⚡" }
          ].map((step, index) => (
            <div key={index} className="relative">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 text-center hover:shadow-md transition-all duration-300">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.step}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{step.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-2xl text-gray-300 dark:text-gray-600">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
