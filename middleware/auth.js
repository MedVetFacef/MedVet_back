import catchAsyncErrors from "./catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandle.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // Tenta pegar o token do header Authorization ou dos cookies
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorHandler("Por favor, faça login para acessar este recurso", 401));
  }

  if (!process.env.JWT_SECRET) {
    return next(new ErrorHandler("Erro de configuração do servidor: JWT_SECRET não configurada", 500));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  if (!req.user) {
    return next(new ErrorHandler("Usuário não encontrado", 401));
  }

  next();
});

