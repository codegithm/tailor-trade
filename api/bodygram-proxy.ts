// Simple serverless proxy to fetch Bodygram scanner HTML and serve it under our origin.
// WARNING: This is a brittle workaround. Bodygram may rely on top-level origin, service workers,
// cookies or CSP that make this fail. Use only if Bodygram support confirms embedding isn't available.

export default async function handler(req: any, res: any) {
  try {
    const token =
      (req.query && req.query.token) ||
      req.query.token ||
      req.url?.match(/token=([^&]+)/)?.[1];
    const org =
      (req.query && req.query.org) ||
      req.query.org ||
      process.env.VITE_BODYGRAM_ORG_ID;

    if (!token || !org) {
      res.statusCode = 400;
      res.end("Missing token or org parameter");
      return;
    }

    const target = `https://platform.bodygram.com/en/${org}/scan?token=${encodeURIComponent(
      token
    )}&system=metric`;

    const fetchRes = await fetch(target, {
      headers: {
        // forward minimal headers to mimic a browser request
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!fetchRes.ok) {
      res.statusCode = fetchRes.status;
      res.end(`Upstream fetch failed: ${fetchRes.status}`);
      return;
    }

    let body = await fetchRes.text();

    // Remove any meta Content-Security-Policy tags to avoid blocking when served under our origin
    body = body.replace(
      /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
      ""
    );
    // Inject a base tag so relative assets load from the original origin
    if (!/\<base[^>]*href=/i.test(body)) {
      body = body.replace(
        /<head([^>]*)>/i,
        `<head$1><base href="https://platform.bodygram.com/">`
      );
    }

    // Set permissive headers so the iframe can access camera when served from our origin
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Allow camera for this document (self) — browsers interpret this header for feature usage
    res.setHeader("Permissions-Policy", "camera=(self), microphone=(self)");
    // Avoid sending any restrictive CSP/X-Frame options from upstream
    res.setHeader("X-Content-Type-Options", "nosniff");

    res.statusCode = 200;
    res.end(body);
  } catch (err: any) {
    console.error("bodygram-proxy error", err);
    res.statusCode = 500;
    res.end("Proxy error");
  }
}
