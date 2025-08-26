import { describe, it, expect, vi } from "vitest";

const env = {
  RKD_BASE_URL: "https://example.com",
  RKD_APP_ID: "app",
  RKD_USERNAME: "user",
  RKD_PASSWORD: "pass",
};

describe("getRkdToken caching", () => {
  it("uses cached token when not near expiry", async () => {
    vi.resetModules();
    const { getRkdToken } = await import("../../src/rkdClient");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ CreateServiceToken_Response_1: { Token: "token-1", TokenExpiration: expires } }),
    });

    const t1 = await getRkdToken(env);
    const t2 = await getRkdToken(env);

    expect(t1).toBe("token-1");
    expect(t2).toBe("token-1");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("refreshes token when near expiry", async () => {
    vi.resetModules();
    const { getRkdToken } = await import("../../src/rkdClient");
    const expSoon = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const expLater = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ CreateServiceToken_Response_1: { Token: "token-1", TokenExpiration: expSoon } }),
    });
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ CreateServiceToken_Response_1: { Token: "token-2", TokenExpiration: expLater } }),
    });

    const t1 = await getRkdToken(env);
    const t2 = await getRkdToken(env);

    expect(t1).toBe("token-1");
    expect(t2).toBe("token-2");
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
