"use client";

interface CatProps {
  currentCategory: string;
  setCurrentCategory: (value: string) => void;
}

export function CategoryNav({ currentCategory, setCurrentCategory }: CatProps) {
  // Categories section component
  // Allows filtering by category
  const categories = [
    { key: "all", name: "All" },
    { key: "filesystem", name: "File System" },
    { key: "database", name: "Database" },
    { key: "api", name: "API Integration" },
    { key: "devtools", name: "Dev Tools" },
    { key: "system", name: "System" },
    { key: "ai", name: "AI/ML" },
  ];

  return (
    <section className="py-8 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCurrentCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-white/20 backdrop-blur-md
                                ${currentCategory === cat.key ? "bg-white/40 text-white scale-105" : "bg-white/20 text-white hover:bg-white/30"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
