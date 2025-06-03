import { ServerResponse } from "@/app/types";
import { ServerHeader } from "./ServerHeader";
import { ServerLinks } from "./ServerLinks";
import { ServerTabs } from "./ServerTabs";
import { MetricsCard } from "./metrics-card";

export function ServerDetails({ server }: { server: ServerResponse }) {
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
        </div>
      </div>
    </div>
  );
}
