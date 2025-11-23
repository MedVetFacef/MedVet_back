export default (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    message: err?.message || "Erro interno do servidor",
  };

  if (err.code === "P2025") {
    error.statusCode = 404;
    error.message = "Registro não encontrado";
  }

  if (err.code === "P1001" || err.code === "P1017" || err.code === "P1000") {
    error.statusCode = 503;
    error.message = "Erro ao conectar com o banco de dados PostgreSQL. Verifique se o serviço está rodando e se a DATABASE_URL está correta.";
  }

  if (err.message && err.message.includes("PrismaClient")) {
    error.statusCode = 503;
    error.message = "Erro na configuração do banco de dados. Execute 'npm run prisma:generate' ou verifique a configuração do Prisma.";
  }

  if (err.name === "ValidationError") {
    error.statusCode = 400;
    error.message = Object.values(err.errors).map((e) => e.message).join(", ");
  }

  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = "Registro duplicado. Este valor já existe.";
  }

  if (err.name === "MongoServerError") {
    if (err.code === 11000) {
      error.statusCode = 400;
      error.message = "Este email já está cadastrado.";
    }
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};
