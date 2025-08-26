import { callRkdService } from "../rkdClient";
export default {
  name: "get_quote",
  description: "Get a real‑time quote for a security",
  inputSchema: {
    type: "object",
    properties: { ric: { type: "string" }, scope: { type: "string" } },
    required: ["ric"],
  },
  handler: async (input, env) => {
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
    return callRkdService(
      env,
      "/Quotes/Quotes.svc/REST/Quotes_1/RetrieveItem_3",
      body
    );
  },
};
