import { callRkdService, type Env } from "../rkdClient";
import { createSuccessResponse, createErrorResponse } from "../types";
export default {
  name: "get_quote",
  description: "Get a real‑time quote for a security",
  inputSchema: {
    type: "object",
    properties: { ric: { type: "string" }, scope: { type: "string" } },
    required: ["ric"],
  },
  handler: async (input: any, env: Env) => {
    const body = {
      RetrieveItem_Request_3: {
        TrimResponse: false,
        ItemRequest: [
          {
            RequestKey: [{ Name: input.ric, NameType: "RIC" }],
            Scope: input.scope || "All",
          },
        ],
      },
    };

    try {
      const data = await callRkdService(
        env,
        "/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3",
        body
      );
      return createSuccessResponse("Retrieved quote", data);
    } catch (error) {
      return createErrorResponse(
        "Failed to retrieve quote",
        error instanceof Error ? { message: error.message } : error
      );
    }
  },
};
