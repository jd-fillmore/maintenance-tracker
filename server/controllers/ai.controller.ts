import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const queryAI = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const userId = req.user!.id;

    // Use OpenAI to interpret the query
    const prompt = `
You are an AI assistant for a maintenance tracker app. The user is asking a question about their service records.
Interpret the following query and respond with a JSON object containing:
- "type": one of ["total_hours", "last_service", "service_count", "average_time", "equipment_list"]
- "equipmentId": if specified in query, else null
- "dateFrom": if date range specified, else null
- "dateTo": if date range specified, else null

Query: "${query}"

Respond only with valid JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const interpretation = JSON.parse(completion.choices[0].message.content || "{}");

    let result: any = {};

    switch (interpretation.type) {
      case "total_hours":
        const totalHours = await prisma.serviceRecord.aggregate({
          where: {
            userId,
            ...(interpretation.equipmentId && { equipmentId: interpretation.equipmentId }),
            ...(interpretation.dateFrom && { date: { gte: new Date(interpretation.dateFrom) } }),
            ...(interpretation.dateTo && { date: { lte: new Date(interpretation.dateTo) } }),
          },
          _sum: { serviceTime: true },
        });
        result = { totalHours: totalHours._sum.serviceTime || 0 };
        break;

      case "last_service":
        const lastService = await prisma.serviceRecord.findFirst({
          where: {
            userId,
            ...(interpretation.equipmentId && { equipmentId: interpretation.equipmentId }),
          },
          orderBy: { date: "desc" },
        });
        result = lastService ? { lastService: lastService.date, equipmentId: lastService.equipmentId } : { message: "No services found" };
        break;

      case "service_count":
        const count = await prisma.serviceRecord.count({
          where: {
            userId,
            ...(interpretation.equipmentId && { equipmentId: interpretation.equipmentId }),
            ...(interpretation.dateFrom && { date: { gte: new Date(interpretation.dateFrom) } }),
            ...(interpretation.dateTo && { date: { lte: new Date(interpretation.dateTo) } }),
          },
        });
        result = { serviceCount: count };
        break;

      case "average_time":
        const avg = await prisma.serviceRecord.aggregate({
          where: {
            userId,
            ...(interpretation.equipmentId && { equipmentId: interpretation.equipmentId }),
            ...(interpretation.dateFrom && { date: { gte: new Date(interpretation.dateFrom) } }),
            ...(interpretation.dateTo && { date: { lte: new Date(interpretation.dateTo) } }),
          },
          _avg: { serviceTime: true },
        });
        result = { averageTime: avg._avg.serviceTime || 0 };
        break;

      case "equipment_list":
        const equipments = await prisma.serviceRecord.findMany({
          where: { userId },
          select: { equipmentId: true, equipmentType: true },
          distinct: ["equipmentId"],
        });
        result = { equipments };
        break;

      default:
        result = { message: "Sorry, I couldn't understand that query." };
    }

    res.json({ query, interpretation, result });
  } catch (error: any) {
    console.error("AI query error:", error);

    // Handle OpenAI quota/rate limit errors
    if (error.status === 429 || error.code === 'insufficient_quota') {
      return res.json({
        query,
        error: "🚫 AI Assistant Temporarily Unavailable\n\nThe AI service has reached its monthly usage limit. This is a normal limitation of the free tier.\n\nTo restore AI functionality:\n• Visit https://platform.openai.com/account/billing\n• Add a payment method to your account\n• Purchase API credits\n\nThe rest of the maintenance tracker works perfectly without AI assistance."
      });
    }

    res.status(500).json({ error: "Failed to process AI query" });
  }
};