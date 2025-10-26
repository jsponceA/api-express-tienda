import request from "supertest";
import { describe, it, expect } from "vitest";

import app from "../src/app.js";

describe("Products CRUD", () => {
  it("creates, reads, updates and deletes a product", async () => {
    // Create
    const createRes = await request(app)
      .post("/api/v1/products")
      .send({ name: "Test Product", price: 12.5 })
      .set("Accept", "application/json");

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty("id");
    const id = createRes.body.id;

    // Read
    const getRes = await request(app).get(`/api/v1/products/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body).toMatchObject({ id, name: "Test Product", price: 12.5 });

    // Update
    const updateRes = await request(app)
      .put(`/api/v1/products/${id}`)
      .send({ name: "Updated", price: 15 });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({ id, name: "Updated", price: 15 });

    // Delete
    const delRes = await request(app).delete(`/api/v1/products/${id}`);
    expect(delRes.status).toBe(204);

    // Confirm deleted
    const notFound = await request(app).get(`/api/v1/products/${id}`);
    expect(notFound.status).toBe(404);
  });
});
