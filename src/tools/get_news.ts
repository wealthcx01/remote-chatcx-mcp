import { callRkdService } from "../rkdClient";
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
  handler: async (input, env) => {
    const body = {
      RetrieveHeadlineML_Request_1: {
        Query: input.query,
        MaxCount: input.maxCount || 25,
        ...(input.start && input.end
          ? { DateRange: { StartDate: input.start, EndDate: input.end } }
          : {}),
      },
    };
    return callRkdService(
      env,
      "/News/News.svc/REST/News_1/RetrieveHeadlineML_1",
      body
    );
  },
};
