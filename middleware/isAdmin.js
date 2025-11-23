import ErrorHandler from "../utils/errorHandle.js";

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Acesso negado. Faça login primeiro.", 401));
  }

  if (req.user.email !== "admin@admin.com") {
    return next(new ErrorHandler("Acesso negado. Apenas administradores podem realizar esta ação.", 403));
  }

  next();
};

