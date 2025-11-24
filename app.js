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
import mongoose from "mongoose";

const app = express();

// Carrega variáveis de ambiente - tenta múltiplos caminhos
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.env.NODE_ENV === 'PRODUCTION') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
}

// Tenta carregar o .env de diferentes locais
// Em produção, tenta carregar como fallback se variáveis não estiverem definidas
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
  if (process.env.NODE_ENV === 'PRODUCTION') {
    console.log("🔧 Modo PRODUÇÃO: Usando variáveis de ambiente do sistema.");
  } else {
    console.warn("⚠️  AVISO: Não foi possível carregar o arquivo config.env. Usando variáveis de ambiente do sistema.");
  }
}

// Verifica variáveis de ambiente críticas
console.log("📋 Verificando variáveis de ambiente:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV || 'não definido'}`);
console.log(`  - PORT: ${process.env.PORT || 'não definido (usando 3000)'}`);
console.log(`  - DB_URI: ${process.env.DB_URI ? '✅ configurada' : '❌ não configurada'}`);
console.log(`  - DATABASE_URL: ${process.env.DATABASE_URL ? '✅ configurada' : '❌ não configurada'}`);
console.log(`  - JWT_SECRET: ${process.env.JWT_SECRET ? '✅ configurada' : '❌ não configurada'}`);

// Avisos sobre variáveis críticas faltando
const missingVars = [];
if (!process.env.JWT_SECRET) {
  missingVars.push('JWT_SECRET');
  console.error('⚠️  ATENÇÃO: JWT_SECRET não configurada! Autenticação não funcionará.');
}
if (!process.env.DB_URI && !process.env.DATABASE_URL) {
  missingVars.push('DB_URI ou DATABASE_URL');
  console.error('⚠️  ATENÇÃO: Nenhum banco de dados configurado! Aplicação pode não funcionar.');
}

if (missingVars.length > 0 && process.env.NODE_ENV === 'PRODUCTION') {
  console.error('❌ Variáveis críticas faltando:', missingVars.join(', '));
  console.error('📝 Configure essas variáveis no Railway: Settings → Variables');
}

// Conecta ao banco de dados (não bloqueia o servidor se falhar)
connectDatabase().catch((err) => {
  console.error('❌ Erro ao inicializar conexão com banco:', err.message);
  // Continua iniciando o servidor mesmo se o banco falhar
});

// Configuração CORS para produção
const corsOptions = {
  origin: function (origin, callback) {
    // Em produção, aceita requisições do Vercel e Railway
    const allowedOrigins = [
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.railway\.app$/,
      /^https:\/\/medvet.*\.vercel\.app$/,
      /^http:\/\/localhost:\d+$/, // Para desenvolvimento local
    ];
    
    // Se não há origin (ex: requisições do Postman, mobile apps), permite
    if (!origin) {
      return callback(null, true);
    }
    
    // Verifica se a origin está na lista de permitidas
    const isAllowed = allowedOrigins.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // Em desenvolvimento, permite qualquer origem
        if (process.env.NODE_ENV !== 'PRODUCTION') {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS bloqueado para origin: ${origin}`);
        callback(null, true); // Por enquanto permite tudo, mas loga
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400, // 24 horas
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ 
    message: "API está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  });
});

app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: "ok",
    message: "API está funcionando!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      mongodb: dbStatus,
      postgres: "checking..." // Prisma será verificado nas rotas
    }
  });
});

app.get("/api/v1/test", (req, res) => {
  res.json({ 
    message: "API v1 está funcionando!",
    timestamp: new Date().toISOString(),
    origin: req.headers.origin || 'N/A',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use("/api/v1", authRoutes);
app.use("/api/v1/chatbot", chatbotRoutes);
app.use("/api/v1", vetRoutes);
app.use("/api/v1/clinics", clinicRoutes);
app.use("/api/v1/veterinaries", veterinaryRoutes);

app.use(errorMiddleware);

// Rota catch-all para produção (servir o frontend React)
// Deve estar no final, depois de todas as rotas da API
if (process.env.NODE_ENV === 'PRODUCTION') {
  // Serve o index.html para todas as rotas GET que não são da API
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    } else {
      next();
    }
  });
}

// Middleware 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.path}`,
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Railway precisa escutar em 0.0.0.0

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API disponível em: http://${HOST}:${PORT}/api/v1`);
  console.log(`🔗 Health check: http://${HOST}:${PORT}/health`);
});

// Tratamento de erros não capturados
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  console.error("Stack:", err.stack);
  // Não encerra imediatamente, permite que o servidor tente se recuperar
  // Em produção, você pode querer encerrar após logar
  if (process.env.NODE_ENV === 'PRODUCTION') {
    server.close(() => {
      process.exit(1);
    });
  }
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  // Loga mas não encerra o servidor
  // Em produção, você pode querer encerrar
  if (process.env.NODE_ENV === 'PRODUCTION') {
    console.error("Stack:", err?.stack);
  }
});
