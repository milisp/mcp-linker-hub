"use client";

import { Button } from "@/components/ui/button";
import { ServerResponse } from "@/types";
import { Download, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ServerLinks({ server }: { server: ServerResponse }) {
  const [isInstalling, setIsInstalling] = useState(false);

  const platforms = [
    "Claude Desktop",
    "Cursor",
    "Windsurf",
    "Cline",
    "VS Code",
    "Neovim",
  ];
  const [currentPlatformIndex, setCurrentPlatformIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlatformIndex(
        (prevIndex) => (prevIndex + 1) % platforms.length,
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInstall = () => {
    const protocolUrl = `mcp-linker://servers/${server.id}`;
    const releaseUrl = `${server.source}/releases/latest`;

    const timeout = setTimeout(() => {
      // If user didn't switch apps, assume not installed
      window.open(releaseUrl, "_blank");
    }, 1500);

    // Try to open the protocol URL
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = protocolUrl;
    document.body.appendChild(iframe);

    // Clean up
    window.addEventListener(
      "blur",
      () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
      },
      { once: true },
    );
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Link href={server.source} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="gap-2">
          <Github className="h-4 w-4" />
          GitHub Repository
        </Button>
      </Link>
      <Button
        variant={isInstalling ? "default" : "outline"}
        className={`gap-2 relative overflow-hidden transition-all duration-300 transform hover:scale-105 ${
          isInstalling
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md animate-pulse"
            : "hover:shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 text-white border-none animate-gradient-x"
        } before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:animate-shimmer`}
        onClick={handleInstall}
        disabled={isInstalling}
        style={{
          backgroundSize: "200% 200%",
          animation: isInstalling
            ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
            : "gradient 3s ease infinite",
        }}
      >
        {isInstalling ? (
          <>
            <Download className="h-4 w-4 animate-spin" /> Installing...
          </>
        ) : (
          <>
            <Download className="h-4 w-4 animate-float" /> Install to{" "}
            {platforms[currentPlatformIndex]}
          </>
        )}
      </Button>
      {server.documentation && (
        <Link
          href={server.documentation}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Documentation
          </Button>
        </Link>
      )}
    </div>
  );
}
