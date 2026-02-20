import express from "express";
import cors from "cors";
import transactionsRoutes from "./routes/transactions.routes";
import { errorMiddleware } from "./middlewares/error.middleware";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/transactions", transactionsRoutes);
app.use(errorMiddleware);

export default app;