"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCategories } from "@/hooks/useCategories";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CatProps {
  currentCategory: string;
  setCurrentCategory: (value: string) => void;
}

export function CategoryNav({ currentCategory, setCurrentCategory }: CatProps) {
  const { categories } = useCategories();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  const visibleCategories = isMobile
    ? categories
    : isExpanded
      ? categories
      : categories.slice(0, 5);

  return (
    <section className="py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex sm:flex-wrap flex-nowrap gap-2 sm:gap-4 pb-2 sm:justify-center min-w-max sm:min-w-0">
            {visibleCategories.map((cat: string) => (
              <button
                key={cat}
                onClick={() => setCurrentCategory(cat)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 border border-white/20 backdrop-blur-md
                    ${
                      currentCategory === cat
                        ? "bg-white/40 text-white scale-105"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
              >
                {cat}
              </button>
            ))}
            {!isMobile && categories.length > 5 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 border border-white/20 backdrop-blur-md bg-white/20 text-white hover:bg-white/30 items-center gap-1"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
