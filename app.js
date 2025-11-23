import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middleware/erros.js";
import clinicRoutes from "./routes/clinicRoutes.js";
import veterinaryRoutes from "./routes/veterinaryRoutes.js";
import vetRoutes from "./routes/vet.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

const app = express();

// Carrega variáveis de ambiente - tenta múltiplos caminhos
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tenta carregar o .env de diferentes locais (apenas em desenvolvimento)
// Em produção, as variáveis devem vir do sistema (Docker, Railway, etc)
if (process.env.NODE_ENV !== 'production') {
  const envPaths = [
    join(__dirname, 'config', 'config.env'),
    join(process.cwd(), 'config', 'config.env'),
  ];

  let envLoaded = false;
  for (const envPath of envPaths) {
    try {
      const result = dotenv.config({ path: envPath });
      if (!result.error) {
        envLoaded = true;
        console.log(`✅ Variáveis de ambiente carregadas de: ${envPath}`);
        break;
      }
    } catch (err) {
      // Continua tentando próximo caminho
    }
  }

  if (!envLoaded) {
    console.warn("⚠️  AVISO: Não foi possível carregar o arquivo config.env. Usando variáveis de ambiente do sistema.");
  }
} else {
  console.log("🔧 Modo PRODUÇÃO: Usando variáveis de ambiente do sistema.");
}

connectDatabase();

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ 
    message: "API está funcionando!",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/v1/test", (req, res) => {
  res.json({ 
    message: "API v1 está funcionando!",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1", vetRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/veterinaries", veterinaryRoutes);

app.use(errorMiddleware);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {});

process.on("uncaughtException", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (err) => {
  server.close(() => {
    process.exit(1);
  });
});
