import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 text-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-6 mb-6">
          {["Docs", "API", "Contact", "Privacy"].map((link) => (
            <Link
              key={link}
              href={`/${link.toLowerCase()}`}
              className="hover:text-foreground transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} MCP Linker Hub. Built for the AI
          community.
        </p>
      </div>
    </footer>
  );
}
