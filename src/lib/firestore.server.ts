// Minimal Firestore REST client for the Worker runtime (firebase-admin is Node-only).
type ServiceAccount = { project_id: string; client_email: string; private_key: string };

let cachedToken: { token: string; exp: number } | null = null;

function getServiceAccount(): ServiceAccount {
  const raw = process.env["FIREBASE_SERVICE_ACCOUNT"];
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT not configured");
  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.project_id || !sa.client_email || !sa.private_key)
    throw new Error("Invalid service account");
  return sa;
}

function b64url(data: ArrayBuffer | string) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(sa: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp - 60 > now) return cachedToken.token;
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/datastore",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const pem = sa.private_key
    .replace(/\\n/g, "\n")
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claim}`),
  );
  const jwt = `${header}.${claim}.${b64url(sig)}`;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: json.access_token, exp: now + json.expires_in };
  return json.access_token;
}

type Value = { stringValue: string } | { nullValue: null };
const str = (v: string): Value => ({ stringValue: v });
const nul: Value = { nullValue: null };

const memoryPedidos = new Map<
  string,
  { id: string; nome: string; email: string; pedido: string; criadoEm: string }
>();

/** Creates pedidos/{id}. Returns "created" or "exists" (idempotent retry). */
export async function createPedido(
  id: string,
  data: { nome: string; email: string; pedido: string },
) {
  if (!process.env["FIREBASE_SERVICE_ACCOUNT"]) {
    console.warn("[AI Studio] FIREBASE_SERVICE_ACCOUNT not configured — storing pedido in memory");
    if (memoryPedidos.has(id)) return "exists" as const;
    memoryPedidos.set(id, { id, ...data, criadoEm: new Date().toISOString() });
    return "created" as const;
  }
  const sa = getServiceAccount();
  const token = await getAccessToken(sa);
  const db = `projects/${sa.project_id}/databases/(default)/documents`;
  const docName = `${db}/pedidos/${id}`;
  const res = await fetch(`https://firestore.googleapis.com/v1/${db}:commit`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: docName,
            fields: {
              id: str(id),
              nome: str(data.nome),
              email: str(data.email),
              pedido: str(data.pedido),
              estado: str("Recebido"),
              interpretacaoIA: nul,
              informacaoEmFalta: nul,
              motivoRevisao: nul,
              propostaId: nul,
              erroProcessamento: nul,
            },
          },
          currentDocument: { exists: false },
          updateTransforms: [
            { fieldPath: "criadoEm", setToServerValue: "REQUEST_TIME" },
            { fieldPath: "atualizadoEm", setToServerValue: "REQUEST_TIME" },
          ],
        },
      ],
    }),
  });
  if (res.ok) return "created" as const;
  const body = await res.text();
  if (res.status === 409 || body.includes("ALREADY_EXISTS")) return "exists" as const;
  throw new Error(`Firestore write failed: ${res.status} ${body}`);
}
