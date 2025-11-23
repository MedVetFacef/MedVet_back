import { clinicService } from "../services/clinicService.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandle.js";

export const clinicControllers = {
  create: catchAsyncErrors(async (req, res, next) => {
    try {
      const clinic = await clinicService.create(req.body);
      res.status(201).json(clinic);
    } catch (error) {
      if (error.code === 'P1001' || error.code === 'P1017') {
        return next(new ErrorHandler("Não foi possível conectar ao banco de dados PostgreSQL. Verifique se o serviço está rodando e se a DATABASE_URL está correta.", 503));
      }
      throw error;
    }
  }),

  list: catchAsyncErrors(async (req, res, next) => {
    try {
      const clinics = await clinicService.list();
      res.status(200).json(clinics);
    } catch (error) {
      if (error.code === 'P1001' || error.code === 'P1017' || error.code === 'P1000') {
        return next(new ErrorHandler("Não foi possível conectar ao banco de dados PostgreSQL. Verifique se o serviço está rodando e se a DATABASE_URL está correta.", 503));
      }
      if (error.message?.includes('PrismaClient') || error.name === 'PrismaClientInitializationError') {
        return next(new ErrorHandler("Erro na conexão com o banco de dados. Verifique a configuração do PostgreSQL.", 503));
      }
      throw error;
    }
  }),

  getById: catchAsyncErrors(async (req, res, next) => {
    try {
      const clinic = await clinicService.getById(req.params.id);
      
      if (!clinic) {
        return next(new ErrorHandler("Clínica não encontrada", 404));
      }
      
      res.status(200).json(clinic);
    } catch (error) {
      if (error.code === 'P1001' || error.code === 'P1017' || error.code === 'P2025') {
        if (error.code === 'P2025') {
          return next(new ErrorHandler("Clínica não encontrada", 404));
        }
        return next(new ErrorHandler("Não foi possível conectar ao banco de dados PostgreSQL. Verifique se o serviço está rodando.", 503));
      }
      throw error;
    }
  }),

  update: catchAsyncErrors(async (req, res, next) => {
    try {
      const clinic = await clinicService.update(req.params.id, req.body);
      res.status(200).json(clinic);
    } catch (error) {
      if (error.code === 'P1001' || error.code === 'P1017') {
        return next(new ErrorHandler("Não foi possível conectar ao banco de dados PostgreSQL. Verifique se o serviço está rodando.", 503));
      }
      if (error.code === 'P2025') {
        return next(new ErrorHandler("Clínica não encontrada", 404));
      }
      throw error;
    }
  }),

  delete: catchAsyncErrors(async (req, res, next) => {
    try {
      await clinicService.delete(req.params.id);
      res.status(200).json({ message: "Clínica deletada com sucesso" });
    } catch (error) {
      if (error.code === 'P1001' || error.code === 'P1017') {
        return next(new ErrorHandler("Não foi possível conectar ao banco de dados PostgreSQL. Verifique se o serviço está rodando.", 503));
      }
      if (error.code === 'P2025') {
        return next(new ErrorHandler("Clínica não encontrada", 404));
      }
      throw error;
    }
  })
};
