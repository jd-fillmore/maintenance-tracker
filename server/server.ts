import express from "express";
import type { Request, Response, NextFunction } from "express"; // Import Express types
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import serviceRecordRoutes from "./routes/serviceRecord.routes";

const app = express();
app.use(express.json());
const PORT = 3000;

// ============================================
// EXTEND EXPRESS REQUEST TYPE
// ============================================
// Tell TypeScript that req.user exists on authenticated requests
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============================================
// PUBLIC ROUTES (No auth required)
// ============================================

app.use("/api/auth", toNodeHandler(auth));

// Get all service records for logged-in user
app.use("/api/service-records", serviceRecordRoutes);

// Export app for testing
export default app;

// Only start server if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
