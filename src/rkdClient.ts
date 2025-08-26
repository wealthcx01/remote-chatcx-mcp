export interface Env {
  RKD_BASE_URL: string;
  RKD_APP_ID: string;
  RKD_USERNAME: string;
  RKD_PASSWORD: string;
}

export async function getRkdToken(env: Env): Promise<string> {
  const payload = {
    CreateServiceToken_Request_1: {
      ApplicationID: env.RKD_APP_ID,
      Username: env.RKD_USERNAME,
      Password: env.RKD_PASSWORD,
    },
  };
  const res = await fetch(
    `${env.RKD_BASE_URL}/TokenManagement/TokenManagement.svc/REST/Anonymous/TokenManagement_1/CreateServiceToken_1`,
    {
      method: "POST",
      headers: { "content-type": "application/json;charset=utf-8" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    throw new Error(`Token request failed with status ${res.status}`);
  }

  const json = (await res.json()) as any;
  const token = json?.CreateServiceToken_Response_1?.Token;
  if (!token) {
    throw new Error("Token field missing in response");
  }
  return token;
}

export async function callRkdService(
  env: Env,
  path: string,
  body: object
): Promise<any> {
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
