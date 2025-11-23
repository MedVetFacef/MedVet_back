import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const clinicService = {
  async create(data) {
    return await prisma.clinic.create({ data });
  },

  async list() {
    return await prisma.clinic.findMany();
  },

  async getById(id) {
    return await prisma.clinic.findUnique({
      where: { id: Number(id) },
    });
  },

  async update(id, data) {
    return await prisma.clinic.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return await prisma.clinic.delete({
      where: { id: Number(id) },
    });
  },
};
