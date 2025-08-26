export interface Env {
  RKD_BASE_URL: string;
  RKD_APP_ID: string;
  RKD_USERNAME: string;
  RKD_PASSWORD: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0; // epoch ms

function parseExpiration(response: any): number {
  const now = Date.now();
  const candidate =
    response?.TokenExpiration || response?.TokenExpiry || response?.Expiration || response?.Expires || response?.TokenExpires;
  if (typeof candidate === "string") {
    const parsed = Date.parse(candidate);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  const lifetime = response?.Lifetime ?? response?.ExpiresIn;
  if (typeof lifetime === "number" && !isNaN(lifetime)) {
    return now + lifetime * 1000;
  }
  // Fallback to 1 hour if expiry information missing
  return now + 60 * 60 * 1000;
}

export async function getRkdToken(env: Env): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt - now > 10 * 60 * 1000) {
    return cachedToken;
  }

  const payload = {
    CreateServiceToken_Request_1: {
      ApplicationID: env.RKD_APP_ID,
      Username: env.RKD_USERNAME,
      Password: env.RKD_PASSWORD,
    },
  };
  const res = await fetch(`${env.RKD_BASE_URL}/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1`, {
    method: "POST",
    headers: { "content-type": "application/json;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Token request failed with status ${res.status}`);
  }

  const json = (await res.json()) as any;
  const response = json?.CreateServiceToken_Response_1;
  const token = response?.Token;
  if (!token) {
    throw new Error("Token field missing in response");
  }

  cachedToken = token;
  tokenExpiresAt = parseExpiration(response);
  return token;
}

export async function callRkdService(env: Env, path: string, body: object): Promise<any> {
  const token = await getRkdToken(env);
  const res = await fetch(`${env.RKD_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=utf-8",
      "X-Trkd-Auth-Token": token,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`RKD service request failed with status ${res.status}`);
  }
  return res.json();
}
