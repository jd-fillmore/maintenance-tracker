import { Router } from "express";
import {
  getAllRecords,
  getSingleRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../controllers/serviceRecord.controller";

import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", requireAuth, getAllRecords);
router.get("/:id", requireAuth, getSingleRecord);
router.post("/", requireAuth, createRecord);
router.put("/:id", requireAuth, updateRecord);
router.delete("/:id", requireAuth, deleteRecord);

export default router;
