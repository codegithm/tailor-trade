// Vercel serverless proxy that forwards requests to the backend URL from env
export default async function handler(req: any, res: any) {
  const backend = process.env.VITE_BACKEND_URL;
  if (!backend) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Backend URL not configured on server." }));
    return;
  }

  const pathParts = Array.isArray(req.query.path)
    ? req.query.path
    : [req.query.path].filter(Boolean);
  const path = pathParts.join("/");
  const target = `${backend.replace(/\/$/, "")}/${path}`;

  try {
    const headers: Record<string, string> = {};
    for (const [k, v] of Object.entries(req.headers || {})) {
      if (v && typeof v === "string") headers[k] = v;
    }

    const fetchRes = await fetch(target, {
      method: req.method,
      headers: { ...headers, host: new URL(target).host },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : req.rawBody || req.body,
    });

    res.statusCode = fetchRes.status;
    fetchRes.headers.forEach((value, key) => res.setHeader(key, value));
    const buffer = await fetchRes.arrayBuffer();
    res.end(Buffer.from(buffer));
  } catch (err: any) {
    console.error("Proxy error:", err);
    res.statusCode = 502;
    res.end(JSON.stringify({ error: "Bad gateway" }));
  }
}
