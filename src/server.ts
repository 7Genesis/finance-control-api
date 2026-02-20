import app from "./app";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import dotenv from "dotenv";

dotenv.config();

app.use(errorMiddleware);
app.use("/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http:localhost:${PORT}`);
});