import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDb } from "./src/config/db.js";
import { bootstrapDatabase } from "./src/config/bootstrapData.js";

dotenv.config();

const port = process.env.PORT || 5000;

const bootstrap = async () => {
  try {
    await connectDb();
    await bootstrapDatabase();
    app.listen(port, () => {
      console.log(`Backend is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

bootstrap();
