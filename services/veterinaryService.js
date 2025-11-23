import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const veterinaryService = {
  async create(data) {
    return await prisma.veterinario.create({ data });
  },

  async list() {
    return await prisma.veterinario.findMany({
      include: {
        clinic: true,
      },
    });
  },

  async getById(id) {
    return await prisma.veterinario.findUnique({
      where: { id: Number(id) },
      include: {
        clinic: true,
      },
    });
  },

  async update(id, data) {
    return await prisma.veterinario.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    return await prisma.veterinario.delete({
      where: { id: Number(id) },
    });
  },
};
