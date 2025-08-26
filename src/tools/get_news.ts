import { callRkdService, type Env } from "../rkdClient";
import { createSuccessResponse, createErrorResponse } from "../types";
export default {
  name: "get_news",
  description: "Retrieve news headlines",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      maxCount: { type: "number" },
      start: { type: "string" },
      end: { type: "string" },
    },
    required: ["query"],
  },
  handler: async (input: any, env: Env) => {
    const body = {
      RetrieveHeadlineML_Request_1: {
        Query: input.query,
        MaxCount: input.maxCount || 25,
        ...(input.start && input.end
          ? { DateRange: { StartDate: input.start, EndDate: input.end } }
          : {}),
      },
    };

    try {
      const data = await callRkdService(
        env,
        "/News/News.svc/REST/News_1/RetrieveHeadlineML_1",
        body
      );
      return createSuccessResponse("Retrieved news headlines", data);
    } catch (error) {
      return createErrorResponse(
        "Failed to retrieve news headlines",
        error instanceof Error ? { message: error.message } : error
      );
    }
  },
};
