import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Props } from "../types";

/**
 * Register all MCP tools based on user permissions
 */
export function registerAllTools(server: McpServer, env: Env, props: Props) {
  // Future tools can be registered here
  // registerOtherTools(server, env, props);
}
