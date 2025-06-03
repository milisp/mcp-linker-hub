import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SubmitSection() {
  return (
    <section
      id="submit"
      className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white py-16 text-center rounded-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-4">Share Your MCP Server</h2>
        <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
          Built something amazing? Share it with the community and help others
          discover your MCP server.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="px-8 py-3 rounded-lg text-lg font-medium bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-md hover:shadow-lg"
          asChild
        >
          <Link href="/submit">Submit Your Server</Link>
        </Button>
      </div>
    </section>
  );
}
