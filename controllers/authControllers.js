import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandle.js";

export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Por favor, preencha todos os campos", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = user.getJwtToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.email === "admin@admin.com",
    },
  });
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Por favor, insira email e senha", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Email ou senha incorretos", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Email ou senha incorretos", 401));
  }

  const token = user.getJwtToken();

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.email === "admin@admin.com",
    },
  });
});

export const getCurrentUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Usuário não autenticado", 401));
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.email === "admin@admin.com",
    },
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return next(new ErrorHandler("Por favor, informe um nome/apelido", 400));
  }

  if (name.length > 50) {
    return next(new ErrorHandler("O nome não pode ter mais de 50 caracteres", 400));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ErrorHandler("Usuário não encontrado", 404));
  }

  user.name = name.trim();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.email === "admin@admin.com",
    },
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ErrorHandler("Por favor, informe a senha atual e a nova senha", 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorHandler("A nova senha deve ter no mínimo 6 caracteres", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ErrorHandler("Usuário não encontrado", 404));
  }

  // Verificar se a senha atual está correta
  const isPasswordMatched = await user.comparePassword(currentPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Senha atual incorreta", 401));
  }

  // Atualizar senha
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Senha atualizada com sucesso",
  });
});
