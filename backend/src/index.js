import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import { createServer } from "http";

import {initializeSocket} from "./lib/socket.js";

import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from "./lib/db.js";


dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app)
initializeSocket(httpServer);

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

app.use(express.json());  // to parse req.body
app.use(clerkMiddleware());  // this will add auth to req obj => req.auth
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "/tmp"),
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024,  // 10mb max file size
    },
})
);

app.use("/api/users" , userRoutes);
app.use("/api/auth" , authRoutes);
app.use("/api/admin" , adminRoutes);
app.use("/api/songs" , songRoutes);
app.use("/api/albums" , albumRoutes);
app.use("/api/stats" , statRoutes);

// error handler
app.use((err,req,res,next) => {
    res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});


httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
    connectDB();
});