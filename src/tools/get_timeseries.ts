import { callRkdService, type Env } from "../rkdClient";
import { createSuccessResponse, createErrorResponse } from "../types";
export default {
  name: "get_timeseries",
  description: "Get historical price data",
  inputSchema: {
    type: "object",
    properties: {
      ric: { type: "string" },
      start: { type: "string" },
      end: { type: "string" },
      interval: { type: "string", enum: ["Daily","Weekly","Monthly"] },
    },
    required: ["ric","start","end"],
  },
  handler: async (input: any, env: Env) => {
    const body = {
      GetInterdayTimeSeries_Request_5: {
        Symbol: input.ric,
        StartDate: input.start,
        EndDate: input.end,
        Interval: input.interval || "Daily",
      },
    };

    try {
      const data = await callRkdService(
        env,
        "/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetInterdayTimeSeries_5",
        body
      );
      return createSuccessResponse("Retrieved time series data", data);
    } catch (error) {
      return createErrorResponse(
        "Failed to retrieve time series data",
        error instanceof Error ? { message: error.message } : error
      );
    }
  },
};
