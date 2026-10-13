// Subset of the official MCP server.json format, and the client config
// derivation the desktop app uses. Keep registryServerToConfigs in step with
// mcp-linker/src/lib/registry/toConfigs.ts so the site shows what the app adds.
// Schema: https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json

export interface RegistryInput {
  value?: string;
  default?: string;
  description?: string;
  isRequired?: boolean;
  isSecret?: boolean;
  placeholder?: string;
}

export interface RegistryKeyValueInput extends RegistryInput {
  name: string;
}

export type RegistryArgument = RegistryInput & {
  type: "positional" | "named";
  name?: string;
  valueHint?: string;
};

export interface RegistryTransport {
  type: "stdio" | "sse" | "streamable-http";
  url?: string;
  headers?: RegistryKeyValueInput[];
}

export interface RegistryPackage {
  registryType: string;
  identifier: string;
  version?: string;
  runtimeHint?: string;
  runtimeArguments?: RegistryArgument[];
  packageArguments?: RegistryArgument[];
  environmentVariables?: RegistryKeyValueInput[];
  transport?: RegistryTransport;
}

export interface RegistryServer {
  name: string;
  title?: string;
  description: string;
  version: string;
  websiteUrl?: string;
  repository?: { url: string };
  icons?: { src: string; mimeType?: string; theme?: "light" | "dark" }[];
  packages?: RegistryPackage[];
  remotes?: RegistryTransport[];
  _meta?: Record<string, unknown>;
}

export type ClientConfig =
  | {
      type: "stdio";
      command: string;
      args: string[];
      env?: Record<string, string>;
    }
  | { type: "http" | "sse"; url: string; headers?: Record<string, string> };

// Default runtime command per package registry, used when runtimeHint is absent.
const RUNTIME_BY_REGISTRY: Record<string, string> = {
  npm: "npx",
  pypi: "uvx",
  oci: "docker",
  nuget: "dnx",
};

function versionedIdentifier(pkg: RegistryPackage): string {
  if (!pkg.version) return pkg.identifier;
  switch (pkg.registryType) {
    case "pypi":
      return `${pkg.identifier}==${pkg.version}`;
    case "oci":
      return `${pkg.identifier}:${pkg.version}`;
    default:
      return `${pkg.identifier}@${pkg.version}`;
  }
}

// A value the user still has to fill in is rendered as a placeholder.
function inputValue(input: RegistryArgument | RegistryKeyValueInput): string {
  return (
    input.value ??
    input.default ??
    `<${input.name || ("valueHint" in input && input.valueHint) || "value"}>`
  );
}

function argsToStrings(args: RegistryArgument[] = []): string[] {
  return args.flatMap((arg) => {
    if (arg.type === "named" && arg.name) {
      const value = arg.value ?? arg.default;
      return value ? [arg.name, value] : [arg.name];
    }
    return [inputValue(arg)];
  });
}

function remoteToConfig(transport: RegistryTransport): ClientConfig | null {
  if (!transport.url) return null;
  return {
    type: transport.type === "sse" ? "sse" : "http",
    url: transport.url,
    headers: transport.headers?.length
      ? Object.fromEntries(
          transport.headers.map((h) => [h.name, inputValue(h)]),
        )
      : undefined,
  };
}

function packageToConfig(pkg: RegistryPackage): ClientConfig | null {
  if (pkg.transport && pkg.transport.type !== "stdio") {
    return remoteToConfig(pkg.transport);
  }
  // mcpb bundles are a downloadable archive, not a runnable command.
  if (pkg.registryType === "mcpb") return null;

  const command =
    pkg.runtimeHint ?? RUNTIME_BY_REGISTRY[pkg.registryType] ?? pkg.identifier;
  const args = argsToStrings(pkg.runtimeArguments);
  const env = Object.fromEntries(
    (pkg.environmentVariables ?? []).map((v) => [v.name, inputValue(v)]),
  );

  if (command === "npx") {
    args.unshift("-y");
    args.push(versionedIdentifier(pkg));
  } else if (command === "docker") {
    args.push("run", "-i", "--rm");
    for (const name of Object.keys(env)) args.push("-e", name);
    args.push(versionedIdentifier(pkg));
  } else if (command !== pkg.identifier) {
    args.push(versionedIdentifier(pkg));
  }
  args.push(...argsToStrings(pkg.packageArguments));

  return Object.keys(env).length
    ? { type: "stdio", command, args, env }
    : { type: "stdio", command, args };
}

/** Local packages first, then remote endpoints. */
export function registryServerToConfigs(
  server: RegistryServer,
): ClientConfig[] {
  return [
    ...(server.packages ?? []).map(packageToConfig),
    ...(server.remotes ?? []).map(remoteToConfig),
  ].filter((config): config is ClientConfig => config !== null);
}
