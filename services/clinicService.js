import { PrismaClient } from "@prisma/client";

// Inicializa Prisma Client com tratamento de erro
let prisma;
try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} catch (error) {
  console.error('❌ Erro ao inicializar Prisma Client:', error.message);
  // Cria uma instância vazia para evitar crash
  prisma = null;
}

export const clinicService = {
  async create(data) {
    if (!prisma) throw new Error('Prisma Client não inicializado. Verifique DATABASE_URL.');
    return await prisma.clinic.create({ data });
  },

  async list() {
    if (!prisma) throw new Error('Prisma Client não inicializado. Verifique DATABASE_URL.');
    return await prisma.clinic.findMany();
  },

  async getById(id) {
    if (!prisma) throw new Error('Prisma Client não inicializado. Verifique DATABASE_URL.');
    return await prisma.clinic.findUnique({
      where: { id: Number(id) },
    });
  },

  async update(id, data) {
    if (!prisma) throw new Error('Prisma Client não inicializado. Verifique DATABASE_URL.');
    return await prisma.clinic.update({
      where: { id: Number(id) },
      data,
    });
  },

  async delete(id) {
    if (!prisma) throw new Error('Prisma Client não inicializado. Verifique DATABASE_URL.');
    return await prisma.clinic.delete({
      where: { id: Number(id) },
    });
  },
};
