import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Props } from "../types";
import { registerDatabaseTools } from "./database-tools";
import * as rkdTools from "./index";

/**
 * Register all MCP tools based on user permissions
 */
export function registerAllTools(server: McpServer, env: Env, props: Props) {
        // Register database tools
        registerDatabaseTools(server, env, props);

        for (const tool of Object.values(rkdTools)) {
                server.tool(
                        tool.name,
                        tool.description,
                        tool.inputSchema,
                        (input) => tool.handler(env, input),
                );
        }

        // Future tools can be registered here
        // registerOtherTools(server, env, props);
}