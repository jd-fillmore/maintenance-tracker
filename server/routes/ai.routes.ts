import { Router } from "express";
import { queryAI } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// All AI routes require authentication
router.use(requireAuth);

// Query AI
router.post("/query", queryAI);

export default router;