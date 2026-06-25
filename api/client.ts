import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { requireAdminAuth } from "./_auth";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  // POST — save a new booking (called by Cloudflare Worker)
  if (req.method === "POST") {
    const { name, phone, slot, notes } = req.body;
    if (!name || !phone || !slot) {
      return res.status(400).json({ status: "error", error: "name, phone and slot are required" });
    }
    const { data, error } = await supabase.from("clients").insert({ name, phone, slot, notes: notes || "" });
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json({ status: "ok", data });
  }

  // GET — view all bookings (admin only)
  if (req.method === "GET") {
    if (!requireAdminAuth(req, res)) return;
    const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json(data);
  }

  // DELETE — remove a booking (admin only)
  if (req.method === "DELETE") {
    if (!requireAdminAuth(req, res)) return;
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: "error", error: "Missing id" });
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json({ status: "ok" });
  }

  res.status(405).json({ status: "error", error: "Method not allowed" });
}