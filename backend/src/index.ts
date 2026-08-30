import { config } from "dotenv";
import { resolve } from "path";
import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin.split(",").map((s) => s.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: "12mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mr-mobile-zone-backend" });
});

app.use("/api", apiRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
