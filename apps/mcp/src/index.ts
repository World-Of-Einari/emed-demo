import "dotenv/config";
import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./tools/index";

const PORT = Number(process.env.MCP_PORT ?? 3333);
const MCP_AUTH_TOKEN = (process.env.MCP_AUTH_TOKEN ?? "").trim();

const app = express();
app.use(express.json());

function requireAuth(req: express.Request, res: express.Response): boolean {
  if (!MCP_AUTH_TOKEN) return true;
  const auth = (req.header("authorization") ?? "").trim();
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : auth;
  if (token === MCP_AUTH_TOKEN) return true;
  res.status(401).send("Unauthorized");
  return false;
}

// Fresh McpServer + transport per request — required for stateless mode
app.post("/mcp", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const server = new McpServer({ name: "emed-mcp", version: "1.0.0" });
  try {
    registerTools(server);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error("POST /mcp failed:", err);
    if (!res.headersSent) res.status(500).send("MCP POST failed");
  } finally {
    await server.close();
  }
});

app.get("/mcp", (_req, res) => res.status(405).send("Method Not Allowed"));

app.listen(PORT, () => {
  console.log(`eMed MCP server listening on http://localhost:${PORT}/mcp`);
});
