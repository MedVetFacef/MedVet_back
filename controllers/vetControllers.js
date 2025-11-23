import Vet from "../models/vet.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandle.js";

export const getVets = async (req, res, next) => {
  try {
    // Aplicar filtros de busca e outros filtros
    const apiFilters = new APIFilters(Vet, req.query).search().filters();

    // Buscar todas as consultas (sem paginação)
    // A paginação pode ser aplicada no frontend se necessário
    const vets = await apiFilters.query.sort({ createdAt: -1 }); // Ordenar por mais recente primeiro
    
    const filteredVetsCount = vets.length;

    res.status(200).json({
      resPerPage: filteredVetsCount, // Retornar todas
      filteredVetsCount,
      vets,
    });
  } catch (err) {
    next(err);
  }
};

export const newVet = async (req, res, next) => {
  try {
    // Adicionar o ID do usuário autenticado (vem do middleware isAuthenticated)
    const vetData = {
      ...req.body,
      user: req.user._id, // Adicionar o ID do usuário autenticado
    };

    // Converter dateConsult para Date se for string
    if (vetData.dateConsult && typeof vetData.dateConsult === 'string') {
      vetData.dateConsult = new Date(vetData.dateConsult);
    }

    const vet = await Vet.create(vetData);

    res.status(201).json({
      success: true,
      vet,
    });
  } catch (err) {
    next(err);
  }
};

export const getVetbyID = async (req, res, next) => {
  try {
    const vet = await Vet.findById(req?.params?.id);

    if (!vet) {
      return next(new ErrorHandler("Cadastro não encontrado", 404));
    }

    res.status(200).json({
      vet,
    });
  } catch (err) {
    next(err);
  }
};

export const updateVetbyID = async (req, res, next) => {
  try {
    let vet = await Vet.findById(req?.params?.id);

    if (!vet) {
      return next(new ErrorHandler("Cadastro não encontrado", 404));
    }

    vet = await Vet.findByIdAndUpdate(req?.params?.id, req.body, {
      new: true,
    });

    res.status(200).json({
      vet,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVetbyID = async (req, res, next) => {
  try {
    const vet = await Vet.findById(req?.params?.id);

    if (!vet) {
      return next(new ErrorHandler("Cadastro não encontrado", 404));
    }

    await vet.deleteOne();

    res.status(200).json({
      message: "Cadastro deletado",
    });
  } catch (err) {
    next(err);
  }
};
