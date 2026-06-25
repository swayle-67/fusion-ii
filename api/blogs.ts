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

  if (req.method === "GET") {
    const { data, error } = await supabase.from("blogs").select("*").order("date", { ascending: false });
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json(data);
  }

  if (req.method === "POST") {
    if (!requireAdminAuth(req, res)) return;
    const post = req.body;
    if (!post?.id) return res.status(400).json({ status: "error", error: "Missing blog id" });
    const { error } = await supabase.from("blogs").upsert(post);
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json({ status: "ok", post });
  }

  if (req.method === "DELETE") {
    if (!requireAdminAuth(req, res)) return;
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ status: "error", error: "Missing id" });
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.json({ status: "ok" });
  }

  res.status(405).json({ status: "error", error: "Method not allowed" });
}