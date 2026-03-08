import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerSaveLeadTool } from "./save-lead";

export function registerTools(mcp: McpServer) {
  registerSaveLeadTool(mcp);
}
