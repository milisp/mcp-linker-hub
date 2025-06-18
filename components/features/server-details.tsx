import { ServerDetail } from "@/types";
import { ServerHeader } from "./ServerHeader";
import { ServerLinks } from "./ServerLinks";
import { ServerTabs } from "./ServerTabs";
import { MetricsCard } from "./metrics-card";

export function ServerDetails({ server }: { server: ServerDetail }) {
  return (
    <div className="container py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ServerHeader server={server} />
          <p className="text-lg">{server.description}</p>
          <ServerLinks server={server} />
          <ServerTabs server={server} />
        </div>
        <div className="space-y-6">
          <MetricsCard server={server} />
          {server.serverConfigs && server.serverConfigs.length > 0 && (
            <div className="bg-card rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-3">
                Server Configurations
              </h3>
              {server.serverConfigs.map((config) => (
                <div key={config.id} className="mb-4 last:mb-0">
                  <div className="space-y-2">
                    {config.configItems.map((item, index) => (
                      <div key={index} className="bg-muted rounded p-2">
                        <pre>
                          {JSON.stringify({ [server.name]: item }, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
