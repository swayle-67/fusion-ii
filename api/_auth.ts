import type { VercelRequest, VercelResponse } from "@vercel/node";

export function requireAdminAuth(req: VercelRequest, res: VercelResponse): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ status: "error", error: "Authentication credentials missing" });
    return false;
  }
  const token = authHeader.replace(/^bearer\s+/i, "").trim();
  const configured = process.env.ADMIN_PASSWORD || "";
  if (!configured || token !== configured) {
    res.status(403).json({ status: "error", error: "Access denied" });
    return false;
  }
  return true;
}