import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllRecords = async (req: Request, res: Response) => {
  try {
    const records = await prisma.serviceRecord.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });

    res.json(records);
  } catch (error) {
    console.error("Error fetching service records:", error);
    res.status(500).json({ error: "Failed to fetch service records" });
  }
};

export const getSingleRecord = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;
    const record = await prisma.serviceRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (record.userId !== req.user!.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching service record:", error);
    res.status(400).json({ error: "Record does not exist" });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    const {
      date,
      serviceType,
      serviceTime,
      equipmentId,
      equipmentType,
      technician,
      partsUsed,
      serviceNotes,
    } = req.body;

    if (
      !date ||
      !serviceType ||
      !serviceTime ||
      !equipmentId ||
      !equipmentType ||
      !technician ||
      !serviceNotes
    ) {
      return res.status(400).json({
        error: "Missing required fields",
        required: [
          "date",
          "serviceType",
          "serviceTime",
          "equipmentId",
          "equipmentType",
          "technician",
          "serviceNotes",
        ],
      });
    }

    const newRecord = await prisma.serviceRecord.create({
      data: {
        date: new Date(date),
        serviceType,
        serviceTime: parseFloat(serviceTime),
        equipmentId,
        equipmentType,
        technician,
        partsUsed: partsUsed || null,
        serviceNotes,
        userId: req.user!.id,
      },
    });

    res.status(201).json({ data: newRecord });
  } catch (error) {
    console.error("Error creating new record:", error);
    res.status(500).json({ error: "Failed to create new record" });
  }
};

export const updateRecord = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;

    const existingRecord = await prisma.serviceRecord.findUnique({
      where: { id: recordId },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (existingRecord.userId !== req.user!.id) {
      return res.status(403).json({
        error: "Forbidden: You don't own this record",
      });
    }

    const {
      date,
      serviceType,
      serviceTime,
      equipmentId,
      equipmentType,
      technician,
      partsUsed,
      serviceNotes,
    } = req.body;

    const updatedRecord = await prisma.serviceRecord.update({
      where: { id: recordId },
      data: {
        ...(date && { date: new Date(date) }),
        ...(serviceType && { serviceType }),
        ...(serviceTime && { serviceTime: parseFloat(serviceTime) }),
        ...(equipmentId && { equipmentId }),
        ...(equipmentType && { equipmentType }),
        ...(technician && { technician }),
        ...(partsUsed !== undefined && { partsUsed }),
        ...(serviceNotes && { serviceNotes }),
      },
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error("Error updating service record:", error);
    res.status(500).json({ error: "Failed to update service record" });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    const recordId = req.params.id;

    const record = await prisma.serviceRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    if (record.userId !== req.user!.id) {
      return res.status(403).json({
        error: "Forbidden: You don't own this record",
      });
    }

    await prisma.serviceRecord.delete({
      where: { id: recordId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting service record:", error);
    res.status(500).json({ error: "Failed to delete service record" });
  }
};
