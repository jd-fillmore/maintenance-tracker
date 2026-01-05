import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../server";

const prisma = new PrismaClient();

beforeAll(async () => {
  console.log("🧪 Starting tests...");
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Service Records API", () => {
  let authCookie: string;
  let testUserId: string;
  let testRecordId: string;

  // Test 1: Sign up a new user
  test("POST /api/auth/sign-up/email - should create new user", async () => {
    const response = await request(app)
      .post("/api/auth/sign-up/email")
      .set("Origin", "http://localhost:5173")
      .send({
        email: `test-${Date.now()}@example.com`,
        password: "password123",
        name: "Test User",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user).toHaveProperty("email");

    // Save the cookie from set-cookie header
    authCookie = response.headers["set-cookie"];
    testUserId = response.body.user.id;
  });

  // Test 2: Access protected route without auth
  test("GET /api/service-records - should fail without auth", async () => {
    const response = await request(app).get("/api/service-records");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error", "Unauthorized");
  });

  // Test 3: Create a service record
  test("POST /api/service-records - should create new record", async () => {
    const response = await request(app)
      .post("/api/service-records")
      .set("Cookie", authCookie) // Send the cookie
      .set("Origin", "http://localhost:5173")
      .send({
        date: "2024-12-07T10:00:00Z",
        serviceType: "Oil Change",
        serviceTime: 2.5,
        equipmentId: "TEST-001",
        equipmentType: "Forklift",
        technician: "Test Tech",
        partsUsed: "Test parts",
        serviceNotes: "Test notes",
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("id");
    expect(response.body.data.serviceType).toBe("Oil Change");

    testRecordId = response.body.data.id;
  });

  // Test 4: Get all service records
  test("GET /api/service-records - should return user records", async () => {
    const response = await request(app)
      .get("/api/service-records")
      .set("Cookie", authCookie) // Send the cookie
      .set("Origin", "http://localhost:5173");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test 5: Delete service record
  test("DELETE /api/service-records/:id - should delete record", async () => {
    const response = await request(app)
      .delete(`/api/service-records/${testRecordId}`)
      .set("Cookie", authCookie) // Send the cookie
      .set("Origin", "http://localhost:5173");

    expect(response.status).toBe(204);

    // Verify it's deleted
    const getResponse = await request(app)
      .get(`/api/service-records/${testRecordId}`)
      .set("Cookie", authCookie) // Send the cookie
      .set("Origin", "http://localhost:5173");

    expect(getResponse.status).toBe(404);
  });
});
