import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import transactionsRoutes from "./routes/transactions.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Health Check Route
 */
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "Finance Control API",
    environment: process.env.NODE_ENV,
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/transactions", transactionsRoutes);

app.use(errorMiddleware);

export default app;