import request from "supertest";
import app from "../src/app";
import { closeDatabase } from "./helpers/db";

afterAll(closeDatabase);

describe("GET /docs", () => {
  it("serve a documentação Swagger", async () => {
    const res = await request(app).get("/docs/").redirects(1);

    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger-ui");
  });
});
