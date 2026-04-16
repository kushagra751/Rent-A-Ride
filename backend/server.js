import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js'
import vendorRoute from './routes/venderRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";
import User from "./models/userModel.js";


const App = express();


App.use(express.json());
App.use(cookieParser())


dotenv.config();
const port = Number(process.env.PORT) || 3001;
mongoose.set("bufferCommands", false);

mongoose
  .connect(process.env.mongo_uri, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(async () => {
    console.log("connected");
    // Fix for local dev: allow multiple users without phoneNumber by using a sparse unique index.
    try {
      await User.collection.dropIndex("phoneNumber_1");
    } catch {
      // ignore if index doesn't exist
    }
    try {
      await User.collection.createIndex(
        { phoneNumber: 1 },
        { unique: true, sparse: true }
      );
    } catch (e) {
      console.error("Could not ensure phoneNumber index:", e?.message ?? e);
    }
  })
  .catch((error) => console.error(error));

const allowedOrigins = [
  "https://rent-a-ride-two.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_APP_URL,
];

App.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser clients (curl/postman)
      if (!origin) return callback(null, true);

      // allow explicit list + any Vite localhost port (5170-5179)
      if (allowedOrigins.filter(Boolean).includes(origin)) return callback(null, true);
      if (/^http:\/\/localhost:517\d$/.test(origin)) return callback(null, true);
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods:['GET', 'PUT', 'POST' ,'PATCH','DELETE'],
    credentials: true, // Enables the Access-Control-Allow-Credentials header
  })
);


App.use('*', cloudinaryConfig);

App.get("/health", (_req, res) => {
  const mongoStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const mongoState = mongoStates[mongoose.connection.readyState] || "unknown";

  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    ok: mongoose.connection.readyState === 1,
    mongo: mongoState,
  });
});

App.use((req, res, next) => {
  if (req.path === "/health") return next();

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      succes: false,
      message:
        "Database is not connected. Check the backend mongo_uri environment variable and MongoDB Atlas network access.",
      statusCode: 503,
    });
  }

  return next();
});

// App.get('/*', (req, res) => res.sendFile(resolve(__dirname, '../public/index.html')));


App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin",adminRoute);
App.use("/api/vendor",vendorRoute)



App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    succes: false,
    message,
    statusCode,
  });
});

App.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
