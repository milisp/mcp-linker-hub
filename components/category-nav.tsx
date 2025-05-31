"use client";

interface CatProps {
  currentCategory: string;
  setCurrentCategory: (value: string) => void;
}

export function CategoryNav({ currentCategory, setCurrentCategory }: CatProps) {
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
    <section className="py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex flex-nowrap gap-2 sm:gap-4 pb-2 sm:justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCurrentCategory(cat.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 border border-white/20 backdrop-blur-md
                  ${currentCategory === cat.key 
                    ? "bg-white/40 text-white scale-105" 
                    : "bg-white/20 text-white hover:bg-white/30"}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
