import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import protect from "./middleware/authMiddleware";
import leadRoutes from "./routes/leadRoutes";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/leads", leadRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/auth", authRoutes);
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route working"
  });
});



export default app;