import { useState } from "react";

export function useServersFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("all");

  return {
    searchTerm,
    setSearchTerm,
    currentCategory,
    setCurrentCategory,
  };
}
