import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

app.use(errorMiddleware);
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});