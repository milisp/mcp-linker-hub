"use client";

import { Button } from "@/components/ui/button";
import { Download, Star } from "lucide-react";
import Link from "next/link";

import { ServerResponse } from "@/types";

interface ServerCardProps {
  server: ServerResponse;
}

export function ServerCard({ server }: ServerCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {server.name}
          </h3>
          <p className="text-sm text-gray-500">by {server.developer}</p>
        </div>
        <div className="flex space-x-3 text-sm text-gray-600 items-center">
          <span className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500" />{" "}
            {server.githubStars}
          </span>
          <span className="flex items-center">
            <Download className="w-4 h-4 mr-1 text-blue-500" />{" "}
            {server.downloads}
          </span>
        </div>
      </div>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed flex-grow">
        {server.description}
      </p>
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {server.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            onClick={() => {
              window.location.href = `mcp-linker://servers/${server.id}`;
            }}
          >
            Install
          </Button>
          <Link
            href={`/servers/${server.qualifiedName}`}
            className="hover:text-foreground transition-colors"
          >
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
              View Details
            </button>
          </Link>
        </div>
        <div className="text-xs text-gray-500 mt-2 sm:mt-0">
          {server.tools?.length || 0} tools
        </div>
      </div>
    </div>
  );
}
