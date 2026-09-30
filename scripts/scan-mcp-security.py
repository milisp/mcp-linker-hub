#!/usr/bin/env python3
"""Scan exported MCP metadata locally; never launch a server or call an API."""

import argparse
import asyncio
import hashlib
import importlib.metadata
import json
import os
from datetime import datetime, timezone
from pathlib import Path

SCANNER_VERSION = "4.8.4"


def serialize(value):
    if value.__class__.__name__ == "SecurityFinding":
        return {key: getattr(value, key) for key in
                ("severity", "summary", "analyzer", "threat_category", "details", "mcp_taxonomy")}
    if hasattr(value, "model_dump"):
        return value.model_dump(mode="json")
    if hasattr(value, "value"):
        return value.value
    raise TypeError(f"Unsupported report value: {type(value).__name__}")


async def scan(paths, report):
    # mcpscanner imports LiteLLM even for YARA. Disable its import-time remote
    # pricing fetch so this workflow stays offline after dependency installation.
    os.environ["LITELLM_LOCAL_MODEL_COST_MAP"] = "True"
    from mcpscanner.core.analyzers.static_analyzer import StaticAnalyzer
    from mcpscanner.core.analyzers.yara_analyzer import YaraAnalyzer

    # Upstream StaticAnalyzer catches analyzer exceptions and can return a safe
    # result. Override that coordinator so any YARA failure blocks this gate.
    class StrictStaticAnalyzer(StaticAnalyzer):
        async def _analyze_content(self, content, context=None):
            self.calls += 1
            return await self.analyzers[0].analyze(content, context)

    analyzer = StrictStaticAnalyzer(analyzers=[YaraAnalyzer()])
    analyzer.calls = 0
    report["rules"] = [{"name": rule.name, "sha256": hashlib.sha256(rule.read_bytes()).hexdigest()}
                       for rule in sorted(analyzer.analyzers[0]._rules_dir.iterdir(), key=lambda rule: rule.name)
                       if rule.name.endswith((".yar", ".yara"))]
    for path in paths:
        evidence = {"path": str(path), "status": "error"}
        report["snapshots"].append(evidence)
        try:
            raw = path.read_bytes()
            evidence["sha256"] = hashlib.sha256(raw).hexdigest()
            data = json.loads(raw)
            if not isinstance(data, dict):
                raise ValueError("Snapshot must be a JSON object")
            kinds = [key for key in ("tools", "prompts", "resources", "contents") if key in data]
            if len(kinds) != 1:
                raise ValueError("Provide exactly one tools, prompts, resources, or contents array per snapshot")
            kind = kinds[0]
            items = data[kind]
            if not isinstance(items, list) or not items or any(not isinstance(item, dict) for item in items):
                raise ValueError("Snapshot array must contain at least one object")
            # Require actual scan content, not just names/URIs. Empty descriptions
            # otherwise produce completed results without invoking an analyzer.
            for item in items:
                content_keys = {"tools": ("description", "inputSchema"), "prompts": ("description", "arguments"),
                                "resources": ("description", "text", "content"), "contents": ("text",)}[kind]
                if not any(item.get(key) for key in content_keys):
                    raise ValueError("Every item must contain nonempty scannable metadata or text")
            evidence["kind"] = kind
            before = analyzer.calls
            method = getattr(analyzer, f"scan_{'resources' if kind == 'contents' else kind}_file")
            results = await method(path)
            evidence["results"] = results
            if path.read_bytes() != raw:
                raise ValueError("Snapshot changed during scanning; discard this report and rerun")
            expected = len({item.get("uri") for item in items}) if kind == "contents" else len(items)
            if len(results) != expected or analyzer.calls == before:
                raise ValueError("Scanner returned incomplete or empty coverage")
            if any(result.get("status") != "completed" or not result.get("analyzers")
                   or not isinstance(result.get("findings"), list) or not isinstance(result.get("is_safe"), bool)
                   for result in results):
                raise ValueError("Scanner returned skipped, failed, or invalid results")
            evidence["status"] = "findings" if any(result["findings"] or not result["is_safe"] for result in results) else "passed"
        except Exception as error:
            evidence["status"] = "error"
            evidence["error"] = f"{type(error).__name__}: {error}"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("snapshots", nargs="+", type=Path)
    parser.add_argument("--report", type=Path, default=Path("mcp-security-report.json"))
    args = parser.parse_args()
    report = {"created_at": datetime.now(timezone.utc).isoformat(), "scanner": "cisco-ai-mcp-scanner",
              "required_version": SCANNER_VERSION, "analyzers": ["YARA"], "scope": "exported MCP metadata only",
              "snapshots": [], "status": "error"}
    try:
        version = importlib.metadata.version("cisco-ai-mcp-scanner")
        report["installed_version"] = version
        if version != SCANNER_VERSION:
            raise ValueError(f"Expected scanner {SCANNER_VERSION}; installed {version}")
        asyncio.run(scan(args.snapshots, report))
        report["status"] = "passed" if all(item["status"] == "passed" for item in report["snapshots"]) else "blocked"
    except Exception as error:
        report["error"] = f"{type(error).__name__}: {error}"
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2, default=serialize) + "\n", encoding="utf-8")
    print(f"MCP metadata scan: {report['status']}; report: {args.report}")
    return 0 if report["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
