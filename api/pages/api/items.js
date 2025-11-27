// pages/api/items.js
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === "GET") {
    const items = await db.collection("items").find({}).limit(50).toArray();
    return res.status(200).json(items);
  }

  if (req.method === "POST") {
    const body = req.body;
    const result = await db.collection("items").insertOne(body);
    return res.status(201).json(result);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
