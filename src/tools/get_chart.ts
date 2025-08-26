import { callRkdService } from "../rkdClient";
export default {
  name: "get_chart",
  description: "Get a chart image for a security",
  inputSchema: {
    type: "object",
    properties: {
      ric: { type: "string" },
      chartType: { type: "string", enum: ["Line","Candlestick","Bar"] },
      period: { type: "string", enum: ["1M","3M","6M","1Y","2Y"] },
      width: { type: "number" },
      height: { type: "number" },
    },
    required: ["ric"],
  },
  handler: async (input, env) => {
    const body = {
      GetChart_Request_2: {
        Symbol: input.ric,
        ChartType: input.chartType || "Line",
        Period: input.period || "1Y",
        Width: input.width || 600,
        Height: input.height || 400,
      },
    };
    return callRkdService(
      env,
      "/Charts/Charts.svc/REST/Charts_1/GetChart_2",
      body
    );
  },
};
