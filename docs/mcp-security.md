# MCP metadata security gate

Use Cisco's open-source [MCP Scanner](https://github.com/cisco-ai-defense/mcp-scanner)
to inspect exported MCP metadata before approving a hosted server version.
This repository uses `StaticAnalyzer` with `YaraAnalyzer` only: no Cisco account,
LLM API key, live server connection, or server execution is required. The scanner
is pinned to `cisco-ai-mcp-scanner==4.8.4`, verified against
[PyPI](https://pypi.org/project/cisco-ai-mcp-scanner/4.8.4/) on 2026-09-30.

## Setup and run

Use Python 3.11.4 or newer (Python 3.13 recommended):

```sh
python3.13 -m venv .venv-mcp-security
. .venv-mcp-security/bin/activate
python -m pip install -r scripts/requirements-mcp-security.txt
python scripts/scan-mcp-security.py /path/to/tools.json /path/to/prompts.json --report /tmp/mcp-security-report.json
```

Installation needs network access. Scanning uses local YARA rules; the wrapper
disables LiteLLM's import-time remote model pricing lookup. It never starts an
MCP server, follows resource URIs, or sends snapshots to an external API.

Supply one exported JSON object per file, containing exactly one nonempty
`tools`, `prompts`, `resources`, or `contents` array. These are MCP `tools/list`,
`prompts/list`, `resources/list`, or textual `resources/read` snapshots, not the
Hub's `servers.json` catalog. For example:

```json
{
  "tools": [
    {
      "name": "add",
      "description": "Add two numbers.",
      "inputSchema": { "type": "object" }
    }
  ]
}
```

Each item must include scannable metadata or text. Binary-only resources need a
separate binary audit and cannot pass this gate. Export snapshots only from a
reviewed server in an isolated environment; fetching metadata from an arbitrary
stdio server can execute its code. Do not put credentials, authorization headers,
user content, private resource contents, or production tokens in snapshots.
Reports may contain snapshot text and finding evidence; handle them accordingly.

The command exits 0 only if every supplied snapshot is fully scanned with no
findings. Missing files, malformed or empty snapshots, skipped results, analyzer
errors, an unexpected scanner version, and findings return a nonzero exit code.
It overrides the upstream coordinator's exception suppression to fail closed.
The JSON report records scanner version, snapshot SHA-256 hashes, local rule
hashes, results, and any errors. Keep reports with the reviewed server's exact
source revision and deployed artifact digest. Rescan after metadata, code,
dependency, or scanner changes.

## Scope and hosting approval

A passing metadata report means no configured YARA rule matched the supplied
snapshot. It does **not** establish that a server is safe, cover an entire catalog,
or inspect implementation behavior, dependencies, hidden tools, prompt bodies
omitted from the snapshot, or future responses. No actual catalog server scan is
claimed by adding this workflow.

Before enabling a hosted server, also review its source and license, scan its
dependencies and secrets, verify the deployed artifact, and test runtime isolation.
Use a separate least-privilege upstream credential per service, controlled egress,
resource and request limits, per-user authorization and usage accounting, and
redacted logs. Keep upstream credentials server-side; never embed them in exported
metadata or issue them as client MCP credentials. A review records precisely
which artifact and snapshots were checked, rather than assigning a permanent
"safe" badge to a catalog entry.

The upstream [static scanning documentation](https://github.com/cisco-ai-defense/mcp-scanner/blob/main/docs/static-scanning.md)
describes the snapshot formats and explicitly limits this mode to supplied
metadata, not runtime behavior.
