import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongo from "../shared/config/mongo.config.js";
import productRoutes from "./routes/listing.route.js"
import globalErrorHandler from "../shared/utils/error-handler.util.js";
dotenv.config();
connectMongo();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/listings", productRoutes)

app.use(globalErrorHandler);


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("Server error:", err.message);

    if (err.code === "EADDRINUSE") {
        console.error("Port already in use");
    }

    process.exit(1);
});
