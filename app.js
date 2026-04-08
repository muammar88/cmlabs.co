// ===== IMPORTS =====
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Load environment variables
dotenv.config();

// ===== INITIALIZE =====
const app = express();
const PORT = process.env.PORT || 3033;
const SESSION_DURATION = 3600000; // 1 hour

// ===== ALLOWED ORIGINS =====
const ALLOWED_ORIGINS = [
  // Development
  "http://localhost:5173",
  "http://localhost:3033",
];

// ===== MIDDLEWARES =====

/**
 * CORS Configuration
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without origin (Postman, curl, server-to-server)

      if (!origin) {
        return callback(null, true);
      }

      // Development: allow all origins
      if (process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      // Production: check against allowed origins
      if (ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  }),
);

/**
 * Body Parser
 */
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * Preflight requests handler
 */
app.options("*", cors());

/**
 * Session Configuration
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "OutletTacob4",
    name: "craw_sessid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date(Date.now() + SESSION_DURATION),
      maxAge: SESSION_DURATION,
    },
  }),
);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Static files
 */
app.set("view engine", "ejs");
// jadikan results sebagai root
app.use(express.static(path.join(__dirname, "results")));

// ===== ROUTES =====

/**
 * Load routers dynamically
 */
const ROUTER_LIST = ["main"];

const routers = {};

ROUTER_LIST.forEach((routerName) => {
  if (
    typeof routerName === "object" &&
    Object.keys(routerName.list).length > 0
  ) {
    routerName.list.forEach((item) => {
      routers[`router_${item}`] = require(
        `./router/${routerName.folder}/${item}/index`,
      );
    });
  } else {
    routers[`router_${routerName}`] = require(`./router/router_${routerName}`);
  }
});

// Register all routers
Object.values(routers).forEach((router) => {
  app.use(router);
});

// ===== DATABASE =====

/**
 * Initialize database
 */
if (process.env.ENABLE_DB === "true") {
  const db = require("./backup/models");

  (async () => {
    try {
      await db.sequelize.sync();
      console.log("Database synchronized");
    } catch (error) {
      console.error("Database sync error:", error);
    }
  })();
} else {
  console.log("🟡 Database disabled");
}

// ===== ERROR HANDLING =====

/**
 * Global error handler middleware (CORS and other errors)
 */
app.use((err, req, res, next) => {
  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      message: "CORS Error: Origin not allowed",
      status: 403,
      origin: req.get("origin"),
    });
  }

  // Handle other errors
  console.error("Internal Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong!",
    status: err.status || 500,
  });
});

/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    status: 404,
    path: req.path,
  });
});

// ===== START SERVER =====

const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Allowed Origins: ${ALLOWED_ORIGINS.join(", ")}\n`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;
