import { veterinaryService } from "../services/veterinaryService.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandle.js";

export const veterinaryControllers = {
  create: catchAsyncErrors(async (req, res, next) => {
    const vet = await veterinaryService.create(req.body);
    res.status(201).json(vet);
  }),

  list: catchAsyncErrors(async (req, res, next) => {
    const vets = await veterinaryService.list();
    res.status(200).json(vets);
  }),

  getById: catchAsyncErrors(async (req, res, next) => {
    const vet = await veterinaryService.getById(req.params.id);
    
    if (!vet) {
      return next(new ErrorHandler("Veterinário não encontrado", 404));
    }
    
    res.status(200).json(vet);
  }),

  update: catchAsyncErrors(async (req, res, next) => {
    const vet = await veterinaryService.update(req.params.id, req.body);
    res.status(200).json(vet);
  }),

  delete: catchAsyncErrors(async (req, res, next) => {
    await veterinaryService.delete(req.params.id);
    res.status(200).json({ message: "Veterinário deletado com sucesso" });
  }),
};
