import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as tools from "./index";

/**
 * Register all MCP tools
 */
export function registerAllTools(server: McpServer, env: Env) {
  for (const tool of Object.values(tools) as any[]) {
    const { name, handler, ...config } = tool as any;
    server.registerTool(name, config, (input) => handler(input, env));
  }
}
