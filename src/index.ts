import OAuthProvider from "@cloudflare/workers-oauth-provider";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { GitHubHandler } from "./auth/github-handler";
import { registerAllTools } from "./tools/register-tools";
import { Props } from "./types";

export class MyMCP extends McpAgent<Env, Record<string, never>, Props> {
        server = new McpServer({
                name: "MCP Server",
                version: "1.0.0",
        });

        async init() {
                // Register all tools
                registerAllTools(this.server, this.env);
        }
}

export default new OAuthProvider({
        apiHandlers: {
                '/sse': MyMCP.serveSSE('/sse') as any,
                '/mcp': MyMCP.serve('/mcp') as any,
        },
        authorizeEndpoint: "/authorize",
        clientRegistrationEndpoint: "/register",
        defaultHandler: GitHubHandler as any,
        tokenEndpoint: "/token",
});
