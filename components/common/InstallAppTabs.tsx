import { Button } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import JsonToBadgeConverter from "./JsonToBadgeConverter";

interface InstallAppTabsProps {
  deeplink: string;
  configParam: string | null;
  autoSubmitParam: string;
  decodedConfig: any;
  decodeError: string;
}

export default function InstallAppTabs({
  deeplink,
  configParam,
  autoSubmitParam,
  decodedConfig,
  decodeError,
}: InstallAppTabsProps) {
  const searchParams = useSearchParams();
  const serverName = searchParams.get("name") ?? "";

  return (
    <Tabs defaultValue="open" className="w-full">
      <TabsList className="flex gap-2">
        <TabsTrigger className="w-full" value="open">
          Open
        </TabsTrigger>
        <TabsTrigger className="w-full" value="make">
          Make
        </TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        <div className="text-2xl font-bold text-gray-800">
          Add mcp server to selected mcp client
        </div>
        {/* Button to open deeplink in a new tab */}
        <Button
          onClick={() => window.open(deeplink, "_blank", "noopener,noreferrer")}
        >
          mcp-linker-add
        </Button>
        <div className="mb-4">
          <a
            href={deeplink}
            className="text-blue-600 hover:underline break-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {deeplink}
          </a>
        </div>
        {/* Show decoded configParam as JSON if available */}
        {serverName && configParam && (
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Decoded configParam</h3>
            {decodeError ? (
              <div className="text-red-600 font-medium">{decodeError}</div>
            ) : (
              <pre className="bg-gray-200 rounded p-2 text-sm overflow-x-auto">
                {JSON.stringify(decodedConfig, null, 2)}
              </pre>
            )}
          </div>
        )}
      </TabsContent>
      <TabsContent value="make">
        <JsonToBadgeConverter autoSubmitParam={autoSubmitParam} />
      </TabsContent>
    </Tabs>
  );
}
