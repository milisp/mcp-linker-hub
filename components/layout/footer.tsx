import { Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const doc_url = "https://api.mcp-linker.store/api/docs";

  function get_url(link: string) {
    if (link === "Contact") {
      return "https://github.com/milisp/mcp-linker/issues";
    } else if (link === "API" || link === "Docs") {
      return doc_url;
    } else {
      return `/${link.toLowerCase()}`;
    }
  }

  return (
    <footer className="bg-gray-800 text-white py-12 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-6">
          {["Docs", "API", "Privacy"].map((link) => (
            <Link
              key={link}
              href={get_url(link)}
              className="hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
          <a
            href="mailto:milisp@proton.me"
            className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
            title="Email us"
          >
            <Mail className="w-4 h-4" />
            <span className="underline">Contact</span>
          </a>
        </div>
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} MCP Linker Hub. Built for the AI
          community.
        </p>
      </div>
    </footer>
  );
}
