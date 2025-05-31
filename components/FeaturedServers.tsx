import { ServerGrid } from "@/components/server-grid";
import { initialServers } from "@/lib/data";
import Link from "next/link";

export default function FeaturedServers() {
  return (
    <section className="px-6 py-12 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🔥 Featured Servers
      </h2>
      <ServerGrid servers={initialServers} />

      <div className="text-center mt-8">
        <Link href="/servers">
          <button className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            more →
          </button>
        </Link>
      </div>
    </section>
  );
}
