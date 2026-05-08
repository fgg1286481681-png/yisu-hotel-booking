import asyncio
import os
import sys
from pathlib import Path


USER_SITE = r"C:\Users\86153\AppData\Roaming\Python\Python313\site-packages"
if USER_SITE not in sys.path:
    sys.path.append(USER_SITE)

from mcp import ClientSession
from mcp.client.stdio import StdioServerParameters, stdio_client


WORKSPACE = Path(r"E:\yisu-hotel-booking")
PY_SCRIPTS = Path(r"C:\Users\86153\AppData\Roaming\Python\Python313\Scripts")
NPX_CMD = r"C:\Program Files\nodejs\npx.cmd"


SERVERS = [
    {
        "name": "filesystem",
        "command": NPX_CMD,
        "args": ["-y", "@modelcontextprotocol/server-filesystem", str(WORKSPACE)],
    },
    {
        "name": "memory",
        "command": NPX_CMD,
        "args": ["-y", "@modelcontextprotocol/server-memory"],
        "env": {
            "MEMORY_FILE_PATH": r"C:\Users\86153\.codex\memories\mcp-memory.json",
        },
    },
    {
        "name": "fetch",
        "command": str(PY_SCRIPTS / "mcp-server-fetch.exe"),
        "args": [],
        "env": {
            "PYTHONIOENCODING": "utf-8",
        },
    },
    {
        "name": "git_local",
        "command": str(PY_SCRIPTS / "mcp-server-git.exe"),
        "args": [],
    },
    {
        "name": "sequential_thinking",
        "command": NPX_CMD,
        "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
    },
    {
        "name": "time",
        "command": str(PY_SCRIPTS / "mcp-server-time.exe"),
        "args": [],
        "env": {
            "TZ": "Asia/Shanghai",
        },
    },
    {
        "name": "playwright",
        "command": NPX_CMD,
        "args": ["-y", "@playwright/mcp", "--headless"],
    },
]


async def verify_server(spec: dict[str, object]) -> tuple[str, bool, str]:
    env = os.environ.copy()
    env.update(spec.get("env", {}))
    params = StdioServerParameters(
        command=spec["command"],
        args=spec["args"],
        env=env,
    )

    try:
        async with asyncio.timeout(30):
            async with stdio_client(params) as (read_stream, write_stream):
                async with ClientSession(read_stream, write_stream) as session:
                    await session.initialize()
                    tools = await session.list_tools()
                    names = [tool.name for tool in tools.tools]
                    return spec["name"], True, ", ".join(names[:12]) or "(no tools)"
    except Exception as exc:
        return spec["name"], False, f"{type(exc).__name__}: {exc}"


async def main() -> int:
    results = [await verify_server(spec) for spec in SERVERS]
    failures = 0

    for name, ok, detail in results:
        status = "OK" if ok else "FAIL"
        print(f"[{status}] {name}: {detail}")
        if not ok:
            failures += 1

    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
