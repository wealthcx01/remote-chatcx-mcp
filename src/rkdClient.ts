export async function getRkdToken(env: any): Promise<string> {
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
  const json = await res.json();
  return json.CreateServiceToken_Response_1.Token;
}

export async function callRkdService(
  env: any,
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
  return res.json();
}
