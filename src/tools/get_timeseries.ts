import { callRkdService } from "../rkdClient";
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
  handler: async (input, env) => {
    const body = {
      GetInterdayTimeSeries_Request_5: {
        Symbol: input.ric,
        StartDate: input.start,
        EndDate: input.end,
        Interval: input.interval || "Daily",
      },
    };
    return callRkdService(
      env,
      "/TimeSeries/TimeSeries.svc/REST/TimeSeries_1/GetInterdayTimeSeries_5",
      body
    );
  },
};
